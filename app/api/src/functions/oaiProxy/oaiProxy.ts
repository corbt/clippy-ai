import type { APIGatewayEvent, Context } from 'aws-lambda'
import { Configuration, OpenAIApi } from 'openai'
import { logger } from 'src/lib/logger'
import { OaiProxyRequest, OaiProxyResponse } from 'types/api'
import { v1p1beta1 as speech } from '@google-cloud/speech'

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPEN_AI_API_KEY,
  })
)

const speechClient = new speech.SpeechClient()

export const getTranscription = async (data: string) => {
  const [response] = await speechClient.recognize({
    config: { languageCode: 'en-US', model: 'command_and_search' },
    audio: { content: data },
  })
  return response.results?.[0]?.alternatives?.[0]?.transcript
}

export const handler = async (event: APIGatewayEvent, _context: Context) => {
  logger.info(`Proxy call`)
  const params = JSON.parse(event.body) as OaiProxyRequest

  const instruction =
    params.instruction.type === 'voice'
      ? await getTranscription(params.instruction.contents)
      : params.instruction.contents

  logger.info(
    {
      custom: { instructionType: params.instruction.type, instruction },
    },
    'Instruction'
  )
  try {
    const resp = await openai.createEdit('code-davinci-edit-001', {
      instruction,
      input: params.input,
      temperature: 0,
    })

    const body: OaiProxyResponse = {
      data: resp.data,
      parsedInstruction: instruction,
    }
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  } catch (e) {
    console.error(e.response)
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: e.message,
      }),
    }
  }
}
