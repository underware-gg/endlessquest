import React from 'react'
import { useHyperspaceContext } from './HyperspaceContext'
import { useDocument } from 'hyperbox-sdk'

// @ts-ignore
const useRemoteDocument = (type, id) => {
  const { remoteStore } = useHyperspaceContext()
  return useDocument(type, id, remoteStore)
}

// @ts-ignore
const useLocalDocument = (type, id) => {
  const { localStore } = useHyperspaceContext()
  return useDocument(type, id, localStore)
}

export {
  useRemoteDocument,
  useLocalDocument,
}
