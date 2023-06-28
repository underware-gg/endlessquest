import { ChatCompletionRequestMessageRoleEnum } from 'openai'
import { Terrain, TerrainNames, Gem, GemNames } from '@rsodre/crawler-data'
import {
  GPTModel,
  generateChat,
} from './generateChat'
import { prompts } from '../prompts'

// types must match Prompts commands
export enum MetadataType {
  None = 'None', // should not compute
  Realm = 'World',
  Chamber = 'Chamber',
  Agent = 'NPC',
  Player = 'PC',
  // briefing = 'briefing',
}

export interface PromptMetadataOptions {
  gptModel: GPTModel
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

export async function promptMetadata(options: PromptMetadataOptions): Promise<PromptMetadataResponse> {

  if(options.type == MetadataType.None) {
    return {
      response: null,
      metadata: {},
      error: 'No MetadataType!',
    }
  }

  let prompt = `Generate ${options.type}`
  if (options.terrain != null) prompt += `, terrain_type: ${TerrainNames[options.terrain as Terrain]}`
  if (options.gemType != null) prompt += `, gem_type: ${GemNames[options.gemType as Gem]}`
  if (options.coins != null) prompt += `, coins: ${options.coins}`
  if (options.yonder != null) prompt += `, yonder: ${options.yonder}`
  // prompt += `}`

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
  const response = await generateChat({
    model: options.gptModel,
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

  let metadata
  try {
    metadata = JSON.parse(response.response)
  } catch(e) {
    metadata = {
      error: `Metadata parse exception: [${e}]`
    }
  }
  console.log('Metadata Chat metadata:', metadata)

  return {
    response: response.response,
    metadata,
    error: null,
  }
}
