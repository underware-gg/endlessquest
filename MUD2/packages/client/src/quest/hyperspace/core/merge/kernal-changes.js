import { typeDefs } from './crdt-type.js'

class KernalChanges {
  changes = {}

  constructor () {
    Object.keys(typeDefs).forEach((type) => {
      // @ts-ignore
      this.changes[type] = {}
    })
  }

  // @ts-ignore
  addOps(ops) {
    for (let i = 0; i < ops.length; i++) {
      const op = ops[i]
      const { type, key, pathIndex } = op

      // @ts-ignore
      this.changes[type][key] ??= {}
      // @ts-ignore
      this.changes[type][key][pathIndex] = true
    }
  }

  getChanges() {
    const changes = []

    const types = Object.keys(this.changes)

    for (let i = 0; i < types.length; i++) {
      const type = types[i]
      // @ts-ignore
      const keys = Object.keys(this.changes[type])

      for (let j = 0; j < keys.length; j++) {
        const key = keys[j]
        // @ts-ignore
        const pathIndices = Object.keys(this.changes[type][key])

        for (let k = 0; k < pathIndices.length; k++) {
          const pathIndex = Number(pathIndices[k])
          changes.push({ type, key, pathIndex })
        }
      }
    }

    return changes
  }

  clearChanges() {
    const types = Object.keys(this.changes)

    for (let i = 0; i < types.length; i++) {
      // @ts-ignore
      this.changes[types[i]] = {}
    }
  }
}

export default KernalChanges
