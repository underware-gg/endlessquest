import { useGeneratedImage } from '../openai/hooks'
import { useEffect, useMemo } from 'react'
import { useComponentValue, useRow } from '@latticexyz/react'
import { Entity } from '@latticexyz/recs'
import { useMUD } from '../../store'
import { Terrain } from '../bridge/Crawl'


export const useProfileImage = (prompt: string | null) => {
  const { isWaiting, url, error } = useGeneratedImage(prompt)
  return {
    isWaiting,
    url,
  }
}


//---------------------
// Agents ProfileImage
//
export const useAgentProfileImage = (agentEntity: Entity | undefined) => {
  const {
    networkLayer: {
      components: { Agent, Metadata, ProfileImage },
      systemCalls: {
        setAgentProfileImage,
      },
    }
  } = useMUD()

  const agent = useComponentValue(Agent, agentEntity)
  const metadata = useComponentValue(Metadata, agentEntity)
  const url = useComponentValue(ProfileImage, agentEntity)

  const prompt = useMemo(() => {
    if(agent && metadata) {
      const meta = JSON.parse(metadata.metadata)
      return `A watercolor portrait of a maritime figure, digital neon art, luminescent deep sea creatures: ${meta.description}; nautical steampunk art, watercolor marine landscape, vintage nautical charts`
      // return `${meta.name}, ${meta.description}`
    }
    return null
  }, [agent, metadata])
  const { isWaiting, url: generatedUrl } = useProfileImage(prompt)

  useEffect(() => { console.log(`AGENT IMAGE:`, url) }, [url])
  useEffect(() => { console.log(`AGENT META IMAGE:`, isWaiting, generatedUrl) }, [generatedUrl])

  useEffect(() => {
    if (agentEntity && agent && generatedUrl && !url) {
      setAgentProfileImage(agentEntity, generatedUrl)
    }
  }, [agent, generatedUrl])

  return {
    isWaiting: (isWaiting && !metadata),
    url: url?.url,
  }
}

//---------------------
// Chambers ProfileImage
//
const _chamberPrompts = {
  //   "realm_suffix": "nautical steampunk art, watercolor marine landscape, vintage nautical charts",
  //   "chamber_prefix": "A faded naval blueprint of a mysterious undersea structure",
  //   "npc_prefix": "A watercolor portrait of a maritime figure",
    [Terrain.Fire]: "digital neon art, luminescent deep sea creatures",
    [Terrain.Water]: "art nouveau poster, mythological sea battles",
    [Terrain.Earth]: "medieval manuscript illumination, bustling seaport",
    [Terrain.Air]: "digital fantasy art, flight of the sea creatures"
}
export const useChamberProfileImage = (coord: bigint) => {
  const {
    networkLayer: {
      systemCalls: {
        setChamberProfileImage,
      },
      storeCache,
    }
  } = useMUD()

  const chamberRow = useRow(storeCache, { table: 'Chamber', key: { coord } });
  const metadataRow = useRow(storeCache, { table: 'ChamberMetadata', key: { coord } });
  const profileImageRow = useRow(storeCache, { table: 'ChamberProfileImage', key: { coord } });

  const chamber = useMemo(() => (chamberRow?.value ?? null), [chamberRow])
  const metadata = useMemo(() => (metadataRow?.value?.metadata ?? null), [metadataRow])
  const url = useMemo(() => (profileImageRow?.value?.url ?? null), [profileImageRow])

  const prompt = useMemo(() => {
    if (chamber && metadata) {
      const meta = JSON.parse(metadata)
      const pertype = _chamberPrompts[meta?.terrain ?? 0] ?? ''
      console.log(`++++++++++++++++ GEN IMAGE CHAMBER META:`, metadata, pertype)
      return `${pertype}; ${meta.description}`
      // return `${meta.name}, ${meta.description}`
    }
    return null
  }, [chamber, metadata])
  const { isWaiting, url: generatedUrl } = useProfileImage(prompt)

  useEffect(() => { console.log(`CHAMBER IMAGE:`, chamber?.tokenId, metadata) }, [chamber, url])
  useEffect(() => { console.log(`CHAMBER IMAGE GENERATED:`, chamber?.tokenId, isWaiting, generatedUrl) }, [chamber, generatedUrl])

  useEffect(() => {
    if (chamber && generatedUrl && !url) {
      setChamberProfileImage(coord, generatedUrl)
    }
  }, [chamber, generatedUrl])

  return {
    isWaiting: (isWaiting && !metadata),
    url: generatedUrl ?? url,
  }
}

