import { ChatHistory } from 'questagent'
import { coordToSlug } from '../../../bridge/Crawl'
import RoomCollection from '../interfaces/RoomCollection'

class Room { }

class QuestMessages extends RoomCollection {
  constructor(room: Room) {
    super(room, 'questMessages')
  }

  updateMessages(timestamp: number, realm: bigint, coord: bigint, player: string, messages: ChatHistory) {
    const slug = coordToSlug(coord, false)
    console.log(`Hyperspace.updateMessages()`, timestamp, slug, messages.slice(4))
    this.upsert(timestamp.toString(), {
      realm: realm.toString(),
      chamber: slug,
      player,
      messages: JSON.stringify(messages.slice(4)),
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
