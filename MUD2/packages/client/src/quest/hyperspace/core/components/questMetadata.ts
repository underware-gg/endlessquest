import { coordToSlug } from '../../../bridge/Crawl'
import RoomCollection from '../interfaces/RoomCollection'

interface MinimalMetadata {
  name: string
  description: string
}

class Room { }

class QuestMetadata extends RoomCollection {
  constructor(room: Room, type: string) {
    super(room, type)
  }

  updateMetadataWithCoord(coord: bigint, metadata: MinimalMetadata) {
    console.log(`Hyperspace.updateMetadataWithCoord(${this.type})`, coord, metadata)
    this.upsert(coord.toString(), {
      metadata: JSON.stringify(metadata),
      name: metadata?.name ?? null,
      description: metadata?.description ?? null,
    })
  }

  updateMetadataWithSlug(coord: bigint, metadata: MinimalMetadata) {
    const slug = coordToSlug(coord, false)
    console.log(`Hyperspace.updateMetadataWithSlug(${this.type})`, slug, coord, metadata)
    this.upsert(slug, {
      metadata: JSON.stringify(metadata),
      name: metadata?.name ?? null,
      description: metadata?.description ?? null,
    })
  }

  updateArtUrlWithCoord(coord: bigint, artUrl: string) {
    console.log(`Hyperspace.updateArtUrlWithCoord(${this.type})`, coord, artUrl)
    this.upsert(coord.toString(), {
      artUrl
    })
  }

  updateArtUrlWithSlug(coord: bigint, artUrl: string) {
    const slug = coordToSlug(coord, false)
    console.log(`Hyperspace.updateArtUrlWithSlug(${this.type})`, slug, coord, artUrl)
    this.upsert(slug, {
      artUrl
    })
  }

}

export default QuestMetadata
