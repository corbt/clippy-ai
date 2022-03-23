import fetch from "node-fetch";
import { OaiProxyRequest, OaiProxyResponse } from "../../app/api/types/api";
import * as vscode from "vscode";

const apiServer = vscode.workspace.getConfiguration("clippy-ai").get("apiServer");
console.log(`apiServer1: ${apiServer}`);

export async function createEdit(request: OaiProxyRequest) {
  const endpoint = `${apiServer}/api/edit`;
  console.log(`apiServer2: ${apiServer}`);
  const resp = await fetch(`${apiServer}/oaiProxy`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  const parsed = (await resp.json()) as OaiProxyResponse;
  let suggestedEdit = parsed?.data?.choices?.[0]?.text;
  if (request.input?.trimEnd() === request.input) suggestedEdit = suggestedEdit?.trimEnd();

  return suggestedEdit;
}
