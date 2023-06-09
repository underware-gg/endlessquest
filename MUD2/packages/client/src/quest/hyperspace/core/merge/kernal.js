import { typeDefs } from './crdt-type.js'
import {
  applyOp,
  createOp,
  getValueAtPath,
  deepCopy,
  getParentPathIndex,
} from './tiny-merge.js'

class Kernal {
  collections = {}
  versions = {}
  latestSeq = -1

  // @ts-ignore
  constructor (onOps) {
    this.onOps = onOps

    Object.keys(typeDefs).forEach((type) => {
      // @ts-ignore
      this.versions[type] = {}
      // @ts-ignore
      this.collections[type] = {}
    })
  }

  // @ts-ignore
  getIds(type) {
    // @ts-ignore
    return Object.keys(this.collections[type] ?? {}) ?? []
  }

  // @ts-ignore
  get(type, id) {
    // @ts-ignore
    return this.collections[type]?.[id]
  }

  // @ts-ignore
  getVersion(type, id, pathIndex) {
    // @ts-ignore
    return this.versions[type][id][pathIndex]
  }

  // @ts-ignore
  applyOps(ops, source) {
    const filteredOps = []

    for (let op of ops) {
      const { type, version } = op

      this.latestSeq = Math.max(version[0], this.latestSeq)

      // @ts-ignore
      if (this.versions[type] === undefined) {
        continue
      }

      // @ts-ignore
      if (applyOp(op, this.versions[type], this.collections[type])) {
        filteredOps.push(op)
      }
    }

    if (filteredOps.length > 0) {
      this.onOps(filteredOps, source)
    }
  }

  // @ts-ignore
  getOpsFromChanges(changes) {
    const ops = []

    for (let i = 0; i < changes.length; i++) {
      const { type, key, pathIndex } = changes[i]

      // @ts-ignore
      if (this.versions[type][key] === undefined) {
        continue
      }

      // @ts-ignore
      if (this.versions[type][key][pathIndex] === undefined) {
        continue
      }

      // @ts-ignore
      const path = typeDefs[type].paths[pathIndex]
      // @ts-ignore
      const value = getValueAtPath(this.collections[type][key], path)

      if (pathIndex === 0) {
        ops.push({
          type,
          key,
          version: this.getVersion(type, key, pathIndex),
          pathIndex,
          value,
        })

        continue
      }

      // @ts-ignore
      const parentPathIndex = getParentPathIndex(typeDefs[type], this.versions[type][key], pathIndex)
      if (parentPathIndex === -1) {
        continue
      }

      // @ts-ignore
      const parentVersion = this.versions[type][key][parentPathIndex]

      ops.push({
        type,
        key,
        version: this.getVersion(type, key, pathIndex),
        pathIndex,
        parentPathIndex,
        parentVersion,
        value,
      })
    }

    return ops
  }

  getSnapshotOps() {
    const ops = []

    const collections = Object.entries(this.collections)

    for (let i = 0; i < collections.length; i++) {
      const [type, collection] = collections[i]
      const keys = Object.keys(collection)
      // @ts-ignore
      const typeDef = typeDefs[type]

      for (let j = 0; j < keys.length; j++) {
        const key = keys[j]
        const document = collection[key]

        // @ts-ignore
        for (let fieldIndex in this.versions[type][key]) {
          const path = typeDef.paths[fieldIndex]
          const pathString = `/${path.join('.')}`
          const value = deepCopy(getValueAtPath(document, path))

          ops.push(
            createOp(
              // @ts-ignore
              this.versions[type],
              type,
              key,
              pathString,
              // @ts-ignore
              this.versions[type][key][fieldIndex],
              value,
            )
          )
        }
      }
    }

    return ops
  }
}

export default Kernal
