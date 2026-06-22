'use client'

import { useSearchParams } from 'next/navigation'
import { useTourismMarketplaceProgram, useTourismMarketplaceProgramAccount } from '../tourism-marketplace/tourism-marketplace-data-access'
import { useState } from 'react'
import { PublicKey } from '@solana/web3.js'
import {
  Box,
  Button,
  Card,
  CardMedia,
  CircularProgress,
  Container,
  Divider,
  TextField,
  Typography,
} from '@mui/material'
import { HourglassEmpty, Inventory, ShoppingCart } from '@mui/icons-material'
import toast from 'react-hot-toast'
import { PinataService, getMaxIdGlobal } from '../api/api-ui'
import { useIpfsMetadata } from '../api/use-ipfs-metadata'
import { ArticleMetadata, PurchaseHistoryMetadata } from '@/lib/marketplace/types'
import { formatSol } from '@/lib/marketplace/format'

export default function PurchasePage() {
  const searchParams = useSearchParams()
  const accountParam = searchParams.get('account')

  if (!accountParam) return <Typography>No article selected.</Typography>

  return <PurchaseArticle account={new PublicKey(accountParam)} />
}

function PurchaseArticle({ account }: { account: PublicKey }) {
  const { purchaseHistoryAccounts, accounts } = useTourismMarketplaceProgram()
  const [quantity, setQuantity] = useState(1)
  const { accountQuery, buyArticle } = useTourismMarketplaceProgramAccount({ account })
  const {
    data: metadata,
    isLoading: metadataLoading,
    refetch: refetchMetadata,
  } = useIpfsMetadata<ArticleMetadata>(accountQuery.data?.cid)

  if (accountQuery.isLoading || metadataLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!accountQuery.data || !metadata) {
    return <Typography>No article found.</Typography>
  }

  const validQuantity = Math.max(1, Math.min(quantity, metadata.quantite))
  const totalAmount = validQuantity * metadata.prix
  const canBuy = validQuantity > 0 && validQuantity <= metadata.quantite && !buyArticle.isPending

  const handleBuy = async () => {
    const oldCid = accountQuery.data.cid
    let updatedCid: string | undefined
    let historyCid: string | undefined

    try {
      const updatedMetadata: ArticleMetadata = {
        ...metadata,
        quantite: metadata.quantite - validQuantity,
        sold: metadata.sold + validQuantity,
      }

      const history: PurchaseHistoryMetadata = {
        titre: metadata.titre,
        description: metadata.description,
        url: metadata.url,
        quantite: validQuantity,
        prixUnitaire: metadata.prix,
        prixTotal: totalAmount,
        date: Date.now(),
      }

      updatedCid = await PinataService.uploadMetadata(updatedMetadata)
      historyCid = await PinataService.uploadMetadata(history)

      const idHistory = getMaxIdGlobal(accounts?.data, purchaseHistoryAccounts?.data)
      await buyArticle.mutateAsync({
        articleId: accountQuery.data.articleId,
        historyId: (idHistory + 1).toString(),
        totalPrice: totalAmount,
        cid: updatedCid,
        historyCid,
      })

      await accountQuery.refetch()
      await refetchMetadata()
      PinataService.deleteFile(oldCid).catch(() => undefined)
      toast.success('Purchase completed successfully.')
    } catch (error) {
      if (updatedCid) PinataService.deleteFile(updatedCid).catch(() => undefined)
      if (historyCid) PinataService.deleteFile(historyCid).catch(() => undefined)
      toast.error(error instanceof Error ? error.message : 'An error occurred while buying the article.')
    }
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4, p: 3, backgroundColor: 'white', borderRadius: 2, boxShadow: 3 }}>
      {metadata.url && (
        <Card sx={{ mb: 2, borderRadius: 2 }}>
          <CardMedia
            component="img"
            height="250"
            image={metadata.url}
            alt={metadata.titre}
            sx={{ objectFit: 'cover' }}
          />
        </Card>
      )}

      <Typography variant="h5" gutterBottom color="text.primary" sx={{ fontWeight: 'bold' }}>
        Title: {metadata.titre}
      </Typography>

      <Box display="flex" alignItems="center" gap={1} mb={1}>
        <Inventory color="secondary" fontSize="small" />
        <Typography variant="body1" fontWeight="bold">Unit price:</Typography>
        <Typography color="secondary">{formatSol(metadata.prix)}</Typography>
      </Box>

      <Box display="flex" alignItems="center" gap={1} mb={1}>
        <Inventory fontSize="small" />
        <Typography variant="body1" color="text.secondary">
          Available quantity: {metadata.quantite}
        </Typography>
      </Box>

      <Divider sx={{ my: 1 }} />

      <TextField
        label="Desired quantity"
        type="number"
        fullWidth
        variant="outlined"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        InputProps={{ inputProps: { min: 1, max: metadata.quantite } }}
        sx={{ mb: 2 }}
      />

      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <ShoppingCart color="primary" fontSize="small" />
        <Typography variant="body1" fontWeight="bold">Total amount:</Typography>
        <Typography color="primary">{formatSol(totalAmount)}</Typography>
      </Box>

      <Button
        variant="contained"
        color="primary"
        fullWidth
        disabled={!canBuy}
        onClick={handleBuy}
        startIcon={buyArticle.isPending ? <HourglassEmpty /> : <ShoppingCart />}
      >
        {buyArticle.isPending ? 'Purchase in progress...' : 'Confirm purchase'}
      </Button>
    </Container>
  )
}
