# Update: Clippy is down for now :(

Unfortunately, on March 23, 2023 [OpenAI shut down their `code-davinci-001` model](https://news.ycombinator.com/item?id=35242069). As this was the only model that supported the code edit endpoint used by Clippy, I sadly had to take down this extension as well. I'll leave the code up here for others to learn from; there may be future strong models [with insertion capabilities](https://huggingface.co/bigcode/santacoder) that could bring Clippy back.

Copilot and ChatGPT are both fantastic tools but I'll miss the low-latency file-wide editing that Clippy specialized in, as will its other 6000 former users!

<img width="922" alt="Screen Shot 2023-03-23 at 11 08 39 PM" src="https://user-images.githubusercontent.com/176426/227442128-69a5f04e-959c-4579-b273-c4b3c84e9ca0.png">


# Original README

Clippy AI is a simple wrapper around [OpenAI Codex](https://openai.com/blog/openai-codex/). It allows you to send Codex your current file as well as some instructions in plain-text English on an operation to perform. It then opens a diff view in your editor so you can easily see the suggested changes and accept or reject them.

For more details on the VS Code extension, see [./vs-code-extension](./vs-code-extension)
