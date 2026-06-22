'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { Alert, Box, CircularProgress, Typography } from '@mui/material'
import { ArticleCard } from '../articles/article-card'
import { useIpfsMetadata } from '../api/use-ipfs-metadata'
import { useTourismMarketplaceProgram, useTourismMarketplaceProgramAccount } from '../tourism-marketplace/tourism-marketplace-data-access'
import { ArticleAccountData, ArticleMetadata, ProgramAccount } from '@/lib/marketplace/types'

export function TourismMarketplaceList() {
  const { accounts, getProgramAccount } = useTourismMarketplaceProgram()

  if (getProgramAccount.isLoading) {
    return <Box textAlign="center"><CircularProgress /></Box>
  }

  if (!getProgramAccount.data?.value) {
    return (
      <Alert severity="info" sx={{ textAlign: 'center' }}>
        Program account not found. Make sure the program is deployed and that you are on the correct cluster.
      </Alert>
    )
  }

  return (
    <Box mt={4}>
      {accounts.isLoading ? (
        <Box textAlign="center"><CircularProgress /></Box>
      ) : accounts.data?.length ? (
        <Box display="flex" flexWrap="wrap" gap={3} justifyContent="flex-start">
          {(accounts.data as ProgramAccount<ArticleAccountData>[]).map((account) => (
            <Box key={account.publicKey.toString()} width={{ xs: '100%', sm: '32%', md: '31.9%' }}>
              <TourismMarketplaceCard account={account.publicKey} />
            </Box>
          ))}
        </Box>
      ) : (
        <Box textAlign="center" mt={4}>
          <Typography variant="h6">There are no articles yet.</Typography>
          <Typography>Create an article from the tourism offer page.</Typography>
        </Box>
      )}
    </Box>
  )
}

function TourismMarketplaceCard({ account }: { account: PublicKey }) {
  const { accountQuery, deleteArticle } = useTourismMarketplaceProgramAccount({ account })
  const { publicKey } = useWallet()
  const { data: metadata, isLoading, isError } = useIpfsMetadata<ArticleMetadata>(accountQuery.data?.cid)

  if (accountQuery.isLoading || isLoading) {
    return <Box textAlign="center"><CircularProgress /></Box>
  }

  if (isError || !accountQuery.data || !metadata) {
    return null
  }

  const isOwner = Boolean(publicKey && accountQuery.data.seller.equals(publicKey))

  return (
    <ArticleCard
      account={account}
      metadata={metadata}
      seller={accountQuery.data.seller}
      isOwner={isOwner}
      showSeller={!isOwner}
      descriptionPreview
      deletePending={deleteArticle.isPending}
      onDelete={() => {
        deleteArticle.mutate({
          articleId: accountQuery.data.articleId,
          cid: accountQuery.data.cid,
        })
      }}
    />
  )
}
