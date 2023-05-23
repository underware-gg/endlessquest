import {
  Configuration,
  OpenAIApi,
} from 'openai'
import Cookies from 'universal-cookie'

const cookies = new Cookies()

//-----------------------
// OPenAI Client
//

let _openai: OpenAIApi

function _create(apiKey: string, organization: string | undefined) {
  const configuration = new Configuration({
    apiKey,
    organization,
  })
  _openai = new OpenAIApi(configuration)
}

// let _apiKey = ''
let _apiKey = cookies.get('OPENAI_API_KEY')
let _orgID = cookies.get('OPENAI_ORG_ID')
if (!_apiKey?.length) {
  cookies.set('OPENAI_API_KEY', '', { path: '/' })
  _apiKey = import.meta.env.OPENAI_API_KEY
}
if (!_orgID?.length) {
  cookies.set('OPENAI_ORG_ID', '', { path: '/' })
  _orgID = import.meta.env.OPENAI_ORG_ID
}

if (_apiKey?.length > 0 && _orgID?.length > 0) {
  _create(_apiKey, _orgID)
}

//-----------------------
// Types
//

export enum ImageSize {
  Small = '256x256',
  Medium = '512x512',
  Large = '1024x1024',
}

export interface ImageOptions {
  prompt: string
  size: ImageSize,
  apiKey?: string
}

export interface ImageResponse {
  url?: string
  error?: string
  status?: string
}

//-----------------------
// OpenAI call
//
export async function generateImage(options: ImageOptions): Promise<ImageResponse> {

  // use user key
  if (options.apiKey && !_openai) {
    _create(options.apiKey, undefined)
  }

  // cerate client
  if (!_openai) {
    return {
      error: 'Please provide an OpenAI API key from https://platform.openai.com/account/api-keys in the OPENAI_API_KEY cookie',
    }
  }

  console.log(`OpenAI Image messages:`, options.prompt)

  if (options.prompt.length == 0) {
    return {
      error: 'OpenAI Image: Prompt is empty',
    }
  }

  try {
    // https://platform.openai.com/docs/api-reference/chat/create
    const generated = await _openai.createImage({
      prompt: options.prompt,
      n: 1,
      size: options.size,
    })
    console.log(`OpenAI Image response:`, generated)

    const url = generated.data.data[0].url

    if (!url) {
      return {
        error: 'No url in response',
      }
    }

    return {
      url,
    }
  } catch (error: any) {
    console.warn(`OpenAI Image exception:`, error)
    return {
      error: error.message ?? error.error.message ?? error.response.data ?? 'An error occurred during your request',
      status: error.status ?? error.response.status ?? null,
    }
  }
}
