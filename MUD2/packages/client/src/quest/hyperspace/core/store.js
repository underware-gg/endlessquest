// @ts-nocheck
import EventEmitter from 'events'
import { typeDefs } from './merge/crdt-type'
import { setValueAtPath, deepCopy } from './merge/tiny-merge'

class Store {
  collections = {}
  eventEmitter = new EventEmitter().setMaxListeners(50)

  // If we also include a source it can be used for updating the crdts.
  setDocument(type, id, document, source = 'local', triggerChange = true) {
    if (this.collections[type] === undefined) {
      if (document === null) {
        return false
      }

      this.collections[type] = {
        [id]: document,
      }

      this.emit({ type, event: 'create' }, id, document)
      this.emit({ type, event: 'change' }, id, document)
      if (triggerChange) {
        this.eventEmitter.emit('change', source, type, id, '/', document)
      }
      // console.log(`setDocument(${source}, ${id}, ${type}): new type`)
      return true
    }

    if (this.collections[type][id] === undefined) {
      if (document === null) {
        return false
      }

      this.collections[type][id] = document
      this.emit({ type, event: 'create' }, id, document)
      this.emit({ type, event: 'change' }, id, document)
      if (triggerChange) {
        this.eventEmitter.emit('change', source, type, id, '/', document)
      }
      return true
    }

    if (document === null) {
      delete this.collections[type][id]
      this.emit({ type, event: 'delete' }, id, document)
      this.emit({ type, event: 'change' }, id, document)
      if (triggerChange) {
        this.eventEmitter.emit('change', source, type, id, '/', document)
      }
      return true
    } else {
      this.collections[type][id] = document
      this.emit({ type, event: 'update' }, id, document)
      this.emit({ type, event: 'change' }, id, document)
      if (triggerChange) {
        this.eventEmitter.emit('change', source, type, id, '/', document)
      }
      // console.log(`setDocument(${source}, ${id}, ${type}): update`)
      return true
    }
  }

  setValueAtPath(type, id, path, value, source = 'local') {
    const document = this.getDocument(type, id)

    if (document === null) {
      if (path !== '/') {
        throw new Error('Cannot set value at path "/" on a non-existent document')
      }

      this.setDocument(type, id, deepCopy(value), source)
      return
    }

    if (path === '/') {
      this.setDocument(type, id, deepCopy(value), source)
      return
    }

    const newDocument = deepCopy(document)
    const typeDef = typeDefs[type]
    const pathIndex = typeDef.indices[path]
    const pathArr = typeDef.paths[pathIndex]
    setValueAtPath(newDocument, pathArr, value)
    this.setDocument(type, id, newDocument, source, false)

    this.eventEmitter.emit('change', source, type, id, path, value)
  }

  getDocument(type, id) {
    return this.collections[type]?.[id] ?? null
  }

  getDocuments(type) {
    return Object.values(this.collections[type] ?? {})
  }

  hasDocument(type, id) {
    return this.collections[type]?.[id] !== undefined
  }

  getTypes() {
    return Object.keys(this.collections)
  }

  getIds(type) {
    return Object.keys(this.collections[type] ?? {})
  }

  on(options, listener) {
    if (options === null) {
      this.eventEmitter.on('change', listener)
      return
    }

    const { type, event } = options
    this.eventEmitter.on(`${type}:${event}`, listener)
  }

  off(options, listener) {
    if (options === null) {
      this.eventEmitter.off('change', listener)
      return
    }
    const { type, event } = options
    this.eventEmitter.off(`${type}:${event}`, listener)
  }

  emit({ type, event }, id, document) {
    this.eventEmitter.emit(`${type}:${event}`, id, document)
  }
}

export default Store
