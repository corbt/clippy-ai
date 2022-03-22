Clippy AI is a simple wrapper around [OpenAI Codex](https://openai.com/blog/openai-codex/). It allows you to send Codex your current file as well as some instructions in plain-text English on an operation to perform. It then opens a diff view in your editor so you can easily see the suggested changes and accept or reject them.

Clippy is free to use for the moment, because it rely's on OpenAI's new [edit endpoint](https://openai.com/blog/gpt-3-edit-insert/) which is currently free while in testing. Once OpenAI moves that endpoint into production it'll likely move to a pay-per-usage model like OpenAI's other offerings.

## How it Works

"Register a new command named codexInsert"

![clippy-example](https://user-images.githubusercontent.com/176426/159511449-6b546f89-fd3c-4fc8-8a34-75f1ad4128fb.gif)

## Installation

1. Install [this extension](https://marketplace.visualstudio.com/items?itemName=clippy-ai.clippy-ai) from the VS Code Marketplace
2. Create an account at https://beta.openai.com/ (you may need to add a credit card, but won't be charged for the usage of this app currently)
3. Find your OpenAI API key [here](https://beta.openai.com/account/api-keys) and copy it.
4. Open the VS Code settings and look for the setting named "Clippy-ai: Openai Api Key". Enter your API key from step (3) here!

## Usage

Open the command palette (eg. cmd+shift+P on the mac). Search for the new command "Clippy AI: edit file or selection". When you run the command, an input box will pop up. In plain english, type the command you want Clippy to take. Clippy will send your current file and the instruction to OpenAI's "edit" endpoint and attempt to make the change. (Note that unlike [Github Copilot](https://copilot.github.com/), Clippy currently only sends the current file, not other files in your workspace.)

If no likely edit is possible, Clippy will close. Otherwise, you'll see Clippy's suggested edits appear in a few seconds in a diff view.

### Sample Prompts

It may take some time to learn what Codex is good and bad at. Here are some examples that have worked for me:

- `Add type hints to all function definitions`
- `Fix all syntax errors`
- `Remove commented-out code`

## Extension Settings

This extension requires the following setting:

- `clippy-ai.openaiApiKey`: Your OpenAI API key. Once you have an active account you can find this at https://beta.openai.com/account/api-keys.
