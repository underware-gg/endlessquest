import { useComponentValue } from '@latticexyz/react'
import { SyncState } from '@latticexyz/network'
import { useMUD } from '../../store'
import { GameUI } from './GameUI'
import { BridgeProvider } from '../hooks/BridgeContext'
import { MetadataProvider } from '../hooks/MetadataContext'

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
    <BridgeProvider systemCalls={systemCalls}>
      <MetadataProvider systemCalls={systemCalls}>
        <GameUI />
      </MetadataProvider>
    </BridgeProvider>
  )
}
