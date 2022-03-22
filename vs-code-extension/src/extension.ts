import * as vscode from "vscode";
import codexEdit from "./codexEdit";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(vscode.commands.registerCommand("clippy-ai.codexEdit", codexEdit));
}

export function deactivate() {}
