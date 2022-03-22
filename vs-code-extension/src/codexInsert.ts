import * as vscode from "vscode";
import { getOpenAi } from "./openAi";

export default async function codexEdit() {
  const openai = getOpenAi();
  if (!openai) return;

  const createEdit = async (input: string, instruction: string) => {
    const resp = await openai.createEdit("code-davinci-edit-001", {
      input,
      instruction,
      temperature: 0,
      top_p: 1,
    });
    let suggestedEdit = resp?.data?.choices?.[0]?.text;

    if (input.trimEnd() === input) return suggestedEdit?.trimEnd();
    return suggestedEdit;
  };

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
      title: "Sending edit request to OpenAI Codex",
      cancellable: true,
    },
    async (_progress, token) => {
      let edits: [vscode.Range, string][] = [];
      if (selections.length > 0) {
        await Promise.all(
          selections.map(async (selection) => {
            const replacement = await createEdit(
              activeEditor.document.getText(selection),
              instruction
            );
            if (replacement) edits.push([selection, replacement]);
          })
        );
      } else {
        const replacement = await createEdit(activeEditor.document.getText(), instruction);
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
