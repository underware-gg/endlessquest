import { useImage } from '../openai/hooks'
import { useEffect, useMemo } from 'react'
import { useComponentValue, useRow } from '@latticexyz/react'
import { Entity } from '@latticexyz/recs'
import { useMUD } from '../../store'


export const useProfileImage = (prompt: string | null) => {
  const { isWaiting, url, error } = useImage(prompt)
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
      return `${meta.name}, ${meta.description}`
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
      return `${meta.name}, ${meta.description}`
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

