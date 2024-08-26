import React, { useState, useEffect } from 'react';
import { Box, TextField, MenuItem, Button, Tabs, Tab, Grid, Typography } from '@mui/material';
import CharacterTab from './CharacterTab';
import AddonsTab from './AddonsTab';
import BouncesTab from './BouncesTab';
import ReviewTab from './ReviewTab';

const PackageInfo = ({ formData, setFormData }) => {
  const [categories, setCategories] = useState([]);
  const [packages, setPackages] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [addons, setAddons] = useState([]);
  const [bounces, setBounces] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);

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

    fetchDropdownData('http://localhost:5213/api/Categories', setCategories);
    fetchDropdownData('http://localhost:5213/api/PartyPackages', setPackages);
    fetchDropdownData('http://localhost:5213/api/Characters', setCharacters);
    fetchDropdownData('http://localhost:5213/api/Addons', setAddons);
    fetchDropdownData('http://localhost:5213/api/Bounces', setBounces);
  }, []);

  const handleCategoryChange = (event) => {
    const { value } = event.target;
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handlePackageChange = (event) => {
    const { value } = event.target;
    const selectedPackage = packages.find(pkg => pkg.packageId === value);

    setFormData((prev) => ({
      ...prev,
      package: value,
      price: selectedPackage?.price || '',
      tax: selectedPackage?.tax || '',
      tip: selectedPackage?.tip || '',
      description: selectedPackage?.description || '',
    }));
  };

  const handleFieldChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleMultipleSelectChange = (type, value) => {
    setFormData(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const formatNumber = (value) => {
    if (typeof value !== 'number') return '';
    return new Intl.NumberFormat().format(value);
  };

  const unformatNumber = (formattedValue) => {
    if (typeof formattedValue !== 'string') return '';
    return formattedValue.replace(/,/g, '');
  };

  const calculateTotalBalance = () => {
    const packagePrice = parseFloat(unformatNumber(formData.price || '')) || 0;
    const charactersTax = formData.characters?.reduce((total, id) => {
      const char = characters.find(c => c.characterId === id);
      return total + (parseFloat(unformatNumber(char?.tax || '')) || 0);
    }, 0) || 0;

    const addonsTax = formData.addons?.reduce((total, id) => {
      const addon = addons.find(a => a.addonId === id);
      return total + (parseFloat(unformatNumber(addon?.tax || '')) || 0);
    }, 0) || 0;

    const bouncesTax = formData.bounces?.reduce((total, id) => {
      const bounce = bounces.find(b => b.bounceId === id);
      return total + (parseFloat(unformatNumber(bounce?.tax || '')) || 0);
    }, 0) || 0;

    const parkingFees = parseFloat(unformatNumber(formData.parkingFees || '')) || 0;
    const tollFees = parseFloat(unformatNumber(formData.tollFees || '')) || 0;
    const deposit = parseFloat(unformatNumber(formData.deposit || '')) || 0;

    return packagePrice + charactersTax + addonsTax + bouncesTax + parkingFees + tollFees - deposit;
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Box>
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} md={4}>
          <TextField
            label="Category"
            select
            value={formData.category || ''}
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
            value={formData.package || ''}
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
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Tax"
            value={formData.tax || ''}
            onChange={handleFieldChange('tax')}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Tip"
            value={formData.tip || ''}
            onChange={handleFieldChange('tip')}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Description"
            value={formData.description || ''}
            onChange={handleFieldChange('description')}
            fullWidth
            multiline
            rows={4}
          />
        </Grid>
      </Grid>

      <Tabs value={tabIndex} onChange={handleTabChange}>
        <Tab label="Character" />
        <Tab label="Add-ons" />
        <Tab label="Bounces" />
        <Tab label="Review" />
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
          calculateTotalBalance={calculateTotalBalance}
        />
      )}
    </Box>
  );
};

export default PackageInfo;
