import { useComponentValue, useEntityQuery, useRow } from '@latticexyz/react'
import { Entity, Has, HasValue, getComponentValueStrict } from '@latticexyz/recs'
import { useMUD } from '../../store'
import { usePlayer } from '../hooks/usePlayer'
import { useAgent } from '../hooks/useAgent'
import { useEffect, useMemo } from 'react'
import { useRequestAgentMetadata } from '../hooks/MetadataContext'


export const AgentLocation = ({
  onChat = (e: boolean, name: string, description: string) => { },
}) => {
  // const {
  //   components: { Position, Location },
  //   network: { playerEntity },
  // } = useMUD()

  const {
    agentEntity,
    agentId,
  } = usePlayer()
  const {
    coord,
    slug,
    yonder,
    gemType,
    gemName,
    coins,
    worth,
    metadata,
    metadataIsFetching,
    url,
  } = useAgent(agentEntity)

  useRequestAgentMetadata(agentEntity)

  const canChat = (agentId != 0n && metadata?.name)

  useEffect(() => {
    if (!canChat) {
      onChat(false, '', '')
    }
  }, [canChat])

  return (
    <div>
      <div className='AgentLocation'>

        <h2>Encounter</h2>
        <p className='Important'>{metadataIsFetching ? 'dreaming...' : (metadata?.name ?? 'come closer...')}</p>
        <p>{metadataIsFetching ? 'don\'t move!' : (metadata?.description ?? '?')}</p>

        <div className='Infos'>
          {/* <div>coord: {coord?.toString() ?? '?'}</div> */}
          <div>Entity: {agentId.toString()}</div>
          {/* <div>coord:{coord?.toString() ?? '?'}</div> */}
          {/* <div>chamber: {slug ?? '?'}</div> */}
          <div>Yonder: {yonder ?? '?'}</div>
          <div>Gem: {gemName ?? '?'}</div>
          <div>Coins: {coins ?? '?'}</div>
          {/* <div>Url: {url?.slice(0, 20) ?? '?'}</div> */}
          {/* <div>Worth: {worth ?? '?'}</div> */}
          <button className='ChatButton' disabled={!canChat} onClick={() => onChat(true, metadata?.name, metadata ? JSON.stringify(metadata) : '')}>CHAT</button>
        </div>

      </div>

      {url &&
        <div className='AgentLocation'>
          <img className='FillParent' src={url ?? ''} />
        </div>
      }

    </div>
  )
}
