import React from 'react';
import { TextField, MenuItem, Button } from '@mui/material';

const AddonsTab = ({ addons, formData, setFormData }) => {
  const handleAddAddon = () => {
    // Logic to add add-on to the grid
  };

  return (
    <div>
      <TextField
        label="Add-ons"
        name="addons"
        select
        multiple
        value={formData?.addons || []}
        onChange={(e) => setFormData(prev => ({
          ...prev,
          addons: e.target.value
        }))}
        fullWidth
      >
        {addons.map((addon) => (
          <MenuItem key={addon.addonId} value={addon.addonId}>
            {addon.addonName}
          </MenuItem>
        ))}
      </TextField>
      <Button onClick={handleAddAddon}>Add Add-on</Button>
      {/* Render the grid of added add-ons here */}
    </div>
  );
};

export default AddonsTab;
