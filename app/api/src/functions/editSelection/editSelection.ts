import type { APIGatewayEvent, Context } from 'aws-lambda'
import { Configuration, OpenAIApi } from 'openai'
import { logger } from 'src/lib/logger'
import { EditSelectionRequest, EditSelectionResponse } from 'types/api'
import { v1p1beta1 as speech } from '@google-cloud/speech'
import mm from 'music-metadata'

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPEN_AI_API_KEY,
  })
)

const speechClient = new speech.SpeechClient()

export const getTranscription = async (data: string) => {
  const audioBytes = Buffer.from(data, 'base64')
  const metadata = await mm.parseBuffer(audioBytes)
  const audioChannelCount = metadata.format.numberOfChannels

  const [response] = await speechClient.recognize({
    config: {
      languageCode: 'en-US',
      model: 'command_and_search',
      audioChannelCount,
    },
    audio: { content: data },
  })
  return response.results?.[0]?.alternatives?.[0]?.transcript
}

export const handler = async (event: APIGatewayEvent, _context: Context) => {
  logger.info(`Proxy call`)
  const params = JSON.parse(event.body) as EditSelectionRequest

  const instruction =
    params.instruction.type === 'voice'
      ? await getTranscription(params.instruction.contents)
      : params.instruction.contents

  logger.info(
    {
      custom: {
        instructionType: params.instruction.type,
        instruction,
        version: params.version,
        user: params.user,
        client: params.client,
      },
    },
    'Instruction'
  )
  try {
    const resp = await openai.createEdit('code-davinci-edit-001', {
      instruction,
      input: params.input,
      temperature: 0,
      // @ts-expect-error I think the type defs are wrong here and OpenAI expects this field
      user: params.user,
    })

    const body: EditSelectionResponse = {
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
