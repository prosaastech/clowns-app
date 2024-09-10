import React from 'react';
import { Box, Grid, Typography } from '@mui/material';

const ContractStatus = () => {
  return (
   <>
   <Grid container alignItems="center" style={{ backgroundColor: '#d3e6c7', padding: '10px' }}>
      <Grid item>
        <Box 
          sx={{ 
            width: 20, 
            height: 20, 
            backgroundColor: 'green', 
            border: '1px solid black', 
            marginRight: '5px' 
          }} 
        />
      </Grid>
      <Grid item>
        <Typography style={{ marginRight: '15px' }}>Booked, Approved, Confirmed</Typography>
      </Grid>

      <Grid item>
        <Box 
          sx={{ 
            width: 20, 
            height: 20, 
            backgroundColor: 'lightblue', 
            border: '1px solid black', 
            marginRight: '5px' 
          }} 
        />
      </Grid>
      <Grid item>
        <Typography style={{ marginRight: '15px' }}>Booked, Approved</Typography>
      </Grid>

      <Grid item>
        <Box 
          sx={{ 
            width: 20, 
            height: 20, 
            backgroundColor: 'white', 
            border: '1px solid black', 
            marginRight: '5px' 
          }} 
        />
      </Grid>
      <Grid item>
        <Typography style={{ marginRight: '15px' }}>Booked</Typography>
      </Grid>

      <Grid item>
        <Box 
          sx={{ 
            width: 20, 
            height: 20, 
            backgroundColor: 'yellow', 
            border: '1px solid black', 
            marginRight: '5px' 
          }} 
        />
      </Grid>
      <Grid item>
        <Typography style={{ marginRight: '15px' }}>Quoted</Typography>
      </Grid>

      <Grid item>
        <Box 
          sx={{ 
            width: 20, 
            height: 20, 
            backgroundColor: 'red', 
            border: '1px solid black', 
            marginRight: '5px' 
          }} 
        />
      </Grid>
      <Grid item>
        <Typography>Cancelled</Typography>
      </Grid>
    </Grid>
   </>
  );
};

export default ContractStatus;
