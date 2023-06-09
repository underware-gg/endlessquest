// objects created inside Room
// share the Room client and stores
// can access other objects

class RoomMate {
  #room;

  // @ts-ignore
  constructor(room) {
    this.#room = room
  }

  // the Room
  
  get localStore() {
    return this.#room.localStore
  }

  get remoteStore() {
    return this.#room.remoteStore
  }

  // the ClientRoom

  get clientRoom() {
    return this.#room.clientRoom ?? null
  }

  get slug() {
    return this.#room.clientRoom?.slug ?? null
  }

  get agentId() {
    return this.#room.clientAgent?.agentId ?? null
  }

  // other RoomMates

  get Tileset() {
    return this.#room.Tileset
  }
  get Screen() {
    return this.#room.Screen
  }
}

export default RoomMate
