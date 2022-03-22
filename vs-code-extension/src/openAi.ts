import * as vscode from "vscode";
import { Configuration, OpenAIApi } from "openai";

export function getOpenAi(): OpenAIApi | null {
  // get the API key from the settings

  const apiKey = vscode.workspace.getConfiguration("clippy-ai").get<string>("openAiApiKey");

  if ((apiKey?.length ?? 0) === 0) {
    vscode.window.showErrorMessage("Please set the OpenAI API key in the extension settings");
    return null;
  }

  const configuration = new Configuration({
    apiKey,
  });
  return new OpenAIApi(configuration);
}
