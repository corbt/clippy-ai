Clippy AI is a simple wrapper around [OpenAI Codex](https://openai.com/blog/openai-codex/). It allows you to send Codex your current file as well as some instructions in plain-text English. It then opens a diff view in your editor so you can easily see the suggested changes and accept or reject them.

Clippy is free to use for the moment, because it rely's on OpenAI's new [edit endpoint](https://openai.com/blog/gpt-3-edit-insert/) which is currently free while in testing. Once OpenAI moves that endpoint into production it'll likely move to a pay-per-usage model like OpenAI's other offerings.

## How it Works

Just type what you want Codex to do, and get a diff back with Codex's proposed changes. A GIF is worth a thousand words:

![clippy-example-3](https://user-images.githubusercontent.com/176426/159715701-aedff3ae-e480-49b7-9284-b7a5a95c26a7.gif)

## Installation

1. Install [this extension](https://marketplace.visualstudio.com/items?itemName=clippy-ai.clippy-ai) from the VS Code Marketplace
2. Create an account at https://beta.openai.com/ (you may need to add a credit card, but won't be charged for the usage of this app currently)
3. Find your OpenAI API key [here](https://beta.openai.com/account/api-keys) and copy it.
4. Open the VS Code settings and look for the setting named "Clippy-ai: Openai Api Key". Enter your API key from step (3) here!

## Usage

Open the command palette (eg. cmd+shift+P on the mac). Search for the new command "Clippy AI: edit file or selection". When you run the command, an input box will pop up. In plain english, type the command you want Clippy to take. Clippy will send your current file and the instruction to OpenAI's "edit" endpoint and attempt to make the change. (Note that unlike [Github Copilot](https://copilot.github.com/), Clippy currently only sends the current file, not other files in your workspace.)

If no likely edit is possible, Clippy will close. Otherwise, you'll see Clippy's suggested edits appear in a few seconds in a diff view.

## Sample Prompts

It may take some time to learn what Clippy is good and bad at. Here are some examples that have worked for me:

### General

#### "Add types hints to all function definitions"

![Screen Shot 2022-03-22 at 4 27 50 PM](https://user-images.githubusercontent.com/176426/159518352-ce204e3b-debb-48ff-a2b2-a24eb56befdf.png)

#### "Fix all syntax errors"

![Screen Shot 2022-03-22 at 4 24 06 PM](https://user-images.githubusercontent.com/176426/159517547-f6bc7f18-583b-483b-af63-6317c2b08dc1.png)

#### "Remove commented-out code"

![Screen Shot 2022-03-22 at 4 21 58 PM](https://user-images.githubusercontent.com/176426/159516973-c7c073f4-443d-4f7e-af90-7dedafedf803.png)

#### "Remove dead code"

   <img width="1192" alt="Screen Shot 2022-03-22 at 4 17 07 PM" src="https://user-images.githubusercontent.com/176426/159515879-949bde46-8448-42ed-bca7-4eeb0fd47510.png">

### Project-Specific

#### "Add a command to package and install the extension locally"

   <img width="1207" alt="Screen Shot 2022-03-22 at 4 04 02 PM" src="https://user-images.githubusercontent.com/176426/159513938-e06201a2-ec07-4b40-916a-cbd7776a1c00.png">

#### "Remove all logging statements"

   <img width="1236" alt="Screen Shot 2022-03-19 at 9 58 01 PM" src="https://user-images.githubusercontent.com/176426/159514343-458e7a40-62b0-425f-a2d2-dedefd4e7668.png">
   
#### "Fix types for the edit variable"
   <img width="852" alt="Screen Shot 2022-03-22 at 4 12 13 PM" src="https://user-images.githubusercontent.com/176426/159514814-a9af7b0c-7499-4fdb-b026-030ff097d437.png">
   ^ This one is particularly cool because it highlights Clippy's understanding both of my codebase and the VS Code extension API. I modified my code to require `edits` to handle either a `Selection` or a `Range`, and then used Clippy to fix the types of `edits`. I expected it to change the type to `vscode.Selection | vscode.Range`, but Clippy actually correctly realized that `vscode.Selection` is a subclass of `vscode.Range`, so `vscode.Range` is sufficient on its own!
