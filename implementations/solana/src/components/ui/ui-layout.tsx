'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import * as React from 'react'
import { ReactNode, Suspense } from 'react'
import toast, { Toaster } from 'react-hot-toast'

import { AccountChecker } from '../account/account-ui'
import { ClusterChecker, ClusterUiSelect, ExplorerLink } from '../cluster/cluster-ui'
import { WalletButton } from '../solana/solana-provider'

import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Stack from '@mui/material/Stack'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

export function UiLayout({ children, links }: { children: ReactNode; links: { label: string; path: string; icon: React.ReactNode }[] }) {
  const pathname = usePathname()

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh" sx={{ backgroundColor: '#e3f2fd' }}>
      <AppBar position="static" sx={{ backgroundColor: '#007BFF' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link href="/">Tourism DApp</Link>
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            {links.map((link) => (
              <Link href={link.path} key={link.path} className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded">
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
            <WalletButton />
            <ClusterUiSelect />
          </Stack>
        </Toolbar>
      </AppBar>
      <ClusterChecker>
        <AccountChecker />
      </ClusterChecker>
      <Container maxWidth="lg" sx={{ flexGrow: 1, my: 4 }}>
        <Suspense
          fallback={
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
              <CircularProgress />
            </Box>
          }
        >
          {children}
        </Suspense>
        <Toaster position="bottom-right" />
      </Container>
    </Box>
  )
}

export function AppModal({
  children,
  title,
  hide,
  show,
  submit,
  submitDisabled,
  submitLabel,
}: {
  children: ReactNode
  title: string
  hide: () => void
  show: boolean
  submit?: () => void
  submitDisabled?: boolean
  submitLabel?: string
}) {
  return (
    <Dialog open={show} onClose={hide} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>{children}</DialogContent>
      <DialogActions>
        {submit && (
          <Button onClick={submit} disabled={submitDisabled} variant="contained">
            {submitLabel || 'Save'}
          </Button>
        )}
        <Button onClick={hide} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export function AppHero({
  children,
  title,
  subtitle,
}: {
  children?: ReactNode
  title: ReactNode
  subtitle: ReactNode
}) {
  return (
    <Box py={8} textAlign="center" sx={{ backgroundColor: '#e9f0f7' }}>
      <Container maxWidth="md">
        <Typography variant="h3" component="h1" gutterBottom sx={{ color: '#2c3e50' }}>
          {title}
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          {subtitle}
        </Typography>
        {children}
      </Container>
    </Box>
  )
}

export function ellipsify(str = '', len = 4) {
  if (str.length > 30) {
    return str.substring(0, len) + '..' + str.substring(str.length - len, str.length)
  }
  return str
}

export function useTransactionToast() {
  return (signature: string) => {
    toast.success(
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '16px' }}>Transaction sent</div>
        <ExplorerLink path={`tx/${signature}`} label={'View Transaction'} />
      </div>,
    )
  }
}
