// import {
//   createConfig,
//   configureChains,
//   mainnet,
// } from '@wagmi/core'
// import { publicProvider } from '@wagmi/core/providers/public'
// import { readContract } from '@wagmi/core'
// import CrawlerToken from './CrawlerToken.json'

// //------------
// // wagmi
// //
// const { chains, publicClient, webSocketPublicClient } = configureChains(
//   [mainnet],
//   [publicProvider()],
// )
// const config = createConfig({
//   autoConnect: true,
//   publicClient,
//   webSocketPublicClient,
// })

// //--------------
// // Crawler
// //

// // const address = CrawlerToken.networks[1].address
// // const address = '0x64DCeA44e1DC1CB91E5718306C5440f33C2f1666' // goerli
// const address = '0x8E70b94C57b0CBC9807c0F58Bc251f4cD96AcDb0' // mainnet
// const abi = CrawlerToken.abi

// export async function tokenIdToCoord(tokenId: number) {
//   const data = await readContract({
//     abi,
//     address,
//     functionName: 'tokenIdToCoord',
//     args: [tokenId.toString()],
//   })
//   return data as bigint
// }

// export interface CoordToChamberDataResult {
//   // Stored on Chamber table
//   coord: bigint
//   tokenId: number
//   seed: bigint
//   yonder: bigint
//   chapter: number
//   terrain: number
//   entryDir: number
//   gemPos: number
//   hoard: {
//     gemType: number
//     coins: number
//     worth: number
//   }
//   // Stored on Tile table
//   bitmap: bigint
//   tilemap: string
//   // Stored on Door table
//   doors: number[]
//   locks: boolean[]
//   // name: string
//   // compass: bigint
// }

// export async function coordToChamberData(coord: bigint) {
//   const data = await readContract({
//     abi,
//     address,
//     functionName: 'coordToChamberData',
//     args: [0, coord.toString(), true],
//   }) as CoordToChamberDataResult
//   console.log(data)
//   return data
// }
