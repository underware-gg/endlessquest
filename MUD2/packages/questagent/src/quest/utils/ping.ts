import { nanoid } from 'nanoid'

export const pingQuestAgent = () => {
  console.warn(`questagent PING!`, nanoid())
}
