import * as ClientRoom from './networking'
import Screen from './components/screen'
import QuestMetadata from './components/questMetadata'
import QuestMessages from './components/questMessages'
import Store from './store'

let _roomCounter = 0
let _openRooms = 0

class Room {

  constructor() {
    this.localStore = new Store()
    this.remoteStore = new Store()

    this.roomId = ++_roomCounter
    ++_openRooms
    // console.warn(`[${this.roomId}] new Room() open [${_openRooms}]`)
  }

  async init({
    // opens Room client if slug is defined
    slug = null,
    branch = null,
  }) {
    // @ts-ignore
    this.branch = branch
    // @ts-ignore
    this.slug = slug

    // room client: the actual room in use, synched with the server
    // can be null
    this.clientRoom = ClientRoom.create({
      slug: this.slug,
      store: this.remoteStore,
      roomId: this.roomId,
    })

    this.agentId = this.clientRoom?.agentId ?? null

    // instantiate components before this.clientRoom.init() to listen to snapshot loading events
    this.QuestRealm = new QuestMetadata(this, 'questRealm')
    this.QuestChamber = new QuestMetadata(this, 'questChamber')
    this.QuestAgent = new QuestMetadata(this, 'questAgent')
    this.QuestMessages = new QuestMessages(this)

    this.clientRoom.init({
      loadLocalSnapshot: true,
    })

    // wait for Room client to load
    const hasClientData = await this.clientRoom.waitForConnection()
    // console.log(`CLIENT CONNECTED!`, hasClientData)

  }

  shutdown = () => {
    --_openRooms
    this.clientRoom?.shutdown()
    this.clientRoom = null
  }

}

export default Room
