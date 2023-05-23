import { useEffect, useState } from "react";
import { Main } from "./Main";
import { ChamberLocation } from "./ChamberLocation";
import { PlayerLocation } from "./PlayerLocation";
import { AgentLocation } from "./AgentLocation";
import { ChatDialog } from "./ChatDialog";
import { Loader } from "./Loader";
// import { TestBridge } from "./TestBridge";

declare global {
  interface Window { QuestNamespace: any; }
}

export const GameUI = () => {
  const [agentName, setAgentName] = useState<string | null>(null)
  const [agentMetadata, setAgentMetadata] = useState<string | null>(null)
  const [isChatting, setIsChatting] = useState(false)

  const _onChat = (e: boolean, name: string | null, metadata: string | null) => {
    setAgentName(name)
    setAgentMetadata(metadata)
    setIsChatting(e)
  }

  useEffect(() => {
    window.QuestNamespace.controlsEnabled = !isChatting
  }, [isChatting])

  return (
    <div className='GameUI NoMouse'>
      {/* <TestBridge /> */}
      {/* <Main /> */}
      <ChamberLocation />
      <AgentLocation onChat={_onChat} />
      <PlayerLocation />
      <Loader />
      {isChatting &&
        <ChatDialog onChat={setIsChatting} agentName={agentName ?? 'Agent'} agentMetadata={agentMetadata ?? ''} />
      }
    </div>
  );
};
