'use client'

import { useSearchParams } from 'next/navigation'
import { useTourismMarketplaceProgramAccount } from '../tourism-marketplace/tourism-marketplace-data-access'
import { useEffect, useState } from 'react'
import { PublicKey } from '@solana/web3.js'
import { Box, Button, Card, CardMedia, CircularProgress, Container, TextField, Typography } from '@mui/material'
import toast from 'react-hot-toast'
import { PinataService } from '../api/api-ui'
import { useIpfsMetadata } from '../api/use-ipfs-metadata'
import { ArticleMetadata } from '@/lib/marketplace/types'

type EditableFields = {
  title: boolean
  description: boolean
  price: boolean
  quantity: boolean
  url: boolean
}

export default function UpdateArticlePage() {
  const searchParams = useSearchParams()
  const accountParam = searchParams.get('account')

  if (!accountParam) return <Typography>No article selected.</Typography>

  return <UpdateArticleForm account={new PublicKey(accountParam)} />
}

function UpdateArticleForm({ account }: { account: PublicKey }) {
  const { accountQuery, updateArticle } = useTourismMarketplaceProgramAccount({ account })
  const { data: metadata, isLoading: metadataLoading, refetch: refetchMetadata } = useIpfsMetadata<ArticleMetadata>(accountQuery.data?.cid)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState(0)
  const [quantity, setQuantity] = useState(0)
  const [url, setUrl] = useState('')
  const [edit, setEdit] = useState<EditableFields>({
    title: false,
    description: false,
    price: false,
    quantity: false,
    url: false,
  })

  useEffect(() => {
    if (!metadata) return

    setTitle(metadata.titre)
    setDescription(metadata.description)
    setPrice(metadata.prix)
    setQuantity(metadata.quantite)
    setUrl(metadata.url ?? '')
  }, [metadata])

  if (accountQuery.isLoading || metadataLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!accountQuery.data || !metadata) {
    return <Typography>No article found.</Typography>
  }

  const hasChanges =
    title !== metadata.titre ||
    description !== metadata.description ||
    price !== metadata.prix ||
    quantity !== metadata.quantite ||
    url !== (metadata.url ?? '')

  const handleUpdate = async () => {
    const oldCid = accountQuery.data.cid
    let newCid: string | undefined

    try {
      const updatedMetadata: ArticleMetadata = {
        titre: title,
        description,
        url,
        quantite: quantity,
        prix: price,
        date: Date.now(),
        sold: metadata.sold,
      }

      newCid = await PinataService.uploadMetadata(updatedMetadata)
      await updateArticle.mutateAsync({
        articleId: accountQuery.data.articleId,
        cid: newCid,
      })

      await accountQuery.refetch()
      await refetchMetadata()
      PinataService.deleteFile(oldCid).catch(() => undefined)
      toast.success('Update completed successfully.')
    } catch (error) {
      if (newCid) PinataService.deleteFile(newCid).catch(() => undefined)
      toast.error(error instanceof Error ? error.message : 'An error occurred while updating the article.')
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
        Update article
      </Typography>

      <TextField
        label="Title"
        fullWidth
        variant="outlined"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        InputProps={{ readOnly: !edit.title }}
        onClick={() => setEdit((prev) => ({ ...prev, title: true }))}
        sx={{ mb: 2 }}
      />

      <TextField
        label="Description"
        fullWidth
        multiline
        rows={3}
        variant="outlined"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        InputProps={{ readOnly: !edit.description }}
        onClick={() => setEdit((prev) => ({ ...prev, description: true }))}
        sx={{ mb: 2 }}
      />

      <TextField
        label="Price (SOL)"
        fullWidth
        type="number"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        InputProps={{
          readOnly: !edit.price,
          inputProps: { min: 0, step: 0.000001 },
        }}
        onClick={() => setEdit((prev) => ({ ...prev, price: true }))}
        sx={{ mb: 2 }}
      />

      <TextField
        label="Quantity"
        fullWidth
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        InputProps={{
          readOnly: !edit.quantity,
          inputProps: { min: 0, step: 1 },
        }}
        onClick={() => setEdit((prev) => ({ ...prev, quantity: true }))}
        sx={{ mb: 2 }}
      />

      <TextField
        label="Image URL"
        fullWidth
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        InputProps={{ readOnly: !edit.url }}
        onClick={() => setEdit((prev) => ({ ...prev, url: true }))}
        sx={{ mb: 2 }}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleUpdate}
        fullWidth
        disabled={!hasChanges || updateArticle.isPending}
      >
        {updateArticle.isPending ? 'Saving...' : 'Save changes'}
      </Button>
    </Container>
  )
}
