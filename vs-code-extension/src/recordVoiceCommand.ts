import { spawn } from "child_process";
import * as vscode from "vscode";
import { readFile } from "fs/promises";
import { EditSelectionRequest } from "../../app/api/types/api";
import getContext from "./context";
import { default as spawnAsync, SpawnResult } from "@expo/spawn-async/build/spawnAsync";

const getAudioDevice = async () => {
  const device = getContext().globalState.get("audioDevice");
  console.log({ device });
  if (device) return device;
  try {
    await spawnAsync("ffmpeg", ["-f", "avfoundation", "-list_devices", "true", "-i", '""'], {});
  } catch (error) {
    const lines = (error as SpawnResult).stderr.split("\n");
    const audioStartIndex = lines.findIndex((l) => l.includes("AVFoundation audio devices:"));
    const devices = lines
      .slice(audioStartIndex + 1)
      .filter((l) => l.startsWith("[AVFoundation indev @"))
      .map((l) => {
        const [, id, name] = l.match(/\[AVFoundation indev .*?\] \[(\d+)\] (.*)/) || [];
        return { id, name };
      });
    const device = await vscode.window.showQuickPick(
      devices.map((d) => d.name),
      {
        placeHolder: "Select audio device",
      }
    );
    if (!device) return null;
    const deviceId = devices.find((d) => d.name === device)?.id;
    getContext().globalState.update("audioDevice", deviceId);
  }
};

const recordVoiceCommand = (): Promise<EditSelectionRequest["instruction"] | null> =>
  new Promise(async (resolve, reject) => {
    try {
      const device = await getAudioDevice();
      const child = spawn("ffmpeg", [
        "-y",
        "-f",
        "avfoundation",
        "-i",
        `:${device}`,
        "-ar",
        "16000",
        "-t",
        "15",
        "/tmp/capture.flac",
      ]);

      let input: string | undefined = undefined;
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

      input = await vscode.window.showInputBox({
        prompt: "Recording Clippy command from the microphone",
        placeHolder: "Press 'enter' use recorded command, or type a command here manually",
      });

      child.stdin.write("q");
    } catch (error) {
      vscode.window.showErrorMessage((error as Error).message);
      resolve(null);
    }
  });

export default recordVoiceCommand;
