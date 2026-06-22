'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { Box, Paper, Typography } from '@mui/material'
import { WalletButton } from '../solana/solana-provider'
import { TourismMarketplaceList } from './dashboard-ui'

export default function DashboardFeature() {
  const { publicKey } = useWallet()

  if (!publicKey) {
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <Paper elevation={3} sx={{ p: 4, maxWidth: 520, textAlign: 'center' }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Connect your wallet
          </Typography>
          <Typography color="text.secondary" mb={3}>
            Connect a Solana wallet to view, publish, buy, and manage tourism offers.
          </Typography>
          <WalletButton />
        </Paper>
      </Box>
    )
  }

  return <TourismMarketplaceList />
}
