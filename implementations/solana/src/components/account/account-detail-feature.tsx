'use client'

import { PublicKey } from '@solana/web3.js'
import { useMemo } from 'react'
import { useParams } from 'next/navigation'

import { ExplorerLink } from '../cluster/cluster-ui'
import { AppHero, ellipsify } from '../ui/ui-layout'
import { AccountBalance, AccountButtons, AccountTokens, AccountTransactions } from './account-ui'

// MUI
import { Box, Stack, Typography } from '@mui/material'

export default function AccountDetailFeature() {
  const params = useParams()
  const address = useMemo(() => {
    if (!params.address) return
    try {
      return new PublicKey(params.address)
    } catch (e) {
      console.log(`Invalid public key`, e)
    }
  }, [params])

  if (!address) {
    return <Typography color="error">Error loading account</Typography>
  }

  return (
    <Box px={2} py={4}>
      <AppHero
        title={<AccountBalance address={address} />}
        subtitle={
          <Box mt={2}>
            <ExplorerLink path={`account/${address}`} label={ellipsify(address.toString())} />
          </Box>
        }
      >
        <Box mt={2}>
          <AccountButtons address={address} />
        </Box>
      </AppHero>

      <Stack spacing={4} mt={4}>
        <AccountTokens address={address} />
        <AccountTransactions address={address} />
      </Stack>
    </Box>
  )
}
