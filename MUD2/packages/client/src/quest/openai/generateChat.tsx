import {
  Configuration,
  OpenAIApi,
  ChatCompletionRequestMessage,
  ChatCompletionRequestMessageRoleEnum,
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

export enum GPTModel {
  GPT3 = 'gpt-3.5-turbo',
  GPT4 = 'gpt-4',
}

export type ChatPrompt = ChatCompletionRequestMessage

export type ChatHistory = Array<ChatCompletionRequestMessage>

export interface ChatOptions {
  model: GPTModel
  messages: ChatHistory
  apiKey?: string
}

export interface ChatResponse {
  response?: string
  error?: string
  status?: string
  history?: ChatHistory
}

//-----------------------
// OpenAI call
//
export async function generateChat(options: ChatOptions): Promise<ChatResponse> {

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

  console.log(`OpenAI Chat messages:`, options.messages)

  if (options.messages.length == 0) {
    return {
      error: 'OpenAI Chat: Messages is empty',
    }
  }

  if (options.messages[options.messages.length - 1].role != ChatCompletionRequestMessageRoleEnum.User) {
    return {
      error: 'OpenAI Chat: Last message must be from user',
    }
  }

  try {
    // https://platform.openai.com/docs/api-reference/chat/create
    const chat = await _openai.createChatCompletion({
      model: options.model,
      messages: options.messages,
    })
    console.log(`OpenAI Chat response:`, chat)

    // if (chat.error) {
    //   return {
    //     error: 'No message in response',
    //   }
    // }

    const message = chat.data.choices[0].message

    if (!message) {
      return {
        error: 'No message in response',
      }
    }

    return {
      response: message?.content
    }
  } catch (error: any) {
    console.warn(`OpenAI Chat exception:`, error)
    return {
      error: error.message ?? error.error.message ?? error.response.data ?? 'An error occurred during your request',
      status: error.status ?? error.response.status ?? null,
    }
  }
}
