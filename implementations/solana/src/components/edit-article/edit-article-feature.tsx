'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { WalletButton } from '../solana/solana-provider'
import UpdateArticlePage from './edit-article-ui'

export default function EditArticleFeature() {
  const { publicKey } = useWallet()

  return publicKey ? (
      <UpdateArticlePage />
  ) : (
    <div className="max-w-4xl mx-auto mt-10">
      <div className="hero py-[64px]">
        <div className="hero-content text-center">
          <WalletButton />
        </div>
      </div>
    </div>
  )
}
