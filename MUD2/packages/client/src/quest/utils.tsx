import { Entity } from "@latticexyz/recs"

export const entityToBytes32 = (entity: string) => {
  return '0x' + entity.replace('0x', '').padStart(64, '0') as `0x${string}`
}

export const agentToCoord = (storeCache: { tables: { Agent: { get: (arg0: { key: `0x${string}` }) => any } } } , agentEntity: Entity) => {
  const agent = storeCache.tables.Agent.get({ key: entityToBytes32(agentEntity) })
  return agent ? BigInt(agent.coord) : null
}
