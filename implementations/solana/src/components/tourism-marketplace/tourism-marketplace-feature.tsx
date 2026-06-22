'use client'

import { TourismMarketplaceCreate } from './tourism-marketplace-ui'

import { Container, Typography, Box, Paper } from '@mui/material'

export default function TourismMarketplaceFeature() {

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper
        elevation={4}
        sx={{
          p: 2,
          backgroundColor: '#e3f2fd',
          borderRadius: 3,
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            backgroundColor: '#d0e6fb',
            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
          },
        }}
      >
        <Box mb={3} textAlign="center">
          <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: '#0d47a1' }}>
            Add a tourism offer
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Fill out the form below to create a new article.
          </Typography>
        </Box>

        <TourismMarketplaceCreate />
      </Paper>
    </Container>
  )
}
