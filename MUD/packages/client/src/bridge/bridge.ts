import {
  createConfig,
  configureChains,
  mainnet,
} from '@wagmi/core'
import { publicProvider } from '@wagmi/core/providers/public'
import { readContract } from '@wagmi/core'
import CrawlerToken from './CrawlerToken.json';

//------------
// wagmi
//
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet],
  [publicProvider()],
)
const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
})

//--------------
// Crawler
//

// const address = CrawlerToken.networks[1].address
// const address = '0x64DCeA44e1DC1CB91E5718306C5440f33C2f1666' // goerli
const address = '0x8E70b94C57b0CBC9807c0F58Bc251f4cD96AcDb0' // mainnet
const abi = CrawlerToken.abi

export async function tokenIdToCoord(tokenId: bigint) {
  const data = await readContract({
    abi,
    address,
    functionName: 'tokenIdToCoord',
    args: [tokenId.toString()],
  })
  return data as bigint
}
