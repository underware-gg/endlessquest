import { useComponentValue, useEntityQuery, useRow } from '@latticexyz/react';
import { Entity, Has, HasValue, getComponentValueStrict } from '@latticexyz/recs';
import { useMUD } from '../../store';
import { usePlayer } from '../hooks/usePlayer';
import { useAgent } from '../hooks/useAgent';


export const AgentLocation = () => {
  // const {
  //   components: { Position, Location },
  //   network: { playerEntity },
  // } = useMUD()

  const { agentEntity } = usePlayer()
  const {
    coord,
    slug,
    yonder,
    gemType,
    gemName,
    coins,
    worth,
    metadata,
  } = useAgent(agentEntity)


  return (
    <div className='AgentLocation'>
      <h2>Agent</h2>
      {/* <div>coord: {coord?.toString() ?? '?'}</div> */}
      <div>entity: {BigInt(agentEntity ? agentEntity as string : 0).toString() ?? '?'}</div>
      {/* <div>coord:{coord?.toString() ?? '?'}</div> */}
      {/* <div>chamber: {slug ?? '?'}</div> */}
      <div>yonder: {yonder ?? '?'}</div>
      <div>gem: {gemName ?? '?'}</div>
      <div>coins: {coins ?? '?'}</div>
      <div>worth: {worth ?? '?'}</div>
      <div>name: {metadata?.name ?? '?'}</div>
      <div>description: {metadata?.description ?? '?'}</div>
    </div>
  )
}
