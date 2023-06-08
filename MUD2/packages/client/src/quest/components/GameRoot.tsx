import { useComponentValue } from '@latticexyz/react'
import { SyncState } from '@latticexyz/network'
import { useMUD } from '../../store'
import { SettingsProvider, useSettingsContext } from '../hooks/SettingsContext'
import { HyperspaceProvider } from '../hyperspace/hooks/HyperspaceContext'
import { BridgeProvider } from '../hooks/BridgeContext'
import { MetadataProvider } from '../hooks/MetadataContext'
import { GameSelector } from './GameSelector'
import { GameUI } from './GameUI'
import { Room } from '../hyperspace/components/Room'

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
      <HyperspaceProvider>
        <BridgeProvider systemCalls={systemCalls}>
          <MetadataProvider systemCalls={systemCalls}>
            <_GameRoot />
            <Room />
          </MetadataProvider>
        </BridgeProvider>
      </HyperspaceProvider>
    </SettingsProvider>
  )
}
