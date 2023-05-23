import { usePrompMetadata } from '../openai/hooks'
import { MetadataType, PromptMetadataOptions } from '../openai/promptMetadata'
import { useEffect, useMemo } from 'react'
import { useComponentValue, useRow } from '@latticexyz/react'
import { Entity } from '@latticexyz/recs'
import { useMUD } from '../../store'


export const useMetadata = (options: PromptMetadataOptions) => {
  const { isWaiting, metadata, response, message, error } = usePrompMetadata(options)
  return {
    isWaiting,
    metadata: response ? metadata : null,
  }
}


//---------------------
// Agents metadata
//
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

  const options = useMemo(() => ({
    type: (agent && !metadata) ? MetadataType.NPC : MetadataType.None,
    terrain: agent?.terrain ?? null,
    gemType: agent?.gemType ?? null,
    coins: agent?.coins ?? null,
    yonder: agent?.yonder ?? null,
  }), [agent, metadata])
  const { isWaiting, metadata: generatedMetadata } = useMetadata(options)
  console.log(`AGENT META GENERATED:`, generatedMetadata)

  useEffect(() => { console.log(`AGENT META:`, metadata) }, [metadata])
  // useEffect(() => { console.log(`AGENT META GENERATED:`, isWaiting, generatedMetadata) }, [generatedMetadata])

  useEffect(() => {
    if (agentEntity && agent && generatedMetadata && !metadata) {
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
      setAgentMetadata(agentEntity, JSON.stringify(meta))
    }
  }, [agent, generatedMetadata])

  return {
    isWaiting: (isWaiting && !metadata),
    metadata: metadata?.metadata ? JSON.parse(metadata.metadata) : 'no metadata yet!',
  }
}

//---------------------
// Chambers metadata
//
export const useChamberMetadata = (coord: bigint) => {
  const {
    networkLayer: {
      components: { Chamber, ChamberMetadata },
      systemCalls: {
        setChamberMetadata,
      },
      storeCache,
    }
  } = useMUD()

  const chamberRow = useRow(storeCache, { table: 'Chamber', key: { coord } });
  const metadataRow = useRow(storeCache, { table: 'ChamberMetadata', key: { coord } });

  const chamber = useMemo(() => (chamberRow?.value ?? null), [chamberRow])  
  const metadata = useMemo(() => (metadataRow?.value?.metadata ?? null), [metadataRow])  

  const options = useMemo(() => ({
    type: (chamber && !metadata) ? MetadataType.Chamber : MetadataType.None,
    terrain: chamber?.terrain ?? null,
    gemType: chamber?.gemType ?? null,
    coins: chamber?.coins ?? null,
    yonder: chamber?.yonder ?? null,
  }), [chamber, metadata])
  const { isWaiting, metadata: generatedMetadata } = useMetadata(options)
  
  useEffect(() => { console.log(`CHAMBER META:`, chamber?.tokenId, metadata) }, [chamber, metadata])
  // useEffect(() => { console.log(`CHAMBER META GENERATED:`, chamber?.tokenId, isWaiting, generatedMetadata) }, [chamber, generatedMetadata])

  useEffect(() => {
    if (chamber && generatedMetadata && !metadata) {
      // @ts-ignore: accept any property
      const cham = generatedMetadata.chamber ?? null
      if (!cham) {
        console.warn(`No Chamber in metadata!`, generatedMetadata)
        return
      }
      const meta = {
        name: cham.chamber_name ?? cham.name ?? '[name]',
        description: cham.chamber_description ?? cham.description ?? '[description]',
      }
      console.log(`meta store...:`, coord, meta)
      setChamberMetadata(coord, JSON.stringify(meta))
    }
  }, [chamber, generatedMetadata])

  return {
    isWaiting: (isWaiting && !metadata),
    metadata: metadata ? JSON.parse(metadata) : 'no metadata yet!',
  }
}

