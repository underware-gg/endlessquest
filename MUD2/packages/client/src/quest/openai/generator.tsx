import { Configuration, OpenAIApi } from 'openai'
import Cookies from 'universal-cookie';
import { prompts } from '..//prompts/propmps';

const cookies = new Cookies();

let _openai: OpenAIApi

function _create(apiKey: string) {
  const configuration = new Configuration({ apiKey })
  _openai = new OpenAIApi(configuration)
}

let _apiKey = cookies.get('OPENAI_API_KEY')
if (!_apiKey?.length) {
  cookies.set('OPENAI_API_KEY', '', { path: '/' });
  _apiKey = import.meta.env.OPENAI_API_KEY
}

if (_apiKey?.length > 0) {
  _create(_apiKey)
}

export interface GenerateResult {
  result?: string,
  error?: string,
  status?: string,
}

export default async function generate({
  prompt = '',
  apiKey = null,
}): Promise<GenerateResult> {

  // use user key
  if (apiKey && !_openai) {
    _create(apiKey)
  }

  // cerate client
  if (!_openai) {
    return {
      error: 'Please provide an OpenAI API key from https://platform.openai.com/account/api-keys in the OPENAI_API_KEY cookie',
    }
  }

  if (prompt.trim().length === 0) {
    return {
      error: 'Please enter a valid prompt',
    }
  }

  try {
    // https://platform.openai.com/docs/api-reference/chat/create
    const chat = await _openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: `system`, content: prompts.system },
        { role: `user`, content: `Begin` },
        { role: `assistant`, content: `[Awaiting Configuration]` },
        { role: `user`, content: prompts.fafnir },
      ],
    })
    console.log(`OpenAI response:`, chat)
    const message = chat.data.choices[0].message
    if(!message) {
      return {
        error: 'No message in response',
      }
    }
    return {
      result: message?.content
    }
  } catch (error: any) {
    console.warn(`AI exception:`, error)
    if (error.response) {
      return {
        error: error.response.data,
        status: error.response.status,
      }
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`)
      return {
        error: 'An error occurred during your request',
      }
    }
  }
}
