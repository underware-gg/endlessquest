import { useRealm } from '../hooks/useRealm'
import { Container, Grid, Row, Col } from './Grid'
import { useSettingsContext, SettingsActions } from '../hooks/SettingsContext'
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
  console.log(`SELECTOR`, coord, realmExists, artUrl, metadata)

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
        <img className='FillParent' src={artUrl ? artUrl : logo} />
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

          <Row className='SelectRealmInfo'>
            <Col span={12} className='Padded'>
              <OpenAISetup />
            </Col>
          </Row>

        </Grid>
      </Container>
    </div>
  )
}

