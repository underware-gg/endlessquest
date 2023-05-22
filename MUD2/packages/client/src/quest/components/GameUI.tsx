// import { TestBridge } from "./TestBridge";
import { Main } from "./Main";
import { Loader } from "./Loader";

export const GameUI = () => {

  return (
    <div className='GameUI NoMouse'>
      {/* <TestBridge /> */}
      <Main />
      <Loader />
    </div>
  );
};
