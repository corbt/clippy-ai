import * as vscode from "vscode";
import { setContext } from "./context";
import editSelection from "./editSelection";

export function activate(context: vscode.ExtensionContext) {
  setContext(context);

  context.subscriptions.push(
    vscode.commands.registerCommand("clippy-ai.editSelection", editSelection)
  );
}

export function deactivate() {}
