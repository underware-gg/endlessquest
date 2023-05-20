import { useStore } from "../store";
import { LoadingScreen } from "./LoadingScreen";
import { TestBridge } from "./TestBridge";
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
    <Wrapper>
      <TestBridge />
      <LoadingScreen />
    </Wrapper>
  );
};
