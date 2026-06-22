'use client'
import { getTourismMarketplaceProgram, getTourismMarketplaceProgramId } from '@project/anchor'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Cluster, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../ui/ui-layout'
import BN from 'bn.js'
import { useQueryClient } from '@tanstack/react-query'
import { ArticleAccountData, ProgramAccount, PurchaseHistoryAccountData } from '@/lib/marketplace/types'

interface ArticleMutationArgs {
  articleId: string
  cid: string
}

type BuyArticleArgs = {
  articleId: string
  cid: string
  totalPrice: number
  historyId: string
  historyCid: string
}

export function useTourismMarketplaceProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getTourismMarketplaceProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getTourismMarketplaceProgram(provider, programId), [provider, programId])

  const accounts = useQuery<ProgramAccount<ArticleAccountData>[]>({
    queryKey: ['tourismesimple', 'all', { cluster }],
    queryFn: () => program.account.article.all(),
  })
  const purchaseHistoryAccounts = useQuery<ProgramAccount<PurchaseHistoryAccountData>[]>({
    queryKey: ['purchase-history', 'all', { cluster }],
    queryFn: () => program.account.purchaseHistory.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })
  const createArticle = useMutation<string, Error, ArticleMutationArgs>({
    mutationKey: ['article', 'create', { cluster }],
    mutationFn: async ({ articleId, cid }) => {
      return program.methods.createArticle(articleId, cid).rpc()
    },
    onSuccess: (signature) => {
      transactionToast(signature)
      accounts.refetch()
    },
    onError: (error) => {
      toast.error(`Error creating post: ${error.message}`)
    },
  })
   
  return {
    program,
    programId,
    accounts,
    purchaseHistoryAccounts,
    getProgramAccount,
    createArticle,
  }
}

export function useTourismMarketplaceProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useTourismMarketplaceProgram()
  const { publicKey } = useWallet();
  const queryClient = useQueryClient();
  const accountQuery = useQuery({
    queryKey: ['tourismesimple', 'fetch', { cluster, account }],
    queryFn: () => program.account.article.fetch(account) as Promise<ArticleAccountData>,
  })

  const purchaseHistoryAccount = useQuery({
    queryKey: ['purchase-history', 'fetch', { cluster, account }],
    queryFn: () => program.account.purchaseHistory.fetch(account) as Promise<PurchaseHistoryAccountData>,
  })

  const deleteArticle = useMutation<string, Error, ArticleMutationArgs>({
    mutationKey: ['article', 'delete', { cluster }],
    mutationFn: async ({ articleId }) => {
      return program.methods.deleteArticle(articleId).rpc()
    },
    onSuccess: (signature) => {
      transactionToast(signature)
      accounts.refetch()
      queryClient.invalidateQueries({
        queryKey: ['tourismesimple', 'all', { cluster }],
      })
      queryClient.invalidateQueries({
        queryKey: ['tourismesimple', 'fetch'],
      })
    },
    onError: (error) => {
      toast.error(`Error deleting post: ${error.message}`)
    },
  })

  const buyArticle = useMutation<string, Error, BuyArticleArgs>({
    mutationKey: ['article', 'buy', { cluster }],
    mutationFn: async ({ articleId, cid, totalPrice, historyId, historyCid }) => {
      if (!accountQuery.data) {
        throw new Error("Article data not loaded");
      }
      if (!publicKey) {
        throw new Error("Wallet not connected");
      }
   
      return program.methods
        .buyArticle(articleId, historyId, new BN(totalPrice * LAMPORTS_PER_SOL), cid, historyCid)
        .accounts({
          seller: accountQuery.data.seller,
          buyer: publicKey,
        })
        .remainingAccounts([
          {
            pubkey: accountQuery.data.seller,
            isWritable: true,
            isSigner: false,   
          }
        ])
        .rpc();
    },
    onSuccess: (signature) => {
      transactionToast(signature)
      accounts.refetch()
      queryClient.invalidateQueries({ queryKey: ['purchase-history', 'all', { cluster }] })
    },
    onError: (error) => {
      toast.error(`Error buying post: ${error.message}`)
    },
  })

  const updateArticle = useMutation<string, Error, ArticleMutationArgs>({
    mutationKey: ['article', 'update', { cluster }],
    mutationFn: async ({ articleId, cid }) => {
      return program.methods.updateArticle(articleId, cid).rpc()
    },
    onSuccess: (signature) => {
      transactionToast(signature)
      accounts.refetch()
      queryClient.invalidateQueries({ queryKey: ['tourismesimple', 'fetch'] })
    },
    onError: (error) => {
      toast.error(`Error updating post: ${error.message}`)
    },
  })
   
  return {
    accountQuery,
    purchaseHistoryAccount,
    deleteArticle,
    buyArticle,
    updateArticle,
  }
}
