import type { CreateEditResponse } from 'openai'

export type OaiProxyRequest = {
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

export type OaiProxyResponse = {
  data: CreateEditResponse
  parsedInstruction: string
}
