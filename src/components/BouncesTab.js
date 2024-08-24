import React from 'react';
import { TextField, MenuItem, Button } from '@mui/material';

const BouncesTab = ({ bounces, formData, setFormData }) => {
  const handleAddBounce = () => {
    // Logic to add bounce to the grid
  };

  return (
    <div>
      <TextField
        label="Bounces"
        name="bounces"
        select
        multiple
        value={formData?.bounces || []}
        onChange={(e) => setFormData(prev => ({
          ...prev,
          bounces: e.target.value
        }))}
        fullWidth
      >
        {bounces.map((bounce) => (
          <MenuItem key={bounce.bounceId} value={bounce.bounceId}>
            {bounce.bounceName}
          </MenuItem>
        ))}
      </TextField>
      <Button onClick={handleAddBounce}>Add Bounce</Button>
      {/* Render the grid of added bounces here */}
    </div>
  );
};

export default BouncesTab;
