// import { TestBridge } from "./TestBridge";
import { Main } from "./Main";
import { PlayerLocation } from "./PlayerLocation";
import { Loader } from "./Loader";

export const GameUI = () => {

  return (
    <div className='GameUI NoMouse'>
      {/* <TestBridge /> */}
      <Main />
      <PlayerLocation />
      <Loader />
    </div>
  );
};
