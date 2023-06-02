import { useEffect, useMemo, useState } from 'react'
import { ChatCompletionRequestMessageRoleEnum } from 'openai'
import { ChatHistory } from '../openai/generateChat'
import { ChatRequest } from './ChatRequest'

export const ChatDialog = ({
  agentName = 'Agent',
  agentMetadata = '',
  playerName = 'Player',
  onChat = (e: boolean) => { },
}) => {
  const [history, setHistory] = useState<ChatHistory>([])
  const [prompt, setPrompt] = useState('')
  const [isRequesting, setIsRequesting] = useState(false)

  useEffect(() => {
    setHistory([])
    setIsRequesting(true)
  }, [])

  const _makeTopic = (key: string, role: ChatCompletionRequestMessageRoleEnum, content: string) => {
    const isAgent = (role == ChatCompletionRequestMessageRoleEnum.Assistant)
    const className = isAgent ? 'AgentTopic' : 'UserTopic'
    return (
      <div key={key} className={className}>
        <div className='Important'>{isAgent ? agentName : playerName}</div>
        <div>{content}</div>
      </div>
    )
  }

  const topics = useMemo(() => {
    let result = []
    for (let i = 4; i < history.length; ++i) {
      const h = history[i]
      const isAgent = (h.role == ChatCompletionRequestMessageRoleEnum.Assistant)
      const className = isAgent ? 'AgentTopic' : 'UserTopic'
      result.push(_makeTopic(`t_${i}`, h.role, h.content))
    }
    return result
  }, [history])

  const _submit = () => {
    setIsRequesting(true)
  }

  const _onDone = (newHistory: ChatHistory, message: string) => {
    setHistory(newHistory)
    setIsRequesting(false)
    setPrompt('')
  }

  const canSubmit = (!isRequesting && prompt.length > 0)

  return (
    <>
      <div className='ClearCover' onClick={() => onChat(false)} />

      <div className='FullScreen CenteredContainer'>
        <div className='ChatDialog'>

          <div className='ChatContent'>
            {topics}
            {isRequesting &&
              <div>
                {history.length > 0 && _makeTopic('prompt', ChatCompletionRequestMessageRoleEnum.User, prompt)}
                <ChatRequest prompt={prompt} previousHistory={history} onDone={_onDone} agentMetadata={agentMetadata} />
              </div>
            }
          </div>

          <div className='ChatInputRow'>
            <input disabled={isRequesting} className='ChatInput' value={prompt} onChange={(e) => setPrompt(e.target.value)}></input>
            <button disabled={!canSubmit} className='ChatSubmit' onClick={() => _submit()}>Submit</button>
          </div>

        </div>
      </div>
    </>
  )
}
