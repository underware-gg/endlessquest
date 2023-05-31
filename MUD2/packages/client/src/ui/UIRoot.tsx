import { useStore } from "../store"
import { Wrapper } from "./Wrapper"
import { LoadingScreen } from "./LoadingScreen"
import { GameRoot } from "../quest/components/GameRoot"

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
      <GameRoot />
    </div>
  )
}
