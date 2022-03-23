import fetch from "node-fetch";
import { OaiProxyRequest, OaiProxyResponse } from "../../app/api/types/api";
import * as vscode from "vscode";

export async function createEdit(request: OaiProxyRequest) {
  const apiServer = vscode.workspace.getConfiguration("clippi-ai").get("apiServer");
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
