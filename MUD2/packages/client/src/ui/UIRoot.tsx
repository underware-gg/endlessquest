import { useStore } from "../store"
import { Wrapper } from "./Wrapper"
import { LoadingScreen } from "./LoadingScreen"
import { GameUI } from "../quest/components/GameUI"
import { BridgeProvider } from '../quest/hooks/BridgeContext'

export const UIRoot = () => {
  const layers = useStore((state) => {
    return {
      networkLayer: state.networkLayer,
      phaserLayer: state.phaserLayer,
    }
  })

  if (!layers.networkLayer || !layers.phaserLayer) return <></>

  return (
    <div className='FillParent'>
      <Wrapper>
        <LoadingScreen />
      </Wrapper>
      <BridgeProvider>
        <GameUI />
      </BridgeProvider>
    </div>
  )
}
