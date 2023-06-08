import RoomCollection from '../interfaces/RoomCollection'

class Tileset extends RoomCollection {
  // @ts-ignore
  constructor(room) {
    super(room, 'tileset')
  }

  // @ts-ignore
  updateTileset(id, name, width, height, blob) {
  }

}

export default Tileset
