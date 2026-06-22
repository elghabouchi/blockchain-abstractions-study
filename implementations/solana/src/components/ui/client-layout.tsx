'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { User, History, Plus, FileText } from 'lucide-react'
import { UiLayout } from '@/components/ui/ui-layout'
import { ReactNode, useMemo } from 'react'

export default function ClientLayout({ children }: { children: ReactNode }) {
  const { connected } = useWallet()

  const links = useMemo(() => {
    if (!connected) return []

    return [
      { label: 'Account', path: '/account', icon: <User size={18} /> },
      { label: 'Create', path: '/create-article', icon: <Plus size={18} /> },
      { label: 'My Articles', path: '/article', icon: <FileText size={18} /> },
      { label: 'History', path: '/purchase-history', icon: <History size={18} /> },

    ]
  }, [connected])

  return <UiLayout links={links}>{children}</UiLayout>
}
