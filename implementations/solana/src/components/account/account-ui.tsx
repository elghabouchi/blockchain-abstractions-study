'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { IconRefresh } from '@tabler/icons-react'
import { useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { AppModal, ellipsify } from '../ui/ui-layout'
import { useCluster } from '../cluster/cluster-data-access'
import { ExplorerLink } from '../cluster/cluster-ui'
import {
  useGetBalance,
  useGetSignatures,
  useRequestAirdrop,
  useTransferSol,
} from './account-data-access'
import {Alert,Button, CircularProgress, Paper, Typography, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box ,Stack} from '@mui/material'

export function AccountBalance({ address }: { address: PublicKey }) {
  const query = useGetBalance({ address })

  return (
    <Paper elevation={3} sx={{ padding: 4, maxWidth: 400, margin: '0 auto' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Account Balance
      </Typography>
      <Box display="flex" justifyContent="center" alignItems="center" fontSize={24} fontWeight={500}>
  {query.data ? (
    <>
      <BalanceSol balance={query.data} />&nbsp;<span style={{ fontWeight: 600 }}>SOL</span>
    </>
  ) : (
    <CircularProgress size={24} color="primary" />
  )}
</Box>

      <Box mt={2} display="flex" justifyContent="center">
        <Button variant="outlined" color="primary" onClick={() => query.refetch()} startIcon={<IconRefresh />}>
          Refresh Balance
        </Button>
      </Box>
    </Paper>
  )
}

export function AccountChecker() {
  const { publicKey } = useWallet()

  if (!publicKey) {
    return (
      <Alert severity="warning" sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="body1">
          To <strong>buy</strong> or <strong>sell</strong>, you must first connect your wallet.        </Typography>
      </Alert>
    )
  }

  return <AccountBalanceCheck address={publicKey} />
}

export function AccountBalanceCheck({ address }: { address: PublicKey }) {
  const { cluster } = useCluster()
  const mutation = useRequestAirdrop({ address })
  const query = useGetBalance({ address })

  if (query.isLoading) {
    return <Typography align="center" color="textSecondary">Checking account...</Typography>
  }
  if (query.isError || !query.data) {
    return (
      <Paper elevation={2} sx={{ padding: 3, backgroundColor: 'warning.light' }}>
        <Typography align="center" color="error">
          Your account is not found on the <strong>{cluster.name}</strong> cluster.
        </Typography>
        <Box mt={2} display="flex" justifyContent="center">
          <Button
            variant="contained"
            color="warning"
            onClick={() => mutation.mutateAsync(1).catch((err) => console.log(err))}
          >
            Request Airdrop
          </Button>
        </Box>
      </Paper>
    )
  }
  return null
}

export function AccountTransactions({ address }: { address: PublicKey }) {
  const query = useGetSignatures({ address })
  const [showAll, setShowAll] = useState(false)

  const items = useMemo(() => {
    if (showAll) return query.data
    return query.data?.slice(0, 5)
  }, [query.data, showAll])

  return (
  	 <Paper elevation={3} sx={{ padding: 4, marginTop: 4, maxWidth: 800, margin: '0 auto' }}>

      <Typography variant="h5" gutterBottom>
        Transaction History
      </Typography>
      {query.isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center">
          <CircularProgress size={40} color="primary" />
        </Box>
      ) : query.isError ? (
        <Typography color="error" align="center">{query.error?.message}</Typography>
      ) : query.isSuccess && query.data?.length === 0 ? (
        <Typography align="center" color="textSecondary">No transactions found.</Typography>
      ) : (
<TableContainer component={Paper}>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Signature</TableCell>
                <TableCell align="right">Slot</TableCell>
                <TableCell>Block Time</TableCell>
                <TableCell align="right">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items?.map((item) => (
                <TableRow key={item.signature}>
                  <TableCell>
                    <ExplorerLink path={`tx/${item.signature}`} label={ellipsify(item.signature, 8)} />
                  </TableCell>
                  <TableCell align="right">
                    <ExplorerLink path={`block/${item.slot}`} label={item.slot.toString()} />
                  </TableCell>
                  <TableCell>{new Date((item.blockTime ?? 0) * 1000).toISOString()}</TableCell>
                  <TableCell align="right">
                    {item.err ? (
                      <Typography color="error">Failed</Typography>
                    ) : (
                      <Typography color="success">Success</Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {(query.data?.length ?? 0) > 5 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Button variant="text" onClick={() => setShowAll(!showAll)}>
                      {showAll ? 'Show Less' : 'Show All'}
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  )
}

export function AccountButtons({ address }: { address: PublicKey }) {
  const wallet = useWallet()
  const { cluster } = useCluster()
  const [showAirdropModal, setShowAirdropModal] = useState(false)
  const [showSendModal, setShowSendModal] = useState(false)

  return (
   
<Stack direction="row" justifyContent="center" spacing={2} mt={3}>
  <ModalAirdrop hide={() => setShowAirdropModal(false)} address={address} show={showAirdropModal} />
  <ModalSend address={address} show={showSendModal} hide={() => setShowSendModal(false)} />
  
  <Box display="flex" justifyContent="space-around" width="50%">
    <Button
      disabled={cluster.network?.includes('mainnet')}
      variant="outlined"
      color="warning"
      onClick={() => setShowAirdropModal(true)}
    >
      Request Airdrop
    </Button>
    <Button
      disabled={wallet.publicKey?.toString() !== address.toString()}
      variant="outlined"
      color="success"
      onClick={() => setShowSendModal(true)}
    >
      Send SOL
    </Button>
  </Box>
</Stack>
  )
}

function BalanceSol({ balance }: { balance: number }) {
  return <span>{Math.round((balance / LAMPORTS_PER_SOL) * 100000000) / 100000000}</span>
}

function ModalAirdrop({ hide, show, address }: { hide: () => void; show: boolean; address: PublicKey }) {
  const mutation = useRequestAirdrop({ address })
  const [amount, setAmount] = useState('2')

  return (
    <AppModal
      hide={hide}
      show={show}
      title="Airdrop"
      submitDisabled={!amount || mutation.isPending}
      submitLabel="Request Airdrop"
      submit={() => mutation.mutateAsync(parseFloat(amount)).then(() => hide())}
    >
      <TextField
        disabled={mutation.isPending}
        label="Amount"
        variant="outlined"
        fullWidth
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        type="number"
        inputProps={{ step: 'any', min: 1 }}
      />
    </AppModal>
  )
}

function ModalSend({ hide, show, address }: { hide: () => void; show: boolean; address: PublicKey }) {
  const wallet = useWallet()
  const mutation = useTransferSol({ address })
  const [destination, setDestination] = useState('')
  const [amount, setAmount] = useState('1')

  if (!address || !wallet.sendTransaction) {
    return <Typography color="error">Wallet not connected</Typography>
  }

  return (
    <AppModal
      hide={hide}
      show={show}
      title="Send"
      submitDisabled={!destination || !amount || mutation.isPending}
      submitLabel="Send"
      submit={() => {
        mutation
          .mutateAsync({
            destination: new PublicKey(destination),
            amount: parseFloat(amount),
          })
          .then(() => hide())
      }}
    >
      <TextField
        disabled={mutation.isPending}
        label="Destination Address"
        variant="outlined"
        fullWidth
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        margin="normal"
      />
      <TextField
        disabled={mutation.isPending}
        label="Amount"
        variant="outlined"
        fullWidth
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        type="number"
        inputProps={{ min: 1, step: 'any' }}
        margin="normal"
      />
    </AppModal>
  )
}

export function AccountTokens({ address }: { address: PublicKey }) {return null;}
