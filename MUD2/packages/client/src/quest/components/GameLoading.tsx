import styled from 'styled-components'
import { SyncState } from '@latticexyz/network'
import { useComponentValue } from '@latticexyz/react'
import { LoadingBar } from '../../ui/LoadingScreen/LoadingBar'
import { useMUD } from '../../store'

export const GameLoading = () => {
  const {
    networkLayer: {
      components: { LoadingState },
      singletonEntity,
    },
  } = useMUD()

  const loadingState = useComponentValue(LoadingState, singletonEntity, {
    msg: 'Connecting...',
    percentage: 0,
    state: SyncState.CONNECTING,
  })

  if (loadingState.state === SyncState.LIVE) {
    return null
  }

  return (
    <div className='FadedCover'>
      <div className='GameLoadingBox'>
        <div className='GameLoadingBar'>
          {loadingState.msg}
        </div>
        <div className='GameLoadingBar'>
          <Loading percentage={loadingState.percentage} />
          {Math.floor(loadingState.percentage)}%
        </div>
      </div>
    </div>
  )
}

const Loading = styled(LoadingBar)`
  width: 100%
  min-width: 200px
`
