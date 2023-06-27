import { ChatCompletionRequestMessageRoleEnum } from 'openai'
import {
  GPTModel,
  ChatHistory,
  generateChat,
} from '../openai'
import { prompts } from '../prompts'

export interface PromptAgentOptions {
  gptModel: GPTModel,
  history: ChatHistory
  agentMetadata: string
  prompt: string | null
}

export interface PromptAgentResponse {
  message: string
  history: ChatHistory
  error: string | null
}

export async function promptChat(options: PromptAgentOptions): Promise<PromptAgentResponse> {

  let messages = [...options.history]

  console.log(`PROMPT_____`, options)
  
  // 1st interaction
  if (!options.prompt || options.agentMetadata == '{}') {
    messages = []
  } else if (messages.length == 0) {
    // First interaction
    messages = [
      { role: ChatCompletionRequestMessageRoleEnum.System, content: prompts.chatSystemPrompt },
      { role: ChatCompletionRequestMessageRoleEnum.User, content: 'Begin' },
      { role: ChatCompletionRequestMessageRoleEnum.Assistant, content: '[Awaiting Configuration]' },
      { role: ChatCompletionRequestMessageRoleEnum.User, content: options.agentMetadata },
    ]
  } else {
    // Continuing chat
    messages.push({
      role: ChatCompletionRequestMessageRoleEnum.User,
      content: options.prompt,
    })
  }

  // https://platform.openai.com/docs/api-reference/chat/create
  const response = await generateChat({
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
