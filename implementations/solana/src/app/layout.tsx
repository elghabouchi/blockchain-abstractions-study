import './globals.css'
import { ClusterProvider } from '@/components/cluster/cluster-data-access'
import { SolanaProvider } from '@/components/solana/solana-provider'
import { ReactQueryProvider } from './react-query-provider'
import  ClientLayout  from '@/components/ui/client-layout'

export const metadata = {
  title: 'Tourism DApp',
  description: 'A tourism marketplace DApp for publishing and buying articles.',
}



export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <ClusterProvider>
            <SolanaProvider>
            <ClientLayout>{children}</ClientLayout>
            </SolanaProvider>
          </ClusterProvider>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
