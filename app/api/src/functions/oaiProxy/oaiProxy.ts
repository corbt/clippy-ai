import type { APIGatewayEvent, Context } from 'aws-lambda'
import { Configuration, OpenAIApi } from 'openai'
import { logger } from 'src/lib/logger'
import { pick } from 'lodash'
import { OaiProxyRequest } from 'types/api'

const apiKey = process.env.OPEN_AI_API_KEY

const openai = new OpenAIApi(
  new Configuration({
    apiKey,
  })
)

export const handler = async (event: APIGatewayEvent, _context: Context) => {
  logger.info(`Proxy call`)
  const params = JSON.parse(event.body) as OaiProxyRequest
  logger.info({ custom: pick(params, ['instructions']) })

  try {
    const resp = await openai.createEdit('code-davinci-edit-001', {
      ...pick(params, ['input', 'instruction']),
      temperature: 0,
    })
    console.log(resp)

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pick(resp, ['data'])),
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
