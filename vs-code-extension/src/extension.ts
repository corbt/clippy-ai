import * as vscode from "vscode";
import editSelection from "./editSelection";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("clippy-ai.editSelection", editSelection)
  );
}

export function deactivate() {}
