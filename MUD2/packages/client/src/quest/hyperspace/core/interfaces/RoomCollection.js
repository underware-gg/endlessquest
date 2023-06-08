import RoomMate from './RoomMate'

// crdt collections created inside Room
// share the Room client and stores (RoomMate)
// can access to other objects (RoomMate)
// common functions to access the collection data

class RoomCollection extends RoomMate {
  // @ts-ignore
  constructor(room, type) {
    super(room)
    this.type = type
  }

  // @ts-ignore
  exists(id) {
    if (id == null) return false
    // @ts-ignore
    const data = this.remoteStore.getDocument(this.type, id)
    return data !== null
  }

  // @ts-ignore
  get(id) {
    if (id == null) return null
    // @ts-ignore
    return this.remoteStore.getDocument(this.type, id)
  }

  // @ts-ignore
  upsert(id, newData) {
    if (id == null) return
    let data = this.remoteStore.getDocument(this.type, id) ?? {}
    data = {
      ...data,
      ...newData,
    }
    this.remoteStore.setDocument(this.type, id, data)
    return data
  }


}

export default RoomCollection
