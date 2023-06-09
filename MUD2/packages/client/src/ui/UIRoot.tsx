import { useStore } from '../store'
import { GameLoading } from '../quest/components/GameLoading'
import { GameRoot } from '../quest/components/GameRoot'

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
      <GameLoading />
      <GameRoot />
    </div>
  )
}
