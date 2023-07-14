import { useComponentValue } from '@latticexyz/react'
import { SyncState } from '@latticexyz/network'
import { useMUD } from '../../store'
import { SettingsProvider, useSettingsContext } from '../hooks/SettingsContext'
import { HyperspaceProvider } from '../hyperspace/hooks/HyperspaceContext'
import { BridgeProvider } from '../hooks/BridgeContext'
import { MetadataProvider } from '../hooks/MetadataContext'
import { GameSelector } from './GameSelector'
import { GameUI } from './GameUI'
import { RoomLoader } from '../hyperspace/components/RoomLoader'

const _GameRoot = () => {
  const { realmCoord } = useSettingsContext()
  if (realmCoord == 0n) {
    return <GameSelector />
  }
  return <GameUI />
}

export const GameRoot = () => {

  const {
    networkLayer,
    networkLayer: {
      components: { LoadingState },
      singletonEntity,
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
        <BridgeProvider networkLayer={networkLayer}>
          <MetadataProvider networkLayer={networkLayer}>
            <_GameRoot />
            <RoomLoader />
          </MetadataProvider>
        </BridgeProvider>
      </HyperspaceProvider>
    </SettingsProvider>
  )
}
