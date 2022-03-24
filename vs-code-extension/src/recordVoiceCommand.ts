import { spawn } from "child_process";
import * as vscode from "vscode";
import { readFile } from "fs/promises";
import { EditSelectionRequest } from "../../app/api/types/api";

const recordVoiceCommand = (): Promise<EditSelectionRequest["instruction"] | null> =>
  new Promise(async (resolve, reject) => {
    try {
      const child = spawn("ffmpeg", [
        "-y",
        "-f",
        "avfoundation",
        "-i",
        ":1",
        "-ar",
        "16000",
        "/tmp/capture.flac",
      ]);
      const input = await vscode.window.showInputBox({
        prompt: "Recording Clippy command from the microphone",
        placeHolder: "Press 'enter' use recorded command, or type a command here manually",
      });

      child.addListener("exit", async () => {
        if (input === undefined) {
          resolve(null);
        } else if (input === "") {
          resolve({
            type: "voice",
            contents: (await readFile("/tmp/capture.flac")).toString("base64"),
          });
        } else {
          resolve({ type: "text", contents: input });
        }
      });

      child.stdin.write("q");
    } catch (error) {
      vscode.window.showErrorMessage(error.message);
      resolve(null);
    }
  });

export default recordVoiceCommand;
