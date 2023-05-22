import * as Crawl from '../bridge/Crawl'
import * as Chat from './generateChat'
import { prompts } from '../prompts/prompts'
import { ChatCompletionRequestMessageRoleEnum } from 'openai'


export enum MetadataType {
  World = 'World',
  Chamber = 'Chamber',
  NPC = 'NPC',
  PC = 'PC',
  // briefing = 'briefing',
}

export interface PromptMetadataOptions {
  type: MetadataType
  terrain: number | null
  gemType: number | null
  coins: number | null
  yonder: number | null
}

export interface PromptMetadataResponse {
  response: string | null
  metadata: object
  error: string | null
}

export default async function promptMetadata(options: PromptMetadataOptions): Promise<PromptMetadataResponse> {

  let prompt = `Please generate the metadata for a ${options.type}`
  if (options.terrain != null) prompt += `, terrain_type=${Crawl.TerrainNames[options.terrain]}`
  if (options.yonder != null) prompt += `, yonder=${options.yonder}`
  if (options.gemType != null) prompt += `, gem_type=${Crawl.GemNames[options.gemType]}`
  if (options.coins != null) prompt += `, coins=${options.coins}`

  console.log('Metadata Chat prompt:', prompt)

  const messages = [
    { role: ChatCompletionRequestMessageRoleEnum.System, content: prompts.metadataSystemPrompt },
    { role: ChatCompletionRequestMessageRoleEnum.User, content: 'Are you ready?' },
    { role: ChatCompletionRequestMessageRoleEnum.Assistant, content: '[Ready]' },
    { role: ChatCompletionRequestMessageRoleEnum.User, content: prompt },
    // { role: ChatCompletionRequestMessageRoleEnum.Assistant, content: "{ 'chamber': { 'chamber_name': '', 'chamber_description': '', 'terrain_type': 'Earth', 'gem_type': 'Silver', 'npc': { 'name': '', 'description': '', 'behaviour_mode': 'Quest NPC: A friendly NPC who needs help', 'quirk': '' }, 'coins': 100, 'yonder': 1 } }" },
    // { role: ChatCompletionRequestMessageRoleEnum.User, content: "why didnt you generate any data?" },
  ]

  // https://platform.openai.com/docs/api-reference/chat/create
  const response = await Chat.generateChat({
    model: Chat.GPTModel.GPT3,
    messages,
  })
  console.log('Metadata Chat response:', response)

  if (response.error || !response.response) {
    return {
      response: null,
      metadata: {},
      error: response.error ?? 'No response!',
    }
  }

  return {
    response: response.response,
    // metadata: JSON.parse(response.response),
    metadata: {},
    error: null,
  }
}