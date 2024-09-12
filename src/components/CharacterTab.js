import React, { useState } from 'react';
import { Box, TextField, MenuItem, Button, Grid, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"
const CharacterTab = ({ characters, formData, setFormData }) => {
  const [selectedCharacter, setSelectedCharacter] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');
  const [editIndex, setEditIndex] = useState(null);

  const handleCharacterChange = (event) => {
    const characterId = event.target.value;
    setSelectedCharacter(characterId);

    const character = characters.find(char => char.characterId === characterId);
    setSelectedPrice(character?.price || '');
  };

  const handleAddCharacter = () => {
    if (!selectedCharacter) {
      Toastify({
        text: "Please select character.",
        className: "error",
        style: {
          background: "linear-gradient(to right, #ff5f6d, #ffc371)",
        }
      }).showToast();
       return;
    }
    
    const newCharacter = {
      characterId: selectedCharacter,
      price: selectedPrice,
    };

    // setFormData(prev => ({
    //   ...prev,
    //   characters: editIndex === null
    //     ? [...(prev.characters || []), newCharacter]
    //     : prev.characters.map((char, index) =>
    //         index === editIndex ? newCharacter : char
    //       ),
    // }));
    setFormData(prev => ({
      ...prev,
      characters: editIndex === null
        ? [...(prev.characters || []), newCharacter] // Safely handle undefined characters array
        : prev.characters.map((char, index) =>
            index === editIndex ? newCharacter : char
          ),
    }));


    setSelectedCharacter('');
    setSelectedPrice('');
    setEditIndex(null);
  };

  const handleEdit = (index) => {
    const character = formData.characters[index];
    setSelectedCharacter(character.characterId);
    setSelectedPrice(character.price);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    setFormData(prev => ({
      ...prev,
      characters: prev.characters.filter((_, i) => i !== index),
    }));
  };

  return (
    <Box>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={3}>
          <TextField
            label="Character"
            select
            value={selectedCharacter}
            onChange={handleCharacterChange}
            fullWidth
          >
            {characters.map((char) => (
              <MenuItem
                key={char.characterId}
                value={char.characterId}
                disabled={formData.characters?.some(c => c.characterId === char.characterId && c.characterId !== selectedCharacter)}
              >
                {char.characterName}
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
          <Button onClick={handleAddCharacter} variant="contained">
            {editIndex === null ? 'Add Character' : 'Update Character'}
          </Button>
        </Grid>
      </Grid>

      {/* Render the grid of added characters here */}
      <Box mt={1} px={0}> {/* Add padding on the x-axis to provide space from edges */}
        {formData.characters && formData.characters.length > 0 && (
          <Box
            display="flex"
            flexDirection="column"
            gap={1}
          >
            {formData.characters.map((char, index) => {
              const character = characters.find(c => c.characterId === char.characterId);
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
                    {character?.characterName}
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

export default CharacterTab;
