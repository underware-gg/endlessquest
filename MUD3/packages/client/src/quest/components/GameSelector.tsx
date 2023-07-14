import React, { useMemo } from 'react'
import { useRealm } from '../hooks/useRealm'
import { Container, Grid, Row, Col } from './Grid'
import { useSettingsContext, SettingsActions } from '../hooks/SettingsContext'
import { useRemoteDocumentIds } from '../hyperspace/hooks/useDocumentIds'
import { QuestRealmDoc } from 'hyperbox-sdk'
import { OpenAISetup } from 'endlessquestagent'

interface RealmButtonProps {
  coord: bigint,
  onClick: (coord: bigint) => void,
}

export const RealmButton = ({
  coord = 0n,
  onClick,
}: RealmButtonProps) => {
  const { logo } = useSettingsContext()

  const {
    realmExists,
    metadata,
    artUrl,
  } = useRealm(coord)

  // const _clicked = (event: MouseEvent) => {
  const _clicked = () => {
    // event.stopPropagation()
    onClick(coord)
  }

  return (
    <Row className='SelectRealmBox'>
      <Col span={4} className='SelectRealmImage' onClick={() => _clicked()}>
        <img className='FillParent' src={artUrl ? artUrl : logo} />
      </Col>
      <Col span={8} className='SelectRealmInfo' onClick={() => _clicked()}>
        {metadata &&
          <>
            {/* <p>Realm  {coord.toString()}</p> */}
            <h2 className='Important'>{coord.toString()}. {metadata.name ?? 'New Quest'}</h2>
            <p>{metadata.description ?? null}</p>
          </>
        }
      </Col>
    </Row>
  )
}

export const GameSelector = () => {
  const { dispatch } = useSettingsContext()

  const ids = useRemoteDocumentIds(QuestRealmDoc.type)

  const _selectedCoord = (coord: bigint) => {
    dispatch({
      type: SettingsActions.SET_REALM_COORD,
      payload: coord,
    })
  }

  const buttons = useMemo(() => {
    const result = []
    let lastId = 0
    ids.forEach((id: string) => {
      if (parseInt(id) > lastId) {
        lastId = parseInt(id)
      }
      result.push(<RealmButton key={`realm_${id}`} coord={BigInt(id)} onClick={_selectedCoord} />)
    })
    result.push(<RealmButton key='realm_new' coord={BigInt(lastId + 1)} onClick={_selectedCoord} />)
    return result
  }, [ids])

  return (
    <div className='FadedCover'>
      <Container className='FillParent'>
        <Grid className='SelectRealmContainer Block'>

          <Row className='SelectRealmRow'>
            <Col span={12} className='Padded'>
              <h1 className='Important'>ENDLESS QUEST</h1>
              <h3>Choose your Realm</h3>
            </Col>
          </Row>

          <Row className='SelectRealmButtons'>
            <Col span={12}>
              <Grid className='SelectRealmContainer Block'>
                {buttons}
              </Grid>
            </Col>
          </Row>

          <Row className='SelectRealmRow'>
            <Col span={12} className='Padded'>
              <OpenAISetup />
            </Col>
          </Row>

        </Grid>
      </Container>
    </div>
  )
}

