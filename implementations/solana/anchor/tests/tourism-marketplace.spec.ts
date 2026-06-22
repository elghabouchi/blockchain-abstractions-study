import * as anchor from '@coral-xyz/anchor'
import { BN } from '@coral-xyz/anchor'
import { Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { TourismMarketplaceIDL } from '../src/tourism-marketplace-idl'

describe('tourism_marketplace', () => {
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)

  const programId = new PublicKey('ALddDbijDJGatBoQsvNXMGkqyeucEH3aLtLv81Z44hms')
  const program = new anchor.Program({ ...JSON.parse(JSON.stringify(TourismMarketplaceIDL)), address: programId.toBase58() } as any, provider) as any
  const seller = Keypair.generate()
  const buyer = Keypair.generate()
  const articleId = '1'
  const historyId = '2'
  const articleCid = 'QmArticleMetadataCid'
  const updatedArticleCid = 'QmUpdatedArticleCid'
  const historyCid = 'QmPurchaseHistoryCid'

  const [articlePda] = PublicKey.findProgramAddressSync(
    [Buffer.from(articleId), seller.publicKey.toBuffer()],
    program.programId,
  )
  const [purchaseHistoryPda] = PublicKey.findProgramAddressSync(
    [Buffer.from(historyId), buyer.publicKey.toBuffer()],
    program.programId,
  )

  beforeAll(async () => {
    for (const account of [seller.publicKey, buyer.publicKey]) {
      const signature = await provider.connection.requestAirdrop(account, LAMPORTS_PER_SOL)
      await provider.connection.confirmTransaction(signature)
    }
  })

  it('creates an article', async () => {
    await program.methods.createArticle(articleId, articleCid).accounts({ seller: seller.publicKey }).signers([seller]).rpc()

    const article = await program.account.article.fetch(articlePda)
    expect(article.articleId).toEqual(articleId)
    expect(article.cid).toEqual(articleCid)
    expect(article.seller.equals(seller.publicKey)).toBe(true)
  })

  it('buys an article and creates purchase history', async () => {
    await program.methods
      .buyArticle(articleId, historyId, new BN(1_000), updatedArticleCid, historyCid)
      .accounts({
        article: articlePda,
        seller: seller.publicKey,
        buyer: buyer.publicKey,
        purchaseHistory: purchaseHistoryPda,
      })
      .signers([buyer])
      .rpc()

    const article = await program.account.article.fetch(articlePda)
    const purchaseHistory = await program.account.purchaseHistory.fetch(purchaseHistoryPda)

    expect(article.cid).toEqual(updatedArticleCid)
    expect(purchaseHistory.historyId).toEqual(historyId)
    expect(purchaseHistory.cid).toEqual(historyCid)
    expect(purchaseHistory.buyer.equals(buyer.publicKey)).toBe(true)
    expect(purchaseHistory.seller.equals(seller.publicKey)).toBe(true)
  })
})
