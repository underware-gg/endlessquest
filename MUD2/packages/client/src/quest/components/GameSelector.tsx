import { useEffect, useState } from 'react'
import { useRealm } from '../hooks/useRealm'
import { Container, Grid, Row, Col } from './Grid'
import { useSettingsContext, SettingsActions } from '../hooks/SettingsContext'

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
    <Grid className='SelectRealmBox'>
      <Row>
        <Col span={4} className='UI' onClick={() => _clicked()}>
          <img className='FillParent' src={url ?? 'https://github.com/funDAOmental/endlessquest/blob/main/Assets/logos/EndlessQuest-frames/page_01.png?raw=true'} />
        </Col>
        <Col span={8} className='UI' onClick={() => _clicked()}>
          {metadata &&
            <>
              {/* <p>Realm  {coord.toString()}</p> */}
              <h2 className='Important'>{metadata.name ?? 'New Quest'}</h2>
              <p>{metadata.description ?? null}</p>
            </>
          }
        </Col>
      </Row>
    </Grid>
  )
}

export const GameSelector = () => {
  const { dispatch } = useSettingsContext()

  const _selectedCoord = (coord: bigint) => {
    dispatch({
      type: SettingsActions.SET_REALM_COORD,
      payload: coord,
    })
  }

  return (
    <div className='FadedCover WithMouse'>
      <Container className='FillParent'>
        <RealmButton coord={1n} onClick={_selectedCoord} />
      </Container>
    </div>
  )
}

