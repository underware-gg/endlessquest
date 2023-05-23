import { usePrompMetadata } from '../openai/hooks'
import { MetadataType, PromptMetadataOptions } from '../openai/promptMetadata'
import { useEffect, useMemo } from 'react'
import { useComponentValue } from '@latticexyz/react'
import { Entity } from '@latticexyz/recs'
import { useMUD } from '../../store'

export const useAgentMetadata = (agentEntity: Entity | undefined) => {
  const {
    networkLayer: {
      components: { Agent, Metadata },
      systemCalls: {
        setAgentMetadata,
      },
    }
  } = useMUD()

  const agent = useComponentValue(Agent, agentEntity)
  const metadata = useComponentValue(Metadata, agentEntity)
  console.log(`AGENT META:`, metadata)
  
  const options = useMemo(() => ({
    type: (agent && !metadata) ? MetadataType.NPC : MetadataType.None,
    terrain: agent?.terrain ?? null,
    gemType: agent?.gemType ?? null,
    coins: agent?.coins ?? null,
    yonder: agent?.yonder ?? null,
  }), [agent, metadata])
  const { isWaiting, metadata: generatedMetadata } = useMetadata(options)
  // console.log(`AGENT META GENERATED:`, generatedMetadata)

  useEffect(() => {
    if (agentEntity && generatedMetadata && !metadata) {
      // @ts-ignore: accept any property
      const npc = generatedMetadata.npc ?? generatedMetadata.chamber.npc ?? null
      if (!npc) {
        console.warn(`No NPC in metadata!`, generatedMetadata)
        return
      }
      const meta = {
        name: npc.name ?? '[name]',
        description: npc.description ?? '[description]',
        behaviour_mode: npc.behaviour_mode ?? '[behaviour]',
        quirk: npc.quirk ?? '[quirk]',
      }
      console.log(`meta store...:`, agentEntity, meta)
      setAgentMetadata(agentEntity ?? 0n, JSON.stringify(meta))
    }
  }, [agentEntity, generatedMetadata])

  return {
    isWaiting,
    metadata: metadata?.metadata ? JSON.parse(metadata.metadata) : 'no metadata yet!',
  }
}

export const useMetadata = (options: PromptMetadataOptions) => {
  const { isWaiting, metadata, response, message, error } = usePrompMetadata(options)
  return {
    isWaiting,
    metadata: response ? metadata : null,
  }
}
