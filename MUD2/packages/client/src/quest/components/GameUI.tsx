// import { TestBridge } from "./TestBridge";
import { Main } from "./Main";
import { ChamberLocation } from "./ChamberLocation";
import { PlayerLocation } from "./PlayerLocation";
import { AgentLocation } from "./AgentLocation";
import { Loader } from "./Loader";

export const GameUI = () => {

  return (
    <div className='GameUI NoMouse'>
      {/* <TestBridge /> */}
      {/* <Main /> */}
      <ChamberLocation />
      <PlayerLocation />
      <AgentLocation />
      <Loader />
    </div>
  );
};
