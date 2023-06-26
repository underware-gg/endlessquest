import { ChatHistory } from 'questagent'
import { coordToSlug } from '../../../bridge/Crawl'
import RoomCollection from '../interfaces/RoomCollection'

class Room { }

class QuestMessages extends RoomCollection {
  constructor(room: Room) {
    super(room, 'questMessages')
  }

  updateMessages(timestamp: number, realm: bigint, coord_or_slug: bigint | string, player: string, messages: ChatHistory) {
    const slug = typeof coord_or_slug == 'string' ? coord_or_slug : coordToSlug(coord_or_slug, false)
    const _messages = messages.length > 4 ? messages.slice(4) : null
    this.upsert(timestamp.toString(), {
      realm: realm.toString(),
      chamber: slug,
      player,
      messages: _messages ? JSON.stringify(_messages) : null,
    })
  }

  // updateMessages(timestamp: number, messages: ChatHistory) {
  //   console.log(`Hyperspace.updateMessages()`, timestamp, messages)
  //   this.upsert(timestamp.toString(), {
  //     messages: JSON.stringify(messages),
  //   })
  // }

}

export default QuestMessages
