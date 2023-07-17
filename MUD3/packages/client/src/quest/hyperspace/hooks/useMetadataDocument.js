import React, { useMemo } from 'react'
import { useRemoteDocument } from '../hooks/useDocument'
import { QuestRealmDoc, QuestChamberDoc, QuestAgentDoc } from 'hyperbox-sdk'

// @ts-ignore
const useRealmMetadataDocument = (realmCoord) => {
  return useRemoteDocument(QuestRealmDoc.type, realmCoord.toString())
}

// @ts-ignore
const useChamberMetadataDocument = (realmCoord, chamberSlug) => {
  const key = useMemo(() => QuestChamberDoc.makeChamberKey(realmCoord, chamberSlug), [realmCoord, chamberSlug])
  return useRemoteDocument(QuestChamberDoc.type, key)
}

// @ts-ignore
const useAgentMetadataDocument = (realmCoord, chamberSlug) => {
  const key = useMemo(() => QuestAgentDoc.makeChamberKey(realmCoord, chamberSlug), [realmCoord, chamberSlug])
  return useRemoteDocument(QuestAgentDoc.type, key)
}

export {
  useRealmMetadataDocument,
  useChamberMetadataDocument,
  useAgentMetadataDocument,
}
