import { useState, useEffect } from 'react'
import { useHyperspaceContext } from './HyperspaceContext'

const useRemoteDocumentTypes = () => {
  const { remoteStore } = useHyperspaceContext()
  return useDocumentTypes(remoteStore)
}

const useLocalDocumentTypes = () => {
  const { localStore } = useHyperspaceContext()
  return useDocumentTypes(localStore)
}

// @ts-ignore
const useDocumentTypes = (store, excludeTypes = []) => {
  const [types, setTypes] = useState([])

  useEffect(() => {
    if (!store) return

    let _mounted = true

    function _updateTypes() {
      if (store && _mounted) {
        const _types = store.getTypes() ?? []
        if (_types.length != types.length && _mounted) {
          // @ts-ignore
          setTypes(_types.filter(t => !excludeTypes.includes(t)))
        }
      }
    }

    _updateTypes()

    store.on(null, _updateTypes)
    return () => {
      store.off(null, _updateTypes)
      _mounted = false
    }
  }, [store])

  return types
}

export {
  useRemoteDocumentTypes,
  useLocalDocumentTypes,
  // useDocumentTypes,
}
