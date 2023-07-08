import React from 'react'
import { useHyperspaceContext } from './HyperspaceContext'
import { useDocumentIds } from 'hyperbox-sdk'

// @ts-ignore
const useRemoteDocumentIds = (type) => {
  const { remoteStore } = useHyperspaceContext()
  return useDocumentIds(type, remoteStore)
}

// @ts-ignore
const useLocalDocumentIds = (type) => {
  const { localStore } = useHyperspaceContext()
  return useDocumentIds(type, localStore)
}

export {
  useRemoteDocumentIds,
  useLocalDocumentIds,
}
