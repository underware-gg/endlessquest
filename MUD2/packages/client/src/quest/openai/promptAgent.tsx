import * as Chat from './generateChat'
import { prompts } from '../prompts/propmps'

export interface PromptAgentOptions {
  history: Chat.ChatHistory
  prompt: string | null
}

export interface PromptAgentResponse {
  message: string
  history: Chat.ChatHistory
  error: string | null
}

export default async function promptAgent(options: PromptAgentOptions): Promise<PromptAgentResponse> {

  let messages = [...options.history]

  // 1st interaction
  if (messages.length == 0) {
    messages = [
      { role: 'system', content: prompts.system },
      { role: 'user', content: 'Begin' },
      { role: 'assistant', content: '[Awaiting Configuration]' },
      { role: 'user', content: prompts.fafnir },
    ]
  } else {
    messages.push({
      role: 'user',
      content: options.prompt ?? 'Hello',
    })
  }

  // https://platform.openai.com/docs/api-reference/chat/create
  const response = await Chat.generateChat({
    model: Chat.GPTModel.GPT3,
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
    role: 'assistant',
    content: response.response,
  })
  // console.log('Chat new history:', messages)

  return {
    message: response.response,
    history: messages,
    error: null,
  }
}
