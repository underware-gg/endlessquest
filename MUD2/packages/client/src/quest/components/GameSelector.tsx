import { useEffect, useState } from 'react'
import { useRealm } from '../hooks/useRealm'
import { Container, Grid, Row, Col } from './Grid'
import { useSettingsContext, SettingsActions } from '../hooks/SettingsContext'
import { Keys, useKeys } from '../openai/keys'
import { useCookies } from 'react-cookie'

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
    <Row className='SelectRealmBox'>
      <Col span={4} className='UI' onClick={() => _clicked()}>
        <img className='FillParent' src={url ? url : logo} />
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
  )
}

export const OpenAISetup = () => {
  const { apiKeyIsOk, orgIdIsOk , keysAreOk } = useKeys()
  
  const [cookies, setCookie] = useCookies([Keys.OPENAI_API_KEY, Keys.OPENAI_ORG_ID])

  const _setupCookie = (name: Keys) => {
    const value = window.prompt(`Enter your ${name}`)
    if (value) {
      setCookie(name, value, { path: '/' })
    }
  }

  return (
    <Row className='SelectRealmInfo'>
      <Col span={12} className='Padded'>
        <p>Setup</p>
        <p>OPENAI_API_KEY:&nbsp;
          {apiKeyIsOk
            ? <span className='Green'>OK</span> 
            : <span className='Important Clickable' onClick={() => _setupCookie(Keys.OPENAI_API_KEY)}>SETUP</span>
          }
        </p>
        <p>OPENAI_ORG_ID:&nbsp;
          {orgIdIsOk
            ? <span className='Green'>OK</span>
            : <span className='Important Clickable' onClick={() => _setupCookie(Keys.OPENAI_ORG_ID)}>SETUP</span>}
        </p>
      </Col>
    </Row>
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
    <div className='FadedCover'>
      <Container className='FillParent'>
        <Grid className='SelectRealmContainer Block'>

          <Row className='SelectRealmInfo'>
            <Col span={12} className='Padded'>
              <h1 className='Important'>ENDLESS QUEST</h1>
              <h3>Choose your Realm</h3>
            </Col>
          </Row>

          <RealmButton coord={1n} onClick={_selectedCoord} />

          <OpenAISetup />

        </Grid>
      </Container>
    </div>
  )
}

