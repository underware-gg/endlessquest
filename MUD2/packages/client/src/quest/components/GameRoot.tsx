import { useComponentValue } from '@latticexyz/react'
import { SyncState } from '@latticexyz/network'
import { useMUD } from '../../store'
import { SettingsProvider, useSettingsContext } from '../hooks/SettingsContext'
import { BridgeProvider } from '../hooks/BridgeContext'
import { MetadataProvider } from '../hooks/MetadataContext'
import { GameSelector } from './GameSelector'
import { GameUI } from './GameUI'

const _GameRoot = () => {
  const { realmCoord } = useSettingsContext()
  if (realmCoord == 0n) {
    return <GameSelector />
  }
  return <GameUI />
}

export const GameRoot = () => {

  const {
    networkLayer: {
      components: { LoadingState },
      singletonEntity, systemCalls,
    }
  } = useMUD()

  const loadingState = useComponentValue(LoadingState, singletonEntity, {
    state: SyncState.CONNECTING,
    msg: 'Connecting',
    percentage: 0,
  })


  if (loadingState.state !== SyncState.LIVE) return <></>

  return (
    <SettingsProvider>
      <BridgeProvider systemCalls={systemCalls}>
        <MetadataProvider systemCalls={systemCalls}>
          <_GameRoot />
        </MetadataProvider>
      </BridgeProvider>
    </SettingsProvider>
  )
}
