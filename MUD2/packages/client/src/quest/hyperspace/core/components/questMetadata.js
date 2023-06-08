import { coordToSlug } from '../../../bridge/Crawl'
import RoomCollection from '../interfaces/RoomCollection'

class QuestMetadata extends RoomCollection {
  // @ts-ignore
  constructor(room, type) {
    super(room, type)
  }

  // @ts-ignore
  updateMetadataWithCoord(coord, metadata) {
    console.log(`Hyperspace.updateMetadataWithCoord(${this.type})`, coord, metadata)
    this.upsert(coord.toString(), {
      metadata: JSON.stringify(metadata),
      name: metadata?.name ?? null,
      description: metadata?.description ?? null,
    })
  }

  // @ts-ignore
  updateMetadataWithSlug(coord, metadata) {
    const slug = coordToSlug(coord, false)
    console.log(`Hyperspace.updateMetadataWithSlug(${this.type})`, slug, coord, metadata)
    this.upsert(slug, {
      metadata: JSON.stringify(metadata),
      name: metadata?.name ?? null,
      description: metadata?.description ?? null,
    })
  }

  // @ts-ignore
  updateArtUrlWithCoord(coord, artUrl) {
    console.log(`Hyperspace.updateArtUrlWithCoord(${this.type})`, coord, artUrl)
    this.upsert(coord.toString(), {
      artUrl
    })
  }

  // @ts-ignore
  updateArtUrlWithSlug(coord, artUrl) {
    const slug = coordToSlug(coord, false)
    console.log(`Hyperspace.updateArtUrlWithSlug(${this.type})`, slug, coord, artUrl)
    this.upsert(slug, {
      artUrl
    })
  }

}

export default QuestMetadata
