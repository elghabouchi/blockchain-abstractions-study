'use client'

import { TourismMarketplaceList } from './article-ui'
import { Typography, Box } from '@mui/material'

export default function ArticleFeature() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: 0,
        px: 2,
      }}
    >
  <Box 
    textAlign="center" 
    mb={4} 
    sx={{ 
      width: '100%',
      pt: 1,
      position: 'relative',
      '&::after': {
        content: '""',
        display: 'block',
        width: '80px',
        height: '4px',
        background: '#1a237e',
        margin: '16px auto 0',
        borderRadius: '2px'
      }
    }}
  >
    <Typography 
      variant="h3" 
      fontWeight="bold" 
      gutterBottom 
      sx={{ 
        color: '#1a237e',
      }}
    >
      My Tourism Articles
    </Typography>
  </Box>

  <Box 
    width="100%" 
    maxWidth="1400px"
    mx="auto"
    sx={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <TourismMarketplaceList />
  </Box>
    </Box>
  )
}
