import { useEffect, useState } from 'react'
import { useRealm } from '../hooks/useRealm'
import { GameUI } from './GameUI'

interface RealmButtonProps {
  coord: bigint,
  onClick: (coord: bigint) => void,
}

export const RealmButton = ({
  coord = 0n,
  onClick,
}: RealmButtonProps) => {
  const {
    realmExists,
    metadata,
    url,
  } = useRealm(coord)

  // const _clicked = (event: MouseEvent) => {
  const _clicked = () => {
    // event.stopPropagation()
    onClick(coord)
  }

  if (!realmExists && coord != 1n) {
    return <></>
  }

  return (
    <div className='SelectRealmBox'>
      <div className='SelectRealmButton' onClick={() => _clicked()}>
        <img className='FillParent' src={url ?? 'https://github.com/funDAOmental/endlessquest/blob/main/Assets/logos/EndlessQuest-frames/page_01.png?raw=true'} />
      </div>
      <div className='SelectRealmDescription' onClick={() => _clicked()}>
        {metadata &&
          <>
            {/* <p>Realm  {coord.toString()}</p> */}
            <h2 className='Important'>{metadata.name ?? 'New Quest'}</h2>
            <p>{metadata.description ?? null}</p>
          </>
        }
      </div>
    </div>
  )
}

export const GameSelector = () => {
  const [selectedCoord, setSelectedCoord] = useState(0n)

  // hide when selected
  if (selectedCoord > 0n) {
    return <GameUI />
  }

  return (
    <div className='FadedCover WithMouse'>
      <div className='SelectRealmContainer'>
        <RealmButton coord={1n} onClick={setSelectedCoord} />
      </div>
    </div>
  )
}

