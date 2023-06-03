import { useGeneratedImage } from '../openai/hooks'
import { useEffect, useMemo } from 'react'
import { useComponentValue, useRow } from '@latticexyz/react'
import { Entity } from '@latticexyz/recs'
import { prompts } from '../prompts/prompts'
import { useMUD } from '../../store'


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
      components: { Agent, Metadata },
      systemCalls: {
        setAgentArtUrl,
      },
    }
  } = useMUD()

  const agent = useComponentValue(Agent, agentEntity)
  const metadataData = useComponentValue(Metadata, agentEntity)
  const metadata = metadataData?.metadata ?? null
  const url = metadataData?.url ?? null

  useEffect(() => { console.log(`AGENT IMAGE:`, url) }, [url])

  const prompt = useMemo(() => {
    if (agent && metadata && !url) {
      const meta = JSON.parse(metadata)
      return `A watercolor portrait of a maritime figure, digital neon art, luminescent deep sea creatures: ${meta.description} nautical steampunk art, watercolor marine landscape, vintage nautical charts`
      // return `${meta.name}, ${meta.description}`
    }
    return null
  }, [agent, metadata, url])
  const { isWaiting, url: generatedUrl } = useProfileImage(prompt)

  useEffect(() => { console.log(`AGENT META IMAGE:`, isWaiting, generatedUrl) }, [generatedUrl])

  useEffect(() => {
    if (agentEntity && agent && generatedUrl && !url) {
      setAgentArtUrl(agentEntity, generatedUrl)
    }
  }, [agent, generatedUrl])

  return {
    isWaiting: (isWaiting && !metadata),
    url,
  }
}

//---------------------
// Chambers ProfileImage
//
export const useChamberProfileImage = (coord: bigint) => {
  const {
    networkLayer: {
      systemCalls: {
        setChamberArtUrl,
      },
      storeCache,
    }
  } = useMUD()

  const chamberRow = useRow(storeCache, { table: 'Chamber', key: { coord } })
  const metadataRow = useRow(storeCache, { table: 'ChamberMetadata', key: { coord } })

  const chamber = useMemo(() => (chamberRow?.value ?? null), [chamberRow])
  const metadata = useMemo(() => (metadataRow?.value?.metadata ?? null), [metadataRow])
  const url = useMemo(() => (metadataRow?.value?.url ?? null), [metadataRow])

  // @ts-ignore
  useEffect(() => { console.log(`CHAMBER IMAGE:`, chamber?.tokenId, coord, metadata?.name ?? null, url) }, [chamber, url])

  const prompt = useMemo(() => {
    if (chamber && metadata && !url) {
      const meta = JSON.parse(metadata)
      const pertype = prompts.chamberPrompts[meta?.terrain ?? 0] ?? ''
      return `${pertype} ${meta.description}`
      // return `${meta.name}, ${meta.description}`
    }
    return null
  }, [chamber, metadata, url])
  const { isWaiting, url: generatedUrl } = useProfileImage(prompt)

  useEffect(() => { console.log(`CHAMBER IMAGE GENERATED:`, chamber?.tokenId, isWaiting, generatedUrl) }, [chamber, generatedUrl])

  useEffect(() => {
    if (chamber && generatedUrl && !url) {
      setChamberArtUrl(coord, generatedUrl)
    }
  }, [chamber, generatedUrl])

  return {
    isWaiting: (isWaiting && !metadata),
    url: url,
  }
}

//---------------------
// Realms ProfileImage
//
// export const useRealmProfileImage = (coord: bigint) => {
//   const {
//     networkLayer: {
//       systemCalls: {
//         setChamberArtUrl,
//       },
//       storeCache,
//     }
//   } = useMUD()

//   const metadataRow = useRow(storeCache, { table: 'ChamberMetadata', key: { coord } })
//   const metadata = useMemo(() => (metadataRow?.value?.metadata ?? null), [metadataRow])
//   const url = useMemo(() => (metadataRow?.value?.url ?? null), [metadataRow])

//   // @ts-ignore
//   useEffect(() => { console.log(`REALM IMAGE:`, coord, metadata?.name ?? null, url) }, [url])

//   const prompt = useMemo(() => {
//     if (metadata && url == '') {
//       const meta = JSON.parse(metadata)
//       return `${meta.name}, ${meta.description}`
//     }
//     return null
//   }, [metadata, url])
//   const { isWaiting, url: generatedUrl } = useProfileImage(prompt)

//   useEffect(() => { console.log(`REALM IMAGE GENERATED:`, isWaiting, generatedUrl) }, [generatedUrl])

//   useEffect(() => {
//     if (generatedUrl && url == '') {
//       setChamberArtUrl(coord, generatedUrl)
//     }
//   }, [generatedUrl])

//   return {
//     isWaiting: (isWaiting && !metadata),
//     url: url,
//   }
// }

