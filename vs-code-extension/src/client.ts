import fetch from "node-fetch";
import { EditSelectionRequest, EditSelectionResponse } from "../../app/api/types/api";
import * as vscode from "vscode";

const apiServer = vscode.workspace.getConfiguration("clippy-ai").get("apiServer");

export async function createEdit(request: EditSelectionRequest) {
  const resp = await fetch(`${apiServer}/editSelection`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  const parsed = (await resp.json()) as EditSelectionResponse;
  let replacement = parsed?.data?.choices?.[0]?.text;
  if (request.input?.trimEnd() === request.input) replacement = replacement?.trimEnd();

  return { replacement, parsedInstruction: parsed.parsedInstruction };
}
