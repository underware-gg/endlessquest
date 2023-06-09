import { useEffect, useMemo, useState } from 'react'
import { ChatCompletionRequestMessageRoleEnum } from 'openai'
import { ChatHistory } from '../openai/generateChat'
import { ChatRequest } from './ChatRequest'
import { useHyperspaceContext } from '../hyperspace/hooks/HyperspaceContext'
import { useSettingsContext, SettingsActions } from '../hooks/SettingsContext'
import { usePlayer } from '../hooks/usePlayer'
import { useAgent } from '../hooks/useAgent'

export const ChatDialog = ({
  playerName = 'Player',
}) => {
  const [timestamp, setTimestamp] = useState(0)
  const [history, setHistory] = useState<ChatHistory>([])
  const [prompt, setPrompt] = useState('')
  const [isRequesting, setIsRequesting] = useState(false)
  const { realmCoord, isChatting, dispatch } = useSettingsContext()
  const { QuestMessages } = useHyperspaceContext()

  useEffect(() => {
    window.QuestNamespace.controlsEnabled = !isChatting
    if (isChatting) {
      setHistory([])
      setIsRequesting(true)
      setTimestamp(Date.now())
    }
  }, [isChatting])

  const {
    agentEntity,
  } = usePlayer()
  const {
    coord,
    metadata,
  } = useAgent(agentEntity)

  const agentName = useMemo(() => (metadata?.name ?? 'Agent'), [metadata])
  const agentMetadata = useMemo(() => (metadata ? JSON.stringify(metadata) : ''), [metadata])

  const _makeTopic = (key: string, role: ChatCompletionRequestMessageRoleEnum, content: string) => {
    const isAgent = (role == ChatCompletionRequestMessageRoleEnum.Assistant)
    const className = isAgent ? 'AgentTopic' : 'UserTopic'
    return (
      <div key={key} className={className}>
        <div className='Importanter'>{isAgent ? agentName : playerName}</div>
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

  const _onClose = () => {
    dispatch({
      type: SettingsActions.SET_IS_CHATTING,
      payload: false,
    })
  }

  const _submit = () => {
    setIsRequesting(true)
  }

  const _onDone = (newHistory: ChatHistory, message: string) => {
    setHistory(newHistory)
    setIsRequesting(false)
    setPrompt('')
    QuestMessages.updateMessages(timestamp, realmCoord, coord, playerName, newHistory)
  }

  const canSubmit = (!isRequesting && prompt.length > 0)

  if (!isChatting) {
    return null
  }

  return (
    <>
      <div className='FadedCover' onClick={() => _onClose()} />

      <div className='FillScreen CenteredContainer'>
        <div className='ChatDialog'>

          <div className='ChatContent'>
            {topics.length > 0 &&
              <p className='Smaller'>chat id: {timestamp}</p>
            }
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
