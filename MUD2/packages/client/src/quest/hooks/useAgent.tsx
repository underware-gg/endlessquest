import { useMemo, useEffect } from 'react'
import { useComponentValue } from '@latticexyz/react'
import { Entity } from '@latticexyz/recs'
import { useMUD } from '../../store'
import { useCoord } from './useCoord'
import { GemNames } from '../bridge/Crawl'
import { useAgentMetadata } from './MetadataContext'
import { useAgentProfileImage } from './useProfileImage'

export const useAgent = (agentEntity: Entity | undefined) => {
  const {
    networkLayer: {
      components: { Agent },
    }
  } = useMUD()

  const agent = useComponentValue(Agent, agentEntity)
  const { compass, slug } = useCoord(agent?.coord ?? 0n)

  const { metadata, isFetching: metadataIsFetching, isError: metadataIsError } = useAgentMetadata(agentEntity)

  const { url } = useAgentProfileImage(agentEntity)

  // useEffect(() => { console.log(`____USE_AGENT:`, agentEntity, typeof agentEntity, agent, metadata) }, [agentEntity, agent, metadata])

  return {
    coord: agent?.coord ?? null,
    compass: compass,
    slug: slug,
    tokenId: agent?.tokenId ?? null,
    seed: agent?.seed ?? null,
    yonder: agent?.yonder ?? null,
    gemType: agent?.gemType ?? null,
    gemName: agent?.gemType != null ? GemNames[agent.gemType] : '?',
    coins: agent?.coins ?? null,
    worth: agent?.worth ?? null,
    metadata: metadata ?? null,
    metadataIsFetching,
    metadataIsError,
    url: url ?? null,
  }
}
