import * as vscode from "vscode";
import { createEdit } from "./client";

export default async function codexEdit() {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) return;

  const instruction = await vscode.window.showInputBox({
    title: "Instructions for OpenAI Codex",
    value: "",
  });
  if (!instruction) return;

  await vscode.commands.executeCommand("workbench.action.files.saveWithoutFormatting");

  let selections = activeEditor.selections.filter((selection) => !selection.isEmpty);

  vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: "Sending edit request to Clippy",
      cancellable: true,
    },
    async (_progress, token) => {
      let edits: [vscode.Range, string][] = [];
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
        activeEditor.edit;
      }

      if (token.isCancellationRequested) return;

      activeEditor.edit((editBuilder) => {
        edits.forEach(([selection, replacement]) => {
          editBuilder.replace(selection, replacement);
        });
      });

      await vscode.commands.executeCommand("workbench.files.action.compareWithSaved");
    }
  );
}
