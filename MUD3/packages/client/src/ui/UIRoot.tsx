import { useStore } from "../store";
import { CounterValue } from "../quest/components/CounterValue";
import { LoadingScreen } from "./LoadingScreen";
import { Wrapper } from "./Wrapper";
import { GameLoading } from "../quest/components/GameLoading";
import { GameRoot } from "../quest/components/GameRoot";

export const UIRoot = () => {
  const layers = useStore((state) => {
    return {
      networkLayer: state.networkLayer,
      phaserLayer: state.phaserLayer,
    };
  });

  if (!layers.networkLayer || !layers.phaserLayer) return <></>;

  return (
    <Wrapper>
      <GameLoading />
      <GameRoot />
    </Wrapper>
  );
};
