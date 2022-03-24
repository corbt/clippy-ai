import type { CreateEditResponse } from 'openai'

export type EditSelectionRequest = {
  input: string
  instruction:
    | {
        type: 'text'
        contents: string
      }
    | {
        type: 'voice'
        contents: string
      }
}

export type EditSelectionResponse = {
  data: CreateEditResponse
  parsedInstruction: string
}
