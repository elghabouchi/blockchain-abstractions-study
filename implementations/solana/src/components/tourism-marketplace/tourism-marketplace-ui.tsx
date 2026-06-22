'use client'

import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { Alert, Box, Button, Card, CardContent, TextField, Typography } from '@mui/material'
import toast from 'react-hot-toast'
import { PinataService, getMaxIdGlobal } from '../api/api-ui'
import { useTourismMarketplaceProgram } from './tourism-marketplace-data-access'
import { AlertMessage, ArticleMetadata } from '@/lib/marketplace/types'

export function TourismMarketplaceCreate() {
  const { createArticle, accounts, purchaseHistoryAccounts } = useTourismMarketplaceProgram()
  const { publicKey } = useWallet()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState(0)
  const [quantity, setQuantity] = useState(0)
  const [url, setImageUrl] = useState('')
  const [message, setMessage] = useState<AlertMessage | null>(null)

  const isFormValid = title.trim() !== '' && description.trim() !== '' && price > 0 && quantity > 0

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setPrice(0)
    setQuantity(0)
    setImageUrl('')
  }

  const handleSubmit = async () => {
    if (!isFormValid || !publicKey) return

    let cid: string | undefined

    try {
      const metadata: ArticleMetadata = {
        titre: title,
        description,
        url,
        quantite: quantity,
        prix: price,
        date: Date.now(),
        sold: 0,
      }

      const maxId = getMaxIdGlobal(accounts?.data, purchaseHistoryAccounts?.data)
      cid = await PinataService.uploadMetadata(metadata)
      await createArticle.mutateAsync({ articleId: (maxId + 1).toString(), cid })

      resetForm()
      setMessage({ type: 'success', text: 'Article created successfully.' })
    } catch (error) {
      if (cid) PinataService.deleteFile(cid).catch(() => undefined)
      const text = error instanceof Error ? error.message : 'An error occurred while creating the article.'
      setMessage({ type: 'error', text })
      toast.error(text)
    }
  }

  if (!publicKey) {
    return <Typography variant="h6" align="center">Please connect your wallet.</Typography>
  }

  return (
    <Box maxWidth="lg" mx="auto" mt={4}>
      <Card
        variant="outlined"
        sx={{
          backgroundColor: '#e3f2fd',
          borderRadius: 2,
          p: 3,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <CardContent>
          <Box display="flex" flexWrap="wrap" gap={2}>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              fullWidth
              sx={{ flex: '1 1 30%', '& .MuiOutlinedInput-root': { backgroundColor: '#ffffff' } }}
            />

            <TextField
              label="Price (SOL)"
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              required
              inputProps={{ min: 0.000001, step: 0.000001 }}
              sx={{ flex: '1 1 20%', '& .MuiOutlinedInput-root': { backgroundColor: '#ffffff' } }}
            />

            <TextField
              label="Quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
              inputProps={{ min: 1 }}
              sx={{ flex: '1 1 20%', '& .MuiOutlinedInput-root': { backgroundColor: '#ffffff' } }}
            />
          </Box>

          <Box mt={2}>
            <TextField
              fullWidth
              label="Description"
              variant="outlined"
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#ffffff' } }}
            />
          </Box>

          <Box mt={2}>
            <TextField
              fullWidth
              label="Image URL (optional)"
              variant="outlined"
              value={url}
              onChange={(e) => setImageUrl(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#ffffff' } }}
            />
          </Box>

          {url && (
            <Box mt={2}>
              <Typography variant="caption" color="text.secondary">Preview:</Typography>
              <Box
                component="img"
                src={url}
                alt="Preview"
                sx={{ height: 100, objectFit: 'contain', borderRadius: 1, border: '1px solid #ccc', mt: 1 }}
                onError={(e) => {
                  const image = e.target as HTMLImageElement
                  image.style.display = 'none'
                }}
              />
            </Box>
          )}

          <Box mt={3}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={!isFormValid || createArticle.isPending}
              sx={{ padding: '12px 0', fontWeight: 600 }}
            >
              {createArticle.isPending ? 'Publishing...' : 'Publish offer'}
            </Button>
          </Box>

          {message && (
            <Box mt={2}>
              <Alert severity={message.type}>{message.text}</Alert>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}
