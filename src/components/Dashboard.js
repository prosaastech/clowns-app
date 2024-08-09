import React from 'react';
import { Box, Typography } from '@mui/material';

export default function Dashboard() {
  return (
    <Box
      sx={{
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography variant="h4">Dashboard</Typography>
      {/* Add more content here */}
    </Box>
  );
}
