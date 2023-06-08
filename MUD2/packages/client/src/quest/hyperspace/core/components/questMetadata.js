import { coordToSlug } from '../../../bridge/Crawl'
import RoomCollection from '../interfaces/RoomCollection'

class QuestMetadata extends RoomCollection {
  // @ts-ignore
  constructor(room, type) {
    super(room, type)
  }

  // @ts-ignore
  updateRealmMetadata(coord, metadata) {
    console.log(`Hyper.updateRealmMetadata()`, coord, metadata)
    this.upsert(coord.toString(), {
      metadata: JSON.stringify(metadata),
      name: metadata?.name ?? null,
      description: metadata?.description ?? null,
    })
  }

  // @ts-ignore
  updateChamberMetadata(coord, metadata) {
    const slug = coordToSlug(coord, false)
    console.log(`Hyper.updateChamberMetadata()`, slug, coord, metadata)
    this.upsert(slug, {
      metadata: JSON.stringify(metadata),
      name: metadata?.name ?? null,
      description: metadata?.description ?? null,
    })
  }

  // @ts-ignore
  updateRealmArtUrl(coord, artUrl) {
    console.log(`Hyper.updateRealmArtUrl()`, coord, artUrl)
    this.upsert(coord.toString(), {
      artUrl
    })
  }

  // @ts-ignore
  updateChamberArtUrl(coord, artUrl) {
    const slug = coordToSlug(coord, false)
    console.log(`Hyper.updateChamberArtUrl()`, slug, coord, artUrl)
    this.upsert(slug, {
      artUrl
    })
  }

}

export default QuestMetadata
