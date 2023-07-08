//
// Data Sync Edge Server
//

// local development server
// export const developmentServerUrl = 'ws://localhost:8787'

// funDAOmental production server
const productionServerUrl = 'wss://crdt-server.fundaomental.workers.dev'
export const getServerUrl = () => (import.meta.env.VITE_SERVER_URL ?? productionServerUrl)
export const isProductionServer = () => (getServerUrl() == productionServerUrl)
