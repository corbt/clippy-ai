import fetch from "node-fetch";
import { EditSelectionRequest, EditSelectionResponse } from "../../app/api/types/api";
import * as vscode from "vscode";
import getContext, { getUserId } from "./context";

const getServer = () => {
  const server = vscode.workspace.getConfiguration("clippy-ai").get("apiServer");
  if (server) return server;

  if (getContext().extensionMode === vscode.ExtensionMode.Development)
    return "http://localhost:8911";

  return "https://api.clippyai.com";
};

const version = vscode.extensions.getExtension("clippy-ai.clippy-ai")?.packageJSON.version || "0";

export async function createEdit(params: Pick<EditSelectionRequest, "input" | "instruction">) {
  const body: EditSelectionRequest = {
    ...params,
    user: getUserId(),
    client: "vscode",
    version,
  };
  const resp = await fetch(`${getServer()}/editSelection`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const parsed = (await resp.json()) as EditSelectionResponse;

  if ("error" in parsed) {
    throw new Error(parsed.error);
  }

  let replacement = parsed?.data?.choices?.[0]?.text;
  if (params.input?.trimEnd() === params.input) replacement = replacement?.trimEnd();

  return { replacement, parsedInstruction: parsed.parsedInstruction };
}
