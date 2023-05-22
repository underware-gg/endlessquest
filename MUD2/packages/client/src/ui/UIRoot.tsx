import { useStore } from "../store";
import { GameUI } from "../quest/components/GameUI";
import { LoadingScreen } from "./LoadingScreen";
import { Wrapper } from "./Wrapper";

export const UIRoot = () => {
  const layers = useStore((state) => {
    return {
      networkLayer: state.networkLayer,
      phaserLayer: state.phaserLayer,
    };
  });

  if (!layers.networkLayer || !layers.phaserLayer) return <></>;

  return (
    <div className='FillParent'>
      <Wrapper>
        <LoadingScreen />
      </Wrapper>
      <GameUI />
    </div>
  );
};
