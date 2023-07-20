import React, { useMemo } from 'react'
import { useRemoteDocument } from '../hooks/useDocument'
import { QuestRealmDoc, QuestChamberDoc, QuestAgentDoc } from 'hyperbox-sdk'

// @ts-ignore
const useRealmMetadataDocument = (realmCoord) => {
  return useRemoteDocument(QuestRealmDoc.type, realmCoord.toString())
}

// @ts-ignore
const useChamberMetadataDocument = (realmCoord, chamberSlug) => {
  const key = QuestChamberDoc.makeChamberKey(realmCoord, chamberSlug)
  return useRemoteDocument(QuestChamberDoc.type, key)
}

// @ts-ignore
const useAgentMetadataDocument = (realmCoord, chamberSlug) => {
  const key = QuestAgentDoc.makeChamberKey(realmCoord, chamberSlug)
  return useRemoteDocument(QuestAgentDoc.type, key)
}

export {
  useRealmMetadataDocument,
  useChamberMetadataDocument,
  useAgentMetadataDocument,
}
