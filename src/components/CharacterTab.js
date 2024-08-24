import React from 'react';
import { TextField, MenuItem, Button } from '@mui/material';

const CharacterTab = ({ characters, formData, setFormData }) => {
  const handleAddCharacter = () => {
    // Logic to add character to the grid
  };

  return (
    <div>
      <TextField
        label="Characters"
        name="characters"
        select
        multiple
        value={formData?.characters || []}
        onChange={(e) => setFormData(prev => ({
          ...prev,
          characters: e.target.value
        }))}
        fullWidth
      >
        {characters.map((char) => (
          <MenuItem key={char.characterId} value={char.characterId}>
            {char.characterName}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        label="Price"
        name="characterPrice"
        value={formData?.characterPrice || ''}
        onChange={(e) => setFormData(prev => ({
          ...prev,
          characterPrice: e.target.value
        }))}
        fullWidth
      />
      <Button onClick={handleAddCharacter}>Add Character</Button>
      {/* Render the grid of added characters here */}
    </div>
  );
};

export default CharacterTab;
