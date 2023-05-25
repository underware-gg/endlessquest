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
    error,
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

  useEffect(() => { console.log(`AGENT IMAGE:`, url) }, [url])

  const prompt = useMemo(() => {
    if (agent && metadata && !url) {
      const meta = JSON.parse(metadata.metadata)
      return `A watercolor portrait of a maritime figure, digital neon art, luminescent deep sea creatures: ${meta.description}; nautical steampunk art, watercolor marine landscape, vintage nautical charts`
      // return `${meta.name}, ${meta.description}`
    }
    return null
  }, [agent, metadata, url])
  const { isWaiting, url: generatedUrl } = useProfileImage(prompt)

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

  // @ts-ignore
  useEffect(() => { console.log(`CHAMBER IMAGE:`, chamber?.tokenId, coord, metadata?.name ?? null, url) }, [chamber, url])

  const prompt = useMemo(() => {
    if (chamber && metadata && !url) {
      console.log(`____image_make_prompt...`, chamber?.tokenId, chamber, metadata, url)
      const meta = JSON.parse(metadata)
      const pertype = _chamberPrompts[meta?.terrain ?? 0] ?? ''
      return `${pertype}; ${meta.description}`
      // return `${meta.name}, ${meta.description}`
    }
    console.log(`____image_clear_prompt...`, chamber?.tokenId, chamber, metadata, url)
    return null
  }, [chamber, metadata, url])
  console.log(`____image_current prompt:`, chamber?.tokenId, prompt)
  const { isWaiting, url: generatedUrl } = useProfileImage(prompt)

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

