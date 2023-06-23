import * as Chat from './generateChat'
import { prompts } from '../prompts/prompts'
import { ChatCompletionRequestMessageRoleEnum } from 'openai'

export interface PromptAgentOptions {
  gptModel: Chat.GPTModel,
  history: Chat.ChatHistory
  agentMetadata: string
  prompt: string | null
}

export interface PromptAgentResponse {
  message: string
  history: Chat.ChatHistory
  error: string | null
}

export async function promptChat(options: PromptAgentOptions): Promise<PromptAgentResponse> {

  let messages = [...options.history]

  // 1st interaction
  if (messages.length == 0) {
    messages = [
      { role: ChatCompletionRequestMessageRoleEnum.System, content: prompts.chatSystemPrompt },
      { role: ChatCompletionRequestMessageRoleEnum.User, content: 'Begin' },
      { role: ChatCompletionRequestMessageRoleEnum.Assistant, content: '[Awaiting Configuration]' },
      { role: ChatCompletionRequestMessageRoleEnum.User, content: options.agentMetadata },
    ]
  } else {
    if (!options.prompt) console.log('Chat MISSING PROMPT!')
    messages.push({
      role: ChatCompletionRequestMessageRoleEnum.User,
      content: options.prompt ?? 'Hello',
    })
  }

  // https://platform.openai.com/docs/api-reference/chat/create
  const response = await Chat.generateChat({
    model: options.gptModel,
    messages,
  })
  console.log('Chat response:', response)

  if (response.error || !response.response) {
    return {
      message: 'Unfortunate error ¯\_(ツ)_/¯',
      history: options.history,
      error: response.error ?? 'No response!',
    }
  }

  messages.push({
    role: ChatCompletionRequestMessageRoleEnum.Assistant,
    content: response.response,
  })
  // console.log('Chat new history:', messages)

  return {
    message: response.response,
    history: messages,
    error: null,
  }
}
