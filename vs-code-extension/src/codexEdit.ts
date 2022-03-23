import * as vscode from "vscode";
import { createEdit } from "./client";

export default async function codexEdit() {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) return;

  const instruction = await vscode.window.showInputBox({
    title: "Instructions for Clippy",
    value: "",
  });
  if (!instruction) return;

  await vscode.commands.executeCommand("workbench.action.files.saveWithoutFormatting");

  let selections = activeEditor.selections.filter((selection) => !selection.isEmpty);
  let edits: [vscode.Range, string][] = [];

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: "Sending edit request to Clippy",
      cancellable: true,
    },
    async (_progress, token) => {
      if (selections.length > 0) {
        await Promise.all(
          selections.map(async (selection) => {
            const replacement = await createEdit({
              input: activeEditor.document.getText(selection),
              instruction,
            });
            if (replacement) edits.push([selection, replacement]);
          })
        );
      } else {
        const replacement = await createEdit({
          input: activeEditor.document.getText(),
          instruction,
        });
        if (replacement) edits.push([new vscode.Range(0, 0, 999999, 9999999), replacement]);
      }

      if (token.isCancellationRequested) return;

      activeEditor.edit((editBuilder) => {
        edits.forEach(([selection, replacement]) => {
          editBuilder.replace(selection, replacement);
        });
      });
    }
  );

  if (edits.length === 0) {
    vscode.window.showErrorMessage(
      "Sorry, we couldn't find any suggested edits 😢. Please try again with a different instruction."
    );
  } else {
    await vscode.commands.executeCommand("workbench.files.action.compareWithSaved");
  }
}
