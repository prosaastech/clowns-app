import React from 'react';
import '../css/ReviewTab.css'; // Ensure you have a CSS file for styling
import { Box, TextField, MenuItem, Button, Tabs, Tab, Grid } from '@mui/material';

const ReviewTab = ({ formData, characters = [], addons = [], bounces = [],setFormData  }) => {
  const calculateTotalBalance = () => {
    const characterTotal = (formData.characters || []).reduce((sum, item) => {
      const id = typeof item === 'object' ? item.characterId : item;
      const character = characters.find(c => c.characterId === id);
      return sum + (character ? character.price : 0);
    }, 0);

    const addonTotal = (formData.addons || []).reduce((sum, item) => {
      const id = typeof item === 'object' ? item.addonId : item;
      const addon = addons.find(a => a.addonId === id);
      return sum + (addon ? addon.price : 0);
    }, 0);

    const bounceTotal = (formData.bounces || []).reduce((sum, item) => {
      const id = typeof item === 'object' ? item.bounceId : item;
      const bounce = bounces.find(b => b.bounceId === id);
      return sum + (bounce ? bounce.price : 0);
    }, 0);

    return characterTotal + addonTotal + bounceTotal;
  };
  const formatNumber = (value) => {
    // Remove non-numeric characters except for comma
    const numericValue = value.replace(/[^0-9]/g, '');

    // Format as currency
    return new Intl.NumberFormat().format(Number(numericValue));
  };
const handleFieldChange = (field) => (event) => {
    const { value } = event.target;
    const formattedValue = formatNumber(value);

    setFormData((prev) => ({
      ...prev,
      [field]: formattedValue,
    }));
  };
  const renderItems = (items, array, type) => {
    return items.map(item => {
      const id = typeof item === 'object' ? item[`${type}Id`] : item;
      const foundItem = array.find(i => i[`${type}Id`] === id);
      return foundItem ? (
        <span key={id} className="review-item">
          <strong>{foundItem[`${type}Name`]}</strong>: ${foundItem.price}
        </span>
      ) : (
        <span key={id} className="review-item not-found">
          {type} with ID {id} not found
        </span>
      );
    });
  };

  return (
    <>
    <div className="review-tab">
      <h3>Review</h3>
      
      <div className="review-grid">
        <div className="review-section">
          <h4>Selected Characters:</h4>
          <div className="review-items">
            {renderItems(formData.characters || [], characters, 'character')}
          </div>
        </div>

        <div className="review-section">
          <h4>Selected Add-ons:</h4>
          <div className="review-items">
            {renderItems(formData.addons || [], addons, 'addon')}
          </div>
        </div>

        <div className="review-section">
          <h4>Selected Bounces:</h4>
          <div className="review-items">
            {renderItems(formData.bounces || [], bounces, 'bounce')}
          </div>
        </div>
      </div>

      <div className="total-balance">
        <h4>Total Balance:${calculateTotalBalance()}</h4>
         
      </div>
    </div>
    <Grid container spacing={2} mt={2}>
        <Grid item xs={12} md={4}>
          <TextField
            label="Parking Fees"
            value={formData.parkingFees || ''}
            onChange={handleFieldChange('parkingFees')}
            fullWidth
            sx={{
              '& .MuiInputBase-input': {
                textAlign: 'right',
              },
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Tip"
            value={formData.Tip2 || ''}
            onChange={handleFieldChange('Tip2')}
            fullWidth
            sx={{
              '& .MuiInputBase-input': {
                textAlign: 'right',
              },
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Toll Fees"
            value={formData.tollFees || ''}
            onChange={handleFieldChange('tollFees')}
            fullWidth
            sx={{
              '& .MuiInputBase-input': {
                textAlign: 'right',
              },
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Subtract"
            value={formData.subtract || ''}
            onChange={handleFieldChange('subtract')}
            fullWidth
            sx={{
              '& .MuiInputBase-input': {
                textAlign: 'right',
              },
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Deposit"
            value={formData.deposit || ''}
            onChange={handleFieldChange('deposit')}
            fullWidth
            sx={{
              '& .MuiInputBase-input': {
                textAlign: 'right',
              },
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Total Balance"
            value={calculateTotalBalance() || ''}
            onChange={handleFieldChange('totalBalance')}
            InputProps={{
              readOnly: true,
              style: { textAlign: 'right' },
            }}
            fullWidth
          />
        </Grid>
      </Grid>
</>
    
  );
};

export default ReviewTab; 
