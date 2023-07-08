import React from 'react'
import { useHyperspaceContext } from './HyperspaceContext'
import { useDocumentTypes } from 'hyperbox-sdk'

const useRemoteDocumentTypes = () => {
  const { remoteStore } = useHyperspaceContext()
  return useDocumentTypes(remoteStore)
}

const useLocalDocumentTypes = () => {
  const { localStore } = useHyperspaceContext()
  return useDocumentTypes(localStore)
}

export {
  useRemoteDocumentTypes,
  useLocalDocumentTypes,
}
