import { mockHttpEvent } from '@redwoodjs/testing/api'
import { getTranscription, handler } from './editSelection'
import { readFile } from 'fs/promises'
import { EditSelectionResponse } from 'types/api'

describe('getTranscription', () => {
  it('should transcribe a base64-encoded audio file', async () => {
    const data = await readFile('./api/test-fixtures/command.flac').then(
      (data) => data.toString('base64')
    )
    const transcript = await getTranscription(data)
    expect(transcript).toBe('remove comments')
  })
})

describe('handler', () => {
  it('handles text instructions', async () => {
    const response = await handler(
      mockHttpEvent({
        body: JSON.stringify({
          input: '// comment\nconsole.log("hello world")',
          instruction: {
            type: 'text',
            contents: 'remove the comment',
          },
        }),
      }),
      null
    )
    const body = JSON.parse(response.body) as EditSelectionResponse
    expect(body.data.choices).toHaveLength(1)
    expect(body.data.choices[0].text).toBe('console.log("hello world")\n')
  })
})
