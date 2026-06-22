'use client'

import { PublicKey } from '@solana/web3.js'
import Link from 'next/link'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Divider,
  Typography,
} from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange'
import EventIcon from '@mui/icons-material/Event'
import Inventory2Icon from '@mui/icons-material/Inventory2'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { ArticleMetadata } from '@/lib/marketplace/types'
import { formatDate, formatSol, shortAddress, truncateWords } from '@/lib/marketplace/format'

type ArticleCardProps = {
  account: PublicKey
  metadata: ArticleMetadata
  seller?: PublicKey
  isOwner?: boolean
  showSeller?: boolean
  descriptionPreview?: boolean
  deletePending?: boolean
  onDelete?: () => void
}

export function ArticleCard({
  account,
  metadata,
  seller,
  isOwner = false,
  showSeller = false,
  descriptionPreview = false,
  deletePending = false,
  onDelete,
}: ArticleCardProps) {
  const description = metadata.description
    ? descriptionPreview
      ? truncateWords(metadata.description)
      : metadata.description
    : 'No description'

  return (
    <Card
      elevation={4}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: 6,
        },
      }}
    >
      {metadata.url && (
        <CardMedia
          component="img"
          height="200"
          image={metadata.url}
          alt={metadata.titre || 'Article image'}
          sx={{ objectFit: 'cover' }}
        />
      )}

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {metadata.titre || 'Untitled'}
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={2}>
          <strong>Description:</strong> {description}
        </Typography>

        <Divider sx={{ my: 1 }} />

        <Box display="flex" flexDirection="column" gap={1}>
          <Box display="flex" alignItems="center">
            <CurrencyExchangeIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="body1" fontWeight="bold" color="primary">
              Price: {formatSol(metadata.prix)}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center">
            <Inventory2Icon sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              Stock: {metadata.quantite}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center">
            <ShoppingCartIcon sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              Sold quantity: <strong>{metadata.sold ?? 0}</strong>
            </Typography>
          </Box>

          <Box display="flex" alignItems="center">
            <EventIcon sx={{ mr: 1, color: 'text.disabled' }} />
            <Typography variant="caption" color="text.disabled">
              Published on: {formatDate(metadata.date)}
            </Typography>
          </Box>

          {showSeller && seller && (
            <Box display="flex" alignItems="center">
              <AccountCircleIcon sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                Seller: <strong>{shortAddress(seller)}</strong>
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', mt: 'auto', px: 2, pb: 2 }}>
        {isOwner ? (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              component={Link}
              href={`/edit-article?account=${account.toBase58()}`}
              variant="outlined"
              color="primary"
              size="small"
            >
              Edit
            </Button>

            {onDelete && (
              <Button
                variant="contained"
                color="error"
                size="small"
                disabled={deletePending}
                onClick={onDelete}
              >
                Delete
              </Button>
            )}
          </Box>
        ) : (
          <Button
            component={Link}
            href={`/purchase?account=${account.toBase58()}`}
            variant="contained"
            size="medium"
            sx={{ fontWeight: 'bold' }}
          >
            Buy now
          </Button>
        )}
      </CardActions>
    </Card>
  )
}
