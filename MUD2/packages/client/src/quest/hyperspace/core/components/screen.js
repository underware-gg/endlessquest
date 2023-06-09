import RoomCollection from '../interfaces/RoomCollection'

export const TYPE = {
  DOCUMENT: 'document',
  PDF_BOOK: 'pdf_book',
}

class Screen extends RoomCollection {
  // @ts-ignore
  constructor(room) {
    super(room, 'screen')

  }

  //---------------------------------------
  // Actions
  //

  // @ts-ignore
  makeScreen(type, x, y, rot, content, name = null) {
    return {
      name: name ?? type,
      type,
      content,
      page: 0,
      position: {
        x: x,
        y: y,
        z: 0,
      },
      rotation: {
        x: 0,
        y: rot,
        z: 0,
      },
    }
  }

  // @ts-ignore
  createDocument(id, x, y, rot, text, name) {
    const screen = this.makeScreen(TYPE.DOCUMENT, x, y, rot, text, name)
    console.log(`New screen:`, screen)
    return this.upsert(id, screen, true)
  }

  // @ts-ignore
  createBook(id, x, y, rot, url, name) {
    const screen = this.makeScreen(TYPE.PDF_BOOK, x, y, rot, url, name)
    console.log(`New Book:`, screen)
    return this.upsert(id, screen, true)
  }

  // @ts-ignore
  updateScreen(id, values) {
    this.upsert(id, values, true)
  }

}

export default Screen
