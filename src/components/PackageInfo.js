import React, { useState, useEffect } from 'react';
import { Box, TextField, MenuItem, Button, Tabs, Tab, Grid } from '@mui/material';
import CharacterTab from './CharacterTab';
import AddonsTab from './AddonsTab';
import BouncesTab from './BouncesTab';
import ReviewTab from './ReviewTab';
import '../css/PackageInfo.css';
import config from './Utils/config'

const PackageInfo = ({ formData, setFormData }) => {
  const [categories, setCategories] = useState([]);
  const [packages, setPackages] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [addons, setAddons] = useState([]);
  const [bounces, setBounces] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    const totalBalance = calculateTotalBalance();
    setFormData(prev => ({
      ...prev,
      totalBalance,
    }));
  }, [formData.characters, formData.addons, formData.bounces, formData.price, formData.tax, formData.tip, formData.parkingFees, formData.tollFees, formData.deposit]);


  useEffect(() => {
    const fetchDropdownData = async (url, setter) => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        setter(data);
      } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
      }
    };

    fetchDropdownData(config.apiBaseUrl + 'Categories', setCategories);
    fetchDropdownData(config.apiBaseUrl + 'PartyPackages', setPackages);
    fetchDropdownData(config.apiBaseUrl + 'Characters', setCharacters);
    fetchDropdownData(config.apiBaseUrl + 'Addons', setAddons);
    fetchDropdownData(config.apiBaseUrl + 'Bounces', setBounces);
  }, []);

  const handleCategoryChange = (event) => {
    const { value } = event.target;
    setFormData((prev) => ({ ...prev, categoryId: value }));
  };

  const handlePackageChange = (event) => {
    const { value } = event.target;
    const selectedPackage = packages.find(pkg => pkg.packageId === value);

    setFormData((prev) => ({
      ...prev,
      partyPackageId: value,
      price: selectedPackage?.price || '',
      tax: selectedPackage?.tax || '',
      tip: selectedPackage?.tip || '',
      description: selectedPackage?.description || '',
    }));
  };

  const handleFieldChange = (field) => (event) => {
    const { value } = event.target;
    const formattedValue = formatNumber(value);

    setFormData((prev) => ({
      ...prev,
      [field]: formattedValue,
    }));
  };

  const handleFieldChangeString = (field) => (event) => {
    const { value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMultipleSelectChange = (type, value) => {
    setFormData(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const formatNumber = (value) => {
    // Remove non-numeric characters except for comma
    const numericValue = value.replace(/[^0-9]/g, '');

    // Format as currency
    return new Intl.NumberFormat().format(Number(numericValue));
  };

  const unformatNumber = (formattedValue) => {
    if (typeof formattedValue !== 'string') return '';
    return formattedValue.replace(/,/g, '');
  };

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
  
    const additionalFees = 
      Number(unformatNumber(formData.price) || 0) +
      Number(unformatNumber(formData.tax) || 0) +
      Number(unformatNumber(formData.tip) || 0) +
      Number(unformatNumber(formData.parkingFees) || 0) +
      Number(unformatNumber(formData.tip2) || 0) +
      Number(unformatNumber(formData.tollFees) || 0);
  
    const deductions = 
      Number(formData.deposit || 0) +
      Number(formData.subtract || 0);
  
    const totalBalance = characterTotal + addonTotal + bounceTotal + additionalFees - deductions;
    
    return totalBalance;
  };
  
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <>
    <Box>
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} md={4}>
          <TextField
            label="Category"
            select
            value={formData.categoryId || ''}
            onChange={handleCategoryChange}
            fullWidth
          >
            {categories.map((category) => (
              <MenuItem key={category.categoryId} value={category.categoryId}>
                {category.categoryName}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Party Package"
            select
            value={formData.partyPackageId || ''}
            onChange={handlePackageChange}
            fullWidth
          >
            {packages.map((pkg) => (
              <MenuItem key={pkg.partyPackageId} value={pkg.partyPackageId}>
                {pkg.partyPackageName}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <TextField
            label="Price"
            value={formData.price || ''}
            onChange={handleFieldChange('price')}
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
            label="Tax"
            value={formData.tax || ''}
            onChange={handleFieldChange('tax')}
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
            value={formData.tip || ''}
            onChange={handleFieldChange('tip')}
            fullWidth
            sx={{
              '& .MuiInputBase-input': {
                textAlign: 'right',
              },
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Description"
            value={formData.description || ''}
            onChange={handleFieldChangeString('description')}
            fullWidth
            multiline
            rows={4}
          />
        </Grid>
      </Grid>
<br>
</br>
      <Tabs
  value={tabIndex}
  onChange={handleTabChange}
  className="custom-tabs"
  TabIndicatorProps={{
    className: 'custom-tab-indicator',
  }}
>
  <Tab label="Character" className="custom-tab" />
  <Tab label="Add-ons" className="custom-tab" />
  <Tab label="Bounces" className="custom-tab" />
  <Tab label="Review" className="custom-tab" />
</Tabs>


      {tabIndex === 0 && (
        <CharacterTab
          characters={characters}
          formData={formData}
          setFormData={setFormData}
        />
      )}

      {tabIndex === 1 && (
        <AddonsTab
          addons={addons}
          formData={formData}
          setFormData={setFormData}
        />
      )}

      {tabIndex === 2 && (
        <BouncesTab
          bounces={bounces}
          formData={formData}
          setFormData={setFormData}
        />
      )}

      {tabIndex === 3 && (
        <ReviewTab
        formData={formData}
        characters={characters}
        addons={addons}
        bounces={bounces}
        calculateTotalBalance={calculateTotalBalance}
        setFormData={setFormData} // Pass setFormData here

      />
      )}

      {/* New Fields Below Tabs */}
     
    </Box>
    </>
  );
};

export default PackageInfo;
