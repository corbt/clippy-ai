import * as vscode from "vscode";
import { OaiProxyRequest } from "../../app/api/types/api";
import { createEdit } from "./client";
import recordVoiceCommand from "./recordVoiceCommand";

async function getInstruction(): Promise<OaiProxyRequest["instruction"] | null> {
  const useVoice = vscode.workspace.getConfiguration("clippy-ai").get("useVoiceInput");

  const instruction = useVoice
    ? await recordVoiceCommand()
    : {
        type: "text",
        contents: await vscode.window.showInputBox({
          title: "Instructions for Clippy",
          value: "",
        }),
      };

  if (!instruction?.contents) return null;
  return instruction as OaiProxyRequest["instruction"];
}

export default async function codexEdit() {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) return;

  const instruction = await getInstruction();
  if (!instruction) return;

  await vscode.commands.executeCommand("workbench.action.files.saveWithoutFormatting");

  let selections = activeEditor.selections.filter((selection) => !selection.isEmpty);
  let edits: [vscode.Range, Awaited<ReturnType<typeof createEdit>>][] = [];

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
            const edit = await createEdit({
              input: activeEditor.document.getText(selection),
              instruction,
            });
            if (edit.replacement) edits.push([selection, edit]);
          })
        );
      } else {
        const edit = await createEdit({
          input: activeEditor.document.getText(),
          instruction,
        });
        if (edit.replacement) edits.push([new vscode.Range(0, 0, 999999, 9999999), edit]);
      }

      if (token.isCancellationRequested) return;

      activeEditor.edit((editBuilder) => {
        edits.forEach(([selection, edit]) => {
          editBuilder.replace(selection, edit.replacement!);
        });
      });
    }
  );

  if (edits.length === 0) {
    vscode.window.showErrorMessage(
      `Sorry, we couldn't find any suggested edits 😢. Your instruction was "${edits[0][1].parsedInstruction}" Please try again with a different instruction.`
    );
  } else {
    vscode.window.showInformationMessage(`Changes for prompt "${edits[0][1].parsedInstruction}".`);
    await vscode.commands.executeCommand("workbench.files.action.compareWithSaved");
  }
}
