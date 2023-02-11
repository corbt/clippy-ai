import * as vscode from "vscode";
import getContext from "./context";

const BUILD_IN_INSTRUCTIONS = [
  "Add function description",
  "Improve Code readability",
  "Improve Code performance",
  "Reduce nesting",
  "Split functions into smaller functions",
];

const lastInstructionStateKey = "lastInstruction";


export async function getInstructionText() {
  const context = getContext();
  const lastInstructions = context.globalState.get(lastInstructionStateKey, []) as Array<string>;
  const quickPick = vscode.window.createQuickPick();
  quickPick.items = [
    { label: "Recent", kind: vscode.QuickPickItemKind.Separator },
    ...lastInstructions.filter(Boolean).map(label => ({ label })),

    { label: "Builtin", kind: vscode.QuickPickItemKind.Separator },
    ...BUILD_IN_INSTRUCTIONS.map(label => ({ label })),
  ];

  quickPick.title = "Instructions for Clippy";
  quickPick.placeholder = "What do you want to do?";
  quickPick.canSelectMany = false;
  const inputResult = new Promise<string | undefined>((resolve, reject) => {
    quickPick.onDidAccept(() => resolve(quickPick.value));
    quickPick.onDidChangeSelection(selection => resolve(selection[0].label));
    quickPick.onDidHide(() => resolve(undefined));
  });

  quickPick.show();
  const result = await inputResult.finally(() => quickPick.dispose());
  const uniqueHistory = [...new Set([result, ...lastInstructions])].slice(0, 5);
  context.globalState.update(lastInstructionStateKey, uniqueHistory);
  return result;
}
