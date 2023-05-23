import { useState } from "react";
import { Main } from "./Main";
import { ChamberLocation } from "./ChamberLocation";
import { PlayerLocation } from "./PlayerLocation";
import { AgentLocation } from "./AgentLocation";
import { ChatDialog } from "./ChatDialog";
import { Loader } from "./Loader";
// import { TestBridge } from "./TestBridge";

export const GameUI = () => {
  const [isChatting, setIsChatting] = useState(false)

  return (
    <div className='GameUI NoMouse'>
      {/* <TestBridge /> */}
      {/* <Main /> */}
      <ChamberLocation />
      <AgentLocation onChat={setIsChatting} />
      <PlayerLocation />
      <Loader />
      {isChatting &&
        <ChatDialog onChat={setIsChatting} />
      }
    </div>
  );
};
