'use client'
import { Container, Typography, Box } from '@mui/material';
import { TourismMarketplaceList } from './purchase-history-ui';

export default function PurchaseHistoryFeature() {
  return (
    <Container maxWidth="lg" sx={{
      minHeight: '100vh',
      py: 0,
    }}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mb: 4,
      }}>
        <Typography 
          variant="h3" 
          component="h1"
          sx={{
            color: 'primary.main',
            fontWeight: 'bold',
            mb: 2,
            textAlign: 'center',
          }}
        >
           Purchase History
        </Typography>
        
        <TourismMarketplaceList />
      </Box>
    </Container>
  );
}
