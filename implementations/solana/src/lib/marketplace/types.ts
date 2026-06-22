import { PublicKey } from '@solana/web3.js'

export interface ArticleMetadata {
  titre: string
  description: string
  url?: string
  quantite: number
  prix: number
  date: number
  sold: number
}

export interface PurchaseHistoryMetadata {
  titre: string
  description: string
  url?: string
  quantite: number
  prixUnitaire: number
  prixTotal: number
  date: number
}

export interface ArticleAccountData {
  articleId: string
  cid: string
  seller: PublicKey
}

export interface PurchaseHistoryAccountData {
  historyId: string
  cid: string
  seller: PublicKey
  buyer: PublicKey
}

export interface ProgramAccount<TAccount> {
  publicKey: PublicKey
  account: TAccount
}

export type AlertMessage = {
  type: 'error' | 'success'
  text: string
}
