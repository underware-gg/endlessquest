export const createMessage = {
  ping: () => ({
    type: 'ping',
  }),
  pong: () => ({
    type: 'pong',
  }),
  // @ts-ignore
  connect: (agentId, ops) => ({
    type: 'connect',
    agentId,
    ops,
  }),
  // @ts-ignore
  patch: (ops) => ({
    type: 'patch',
    ops,
  }),
  // @ts-ignore
  connected: (agentId) => ({
    type: 'connected',
    agentId,
  }),
  // @ts-ignore
  disconnected: (agentId) => ({
    type: 'disconnected',
    agentId,
  }),
}
