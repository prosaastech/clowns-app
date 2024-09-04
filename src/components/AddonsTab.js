import React, { useState } from 'react';
import { Box, TextField, MenuItem, Button, Grid, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"
const AddonTab = ({ addons, formData, setFormData }) => {
  const [selectedAddon, setSelectedAddon] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');
  const [editIndex, setEditIndex] = useState(null);

  const handleAddonChange = (event) => {
    const addonId = event.target.value;
    setSelectedAddon(addonId);

    const Addon = addons.find(char => char.addonId === addonId);
    setSelectedPrice(Addon?.price || '');
  };

  const handleAddAddon = () => {
    if (!selectedAddon) {
      Toastify({
        text: "Please select addon.",
        className: "error",
        style: {
          background: "linear-gradient(to right, #ff5f6d, #ffc371)",
        }
      }).showToast();
       return;
    }
    const newAddon = {
      addonId: selectedAddon,
      price: selectedPrice,
    };

    setFormData(prev => ({
      ...prev,
      addons: editIndex === null
        ? [...(prev.addons || []), newAddon]
        : prev.addons.map((char, index) =>
            index === editIndex ? newAddon : char
          ),
    }));

    setSelectedAddon('');
    setSelectedPrice('');
    setEditIndex(null);
  };

  const handleEdit = (index) => {
    const Addon = formData.addons[index];
    setSelectedAddon(Addon.addonId);
    setSelectedPrice(Addon.price);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    setFormData(prev => ({
      ...prev,
      addons: prev.addons.filter((_, i) => i !== index),
    }));
  };

  return (
    <Box>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={3}>
          <TextField
            label="Addon"
            select
            value={selectedAddon}
            onChange={handleAddonChange}
            fullWidth
          >
            {addons.map((char) => (
              <MenuItem
                key={char.addonId}
                value={char.addonId}
                disabled={formData.addons.some(c => c.addonId === char.addonId && c.addonId !== selectedAddon)}
              >
                {char.addonName}
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
          <Button onClick={handleAddAddon} variant="contained">
            {editIndex === null ? 'Add Addon' : 'Update Addon'}
          </Button>
        </Grid>
      </Grid>

      {/* Render the grid of added addons here */}
      <Box mt={1} px={0}> {/* Add padding on the x-axis to provide space from edges */}
        {formData.addons && formData.addons.length > 0 && (
          <Box
            display="flex"
            flexDirection="column"
            gap={1}
          >
            {formData.addons.map((char, index) => {
              const Addon = addons.find(c => c.addonId === char.addonId);
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
                    {Addon?.addonName}
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

export default AddonTab;
