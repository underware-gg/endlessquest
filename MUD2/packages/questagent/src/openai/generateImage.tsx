import {
  Configuration,
  OpenAIApi,
} from 'openai'
import { Keys, getKey } from '../openai'

//-----------------------
// OPenAI Client
//

let _openai: OpenAIApi

function _create(apiKey: string | undefined, organization: string | undefined) {
  const configuration = new Configuration({
    apiKey: apiKey ?? getKey(Keys.OPENAI_API_KEY),
    organization: organization ?? getKey(Keys.OPENAI_ORG_ID),
  })
  _openai = new OpenAIApi(configuration)
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
  orgId?: string
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
  if (!_openai) {
    _create(options.apiKey, options.orgId)
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
