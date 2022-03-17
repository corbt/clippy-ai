import * as vscode from "vscode";
import { getOpenAi } from "./openAi";

export default async function codexEdit() {
  const openai = getOpenAi();
  if (!openai) return;

  const initialWindow = vscode.window.activeTextEditor;
  if (!initialWindow) return;

  const prompt = await vscode.window.showInputBox({
    title: "Instructions for AI",
    value: "add types to the function definitions",
  });
  if (!prompt) return;

  await vscode.commands.executeCommand("workbench.action.files.saveWithoutFormatting");

  vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: "Sending edit request to OpenAI Codex",
      cancellable: true,
    },
    async (progress, token) => {
      const resp = await openai.createEdit("code-davinci-edit-001", {
        input: initialWindow.document.getText(),
        instruction: prompt,
        temperature: 0,
        top_p: 1,
      });

      if (token.isCancellationRequested) return;

      const editedText = resp.data.choices[0].text;
      if (!editedText) return;

      const edit = new vscode.WorkspaceEdit();
      edit.replace(
        initialWindow.document.uri,
        new vscode.Range(0, 0, 999999999, 999999999),
        editedText
      );
      await vscode.workspace.applyEdit(edit);

      await vscode.commands.executeCommand("workbench.files.action.compareWithSaved");
    }
  );
}
