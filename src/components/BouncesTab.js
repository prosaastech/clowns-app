import React, { useState } from 'react';
import { Box, TextField, MenuItem, Button, Grid, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const BounceTab = ({ bounces, formData, setFormData }) => {
  const [selectedBounce, setSelectedBounce] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');
  const [editIndex, setEditIndex] = useState(null);

  const handleBounceChange = (event) => {
    const bounceId = event.target.value;
    setSelectedBounce(bounceId);

    const Bounce = bounces.find(char => char.bounceId === bounceId);
    setSelectedPrice(Bounce?.price || '');
  };

  const handleAddBounce = () => {
    const newBounce = {
      bounceId: selectedBounce,
      price: selectedPrice,
    };

    setFormData(prev => ({
      ...prev,
      bounces: editIndex === null
        ? [...(prev.bounces || []), newBounce]
        : prev.bounces.map((char, index) =>
            index === editIndex ? newBounce : char
          ),
    }));

    setSelectedBounce('');
    setSelectedPrice('');
    setEditIndex(null);
  };

  const handleEdit = (index) => {
    const Bounce = formData.bounces[index];
    setSelectedBounce(Bounce.bounceId);
    setSelectedPrice(Bounce.price);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    setFormData(prev => ({
      ...prev,
      bounces: prev.bounces.filter((_, i) => i !== index),
    }));
  };

  return (
    <Box>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={3}>
          <TextField
            label="Bounce"
            select
            value={selectedBounce}
            onChange={handleBounceChange}
            fullWidth
          >
            {bounces.map((char) => (
              <MenuItem
                key={char.bounceId}
                value={char.bounceId}
                disabled={formData.bounces.some(c => c.bounceId === char.bounceId && c.bounceId !== selectedBounce)}
              >
                {char.bounceName}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={3}>
          <TextField
            label="Price"
            value={selectedPrice}
            fullWidth
            disabled
          />
        </Grid>
        <Grid item xs={4}>
          <Button onClick={handleAddBounce} variant="contained">
            {editIndex === null ? 'Add Bounce' : 'Update Bounce'}
          </Button>
        </Grid>
      </Grid>

      {/* Render the grid of added bounces here */}
      <Box mt={1} px={0}> {/* Add padding on the x-axis to provide space from edges */}
        {formData.bounces && formData.bounces.length > 0 && (
          <Box
            display="flex"
            flexDirection="column"
            gap={1}
          >
            {formData.bounces.map((char, index) => {
              const Bounce = bounces.find(c => c.bounceId === char.bounceId);
              return (
                <Box
                  key={index}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  p={1}
                  borderRadius="4px"
                  border="1px solid #ddd"
                  backgroundColor="#f9f9f9"
                  maxWidth="700px" // Set a max width for the items
                  mx="left" // Center the items horizontally
                  sx={{
                    '@media (max-width:700px)': {
                      flexDirection: 'column',
                      textAlign: 'left',
                    },
                  }}
                >
                  <Typography variant="body2" sx={{ flex: 1.2 }}>
                    {Bounce?.bounceName}
                  </Typography>
                  <Typography variant="body2" sx={{ flex: 1, textAlign: 'left' }}>
                    {char.price}
                  </Typography>
                  <Box>
                    <IconButton onClick={() => handleEdit(index)} aria-label="edit">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(index)} aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default BounceTab;
