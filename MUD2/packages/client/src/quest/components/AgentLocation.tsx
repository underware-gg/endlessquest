import { useComponentValue, useEntityQuery, useRow } from '@latticexyz/react'
import { Entity, Has, HasValue, getComponentValueStrict } from '@latticexyz/recs'
import { useMUD } from '../../store'
import { usePlayer } from '../hooks/usePlayer'
import { useAgent } from '../hooks/useAgent'
import { useEffect, useMemo } from 'react'
import { useRequestAgentMetadata } from '../hooks/MetadataContext'
import { useSettingsContext, SettingsActions } from '../hooks/SettingsContext'


export const AgentLocation = ({
}) => {
  const { anim, isChatting, dispatch } = useSettingsContext()

  const {
    agentEntity,
    agentId,
    nextCoord,
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

  const _onChat = () => {
    dispatch({
      type: SettingsActions.SET_IS_CHATTING,
      payload: !isChatting,
    })
  }

  const canChat = (agentId != 0n && metadata?.name)

  return (
    <>
      <div className='ChamberImage'>
        <img className='FillParent' src={url ? url : anim} />
      </div>

      <div className='ChamberLocation'>
        <h3>Encounter</h3>
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
          <button className='ChatButton' disabled={!canChat} onClick={() => _onChat()}>CHAT</button>
        </div>
      </div>
    </>
  )
}
