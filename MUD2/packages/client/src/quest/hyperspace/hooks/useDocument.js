import { useState, useEffect } from 'react'
import { useHyperspaceContext } from './HyperspaceContext'

// @ts-ignore
const useRemoteDocument = (type, id) => {
  const { remoteStore } = useHyperspaceContext()
  return useStoreDocument(type, id, remoteStore)
}

// @ts-ignore
const useLocalDocument = (type, id) => {
  const { localStore } = useHyperspaceContext()
  return useStoreDocument(type, id, localStore)
}

// @ts-ignore
const useStoreDocument = (type, id, store) => {
  const [document, setDocument] = useState(null)

  // initialize
  useEffect(() => {
    if (type && id && store) {
      setDocument(store.getDocument(type, id))
    }
  }, [type, id, store])

  // listen
  useEffect(() => {
    if (!store || !id || !type) return

  // @ts-ignore
    function _handleChange(documentId, document) {
      if (documentId === id) {
        setDocument(document)
      }
    }

    store.on({ type, event: 'change' }, _handleChange)
    store.on({ type, event: 'delete' }, _handleChange)

    return () => {
      store.off({ type, event: 'change' }, _handleChange)
      store.off({ type, event: 'delete' }, _handleChange)
    }
  }, [type, id, store])

  return document
}

export {
  useRemoteDocument,
  useLocalDocument,
  // useStoreDocument,
} 
