import {
  Configuration,
  OpenAIApi,
  ChatCompletionRequestMessage,
  ChatCompletionRequestMessageRoleEnum,
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
  orgId?: string
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
  if (!_openai) {
    _create(options.apiKey, options.orgId)
  }

  // cerate client
  if (!_openai) {
    return {
      error: 'Please provide an OpenAI API key from https://platform.openai.com/account/api-keys in the OPENAI_API_KEY cookie',
    }
  }

  console.log(`OpenAI Chat messages:`, options.model, options.messages)

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
      status: error.status ?? error.response?.status ?? null,
    }
  }
}
