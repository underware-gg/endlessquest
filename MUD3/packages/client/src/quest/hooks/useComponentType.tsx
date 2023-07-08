import React from 'react'
import { useMUD } from '../../store'

export const useComponentType = () => {
  const {
    networkLayer: {
      components: { Chamber },
    }
  } = useMUD()

  return {
    ChamberSchema: Chamber.schema
  }
}
