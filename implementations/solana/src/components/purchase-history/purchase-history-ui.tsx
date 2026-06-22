'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { Alert, Box, Card, CardContent, CircularProgress, Divider, Typography } from '@mui/material'
import CardMedia from '@mui/material/CardMedia'
import { CalendarMonth, Inventory, Person, ShoppingCart } from '@mui/icons-material'
import { useIpfsMetadata } from '../api/use-ipfs-metadata'
import { useTourismMarketplaceProgram, useTourismMarketplaceProgramAccount } from '../tourism-marketplace/tourism-marketplace-data-access'
import { ProgramAccount, PurchaseHistoryAccountData, PurchaseHistoryMetadata } from '@/lib/marketplace/types'
import { formatDate, formatSol, shortAddress } from '@/lib/marketplace/format'

export function TourismMarketplaceList() {
  const { purchaseHistoryAccounts, getProgramAccount } = useTourismMarketplaceProgram()

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
      {purchaseHistoryAccounts.isLoading ? (
        <Box textAlign="center"><CircularProgress /></Box>
      ) : purchaseHistoryAccounts.data?.length ? (
        <Box display="flex" flexWrap="wrap" gap={3} justifyContent="flex-start">
          {(purchaseHistoryAccounts.data as ProgramAccount<PurchaseHistoryAccountData>[]).map((account) => (
            <Box key={account.publicKey.toString()} width={{ xs: '100%', sm: '48%', md: '40%' }}>
              <TourismMarketplaceCard account={account.publicKey} />
            </Box>
          ))}
        </Box>
      ) : (
        <Box textAlign="center" mt={4}>
          <Typography variant="h6">No purchase history yet.</Typography>
        </Box>
      )}
    </Box>
  )
}

function TourismMarketplaceCard({ account }: { account: PublicKey }) {
  const { purchaseHistoryAccount } = useTourismMarketplaceProgramAccount({ account })
  const { publicKey } = useWallet()
  const { data: metadata, isLoading, isError } = useIpfsMetadata<PurchaseHistoryMetadata>(purchaseHistoryAccount.data?.cid)

  if (purchaseHistoryAccount.isLoading || isLoading) {
    return <Box textAlign="center"><CircularProgress /></Box>
  }

  const data = purchaseHistoryAccount.data
  if (isError || !data || !metadata) return null

  const isBuyer = Boolean(publicKey && data.buyer.equals(publicKey))

  return (
    <Card elevation={4} sx={{ display: 'flex', flexDirection: 'column', height: '100%', borderRadius: 2 }}>
      {metadata.url && (
        <CardMedia
          component="img"
          height="220"
          image={metadata.url}
          alt={metadata.titre || 'Article image'}
          sx={{ objectFit: 'cover' }}
        />
      )}

      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {metadata.titre || 'Untitled'}
        </Typography>

        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <Person fontSize="small" />
          <Typography variant="body2" color="text.secondary">
            {isBuyer ? 'Seller' : 'Buyer'}: {isBuyer ? shortAddress(data.seller) : shortAddress(data.buyer)}
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        <Box display="flex" flexDirection="column" gap={1}>
          <Box display="flex" alignItems="center" gap={1}>
            <Inventory fontSize="small" />
            <Typography variant="body1" fontWeight="bold">Quantity:</Typography>
            <Typography>{metadata.quantite}</Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <Inventory color="secondary" fontSize="small" />
            <Typography variant="body1" fontWeight="bold">Unit price:</Typography>
            <Typography color="secondary">{formatSol(metadata.prixUnitaire)}</Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <ShoppingCart color="primary" fontSize="small" />
            <Typography variant="body1" fontWeight="bold">Total:</Typography>
            <Typography color="primary">{formatSol(metadata.prixTotal ?? metadata.prixUnitaire)}</Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box display="flex" alignItems="center" gap={1}>
          <CalendarMonth fontSize="small" />
          <Typography variant="caption" color="text.disabled">
            Purchased on: {formatDate(metadata.date, true)}
            {isBuyer && ' (Your purchase)'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}
