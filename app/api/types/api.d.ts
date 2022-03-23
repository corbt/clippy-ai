import type { CreateEditResponse } from 'openai'

export type OaiProxyRequest = {
  input: string
  instruction: string
}

export type OaiProxyResponse = { data: CreateEditResponse }
