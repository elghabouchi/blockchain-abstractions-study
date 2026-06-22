// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import { TourismMarketplace, TourismMarketplaceIDL } from './tourism-marketplace-idl'

export { TourismMarketplaceIDL }
export type { TourismMarketplace }

export const TOURISM_MARKETPLACE_PROGRAM_ID = new PublicKey(TourismMarketplaceIDL.address)

export function getTourismMarketplaceProgram(provider: AnchorProvider, address?: PublicKey) {
  const idl = JSON.parse(JSON.stringify(TourismMarketplaceIDL))
  return new Program(
    { ...idl, address: address ? address.toBase58() : TourismMarketplaceIDL.address } as any,
    provider,
  ) as any
}

export function getTourismMarketplaceProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      return new PublicKey('ALddDbijDJGatBoQsvNXMGkqyeucEH3aLtLv81Z44hms')
    case 'mainnet-beta':
    default:
      return TOURISM_MARKETPLACE_PROGRAM_ID
  }
}
