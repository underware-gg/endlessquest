import { useChamber } from '../hooks/useChamber'

export const ChamberLocation = () => {
  // const {
  //   components: { Position, Location },
  //   network: { playerEntity },
  // } = useMUD()

  const {
    coord,
    slug,
    tokenId,
    yonder,
    gemType,
    gemName,
    coins,
    worth,
    metadata,
    metadataIsFetching,
    metadataIsError,
    url,
  } = useChamber()

  return (
    <div>
      <div className='ChamberLocation'>

        <h3>Location</h3>
        <p className='Important'>{metadataIsFetching ? 'dreaming...' : (metadata?.name ?? '?')}</p>
        <p>{metadataIsFetching ? '...' : (metadata?.description ?? '?')}</p>

        <div className='Infos'>
          <div>Token Id: {tokenId?.toString() ?? '?'}</div>
          <div>Chamber: {slug ?? '?'}</div>
          {/* <div>Coord:{coord?.toString() ?? '?'}</div> */}
          <div>Yonder: {yonder ?? '?'}</div>
          <div>Gem: {gemName ?? '?'}</div>
          <div>Coins: {coins ?? '?'}</div>
          {/* <div>Worth: {worth ?? '?'}</div> */}
          {/* <div>Url: {url?.slice(0, 20) ?? '?'}</div> */}
        </div>
      </div>

      {url &&
        <div className='ChamberLocation'>
          <img className='FillParent' src={url} />
        </div>
      }
    </div>
  )
}
