import * as vscode from "vscode";
import { v4 as uuidv4 } from "uuid";

let context: vscode.ExtensionContext;

export function setContext(newContext: vscode.ExtensionContext) {
  context = newContext;
}

export default function getContext(): vscode.ExtensionContext {
  if (!context) throw new Error("Context not set");
  return context;
}

export function getUserId() {
  if (context.globalState.get("userId") === undefined) {
    context.globalState.update("userId", uuidv4());
  }
  return context.globalState.get("userId") as string;
}
