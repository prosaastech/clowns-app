import React, { useState, useEffect } from 'react';
import { Box, TextField, MenuItem } from '@mui/material';

const PackageInfo = ({ formData, setFormData }) => {
  const [categories, setCategories] = useState([]);
  const [packages, setPackages] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [addons, setAddons] = useState([]);
  const [bounces, setBounces] = useState([]);

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
    const packagePrice = parseFloat(unformatNumber(formData.packageInfo_price || '')) || 0;
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

  return (
    <Box>
      <div className="row">
        <div className="col-md-3 col-sm-12">
          <TextField
            label="Category"
            name="category"
            select
            value={formData?.category || ''}
            onChange={handleCategoryChange}
            fullWidth
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.categoryId}>
                {category.categoryName}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <div className="col-md-3 col-sm-12">
          <TextField
            label="Party Package"
            name="package"
            select
            value={formData?.package || ''}
            onChange={handlePackageChange}
            fullWidth
          >
            {packages.map((pkg) => (
              <MenuItem key={pkg.packageId} value={pkg.packageId}>
                {pkg.packageName}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <div className="col-md-3 col-sm-12">
          <TextField
            label="Price"
            name="price"
            value={formatNumber(parseFloat(unformatNumber(formData?.price || ''))) || ''}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              price: e.target.value
            }))}
            fullWidth
          />
        </div>
        <div className="col-md-3 col-sm-12">
          <TextField
            label="Tax"
            name="tax"
            value={formatNumber(parseFloat(unformatNumber(formData?.tax || ''))) || ''}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              tax: e.target.value
            }))}
            fullWidth
          />
        </div>
        <div className="col-md-3 col-sm-12">
          <TextField
            label="Tip"
            name="tip"
            value={formatNumber(parseFloat(unformatNumber(formData?.tip || ''))) || ''}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              tip: e.target.value
            }))}
            fullWidth
          />
        </div>
        <div className="col-md-3 col-sm-12">
          <TextField
            label="Description"
            name="description"
            value={formData?.description || ''}
            InputProps={{
              readOnly: true,
            }}
            fullWidth
            multiline
            rows={4}
          />
        </div>
        {/* Add additional fields for Characters, Add-ons, Bounces, etc. */}
        <div className="col-md-3 col-sm-12">
          <TextField
            label="Characters"
            name="characters"
            select
            multiple
            value={formData?.characters || []}
            onChange={(e) => handleMultipleSelectChange('characters', e.target.value)}
            fullWidth
          >
            {characters.map((char) => (
              <MenuItem key={char.characterId} value={char.characterId}>
                {char.characterName}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <div className="col-md-3 col-sm-12">
          <TextField
            label="Add-ons"
            name="addons"
            select
            multiple
            value={formData?.addons || []}
            onChange={(e) => handleMultipleSelectChange('addons', e.target.value)}
            fullWidth
          >
            {addons.map((addon) => (
              <MenuItem key={addon.addonId} value={addon.addonId}>
                {addon.addonName}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <div className="col-md-3 col-sm-12">
          <TextField
            label="Bounces"
            name="bounces"
            select
            multiple
            value={formData?.bounces || []}
            onChange={(e) => handleMultipleSelectChange('bounces', e.target.value)}
            fullWidth
          >
            {bounces.map((bounce) => (
              <MenuItem key={bounce.bounceId} value={bounce.bounceId}>
                {bounce.bounceName}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <div className="col-md-3 col-sm-12">
          <TextField
            label="Parking Fees"
            name="parkingFees"
            value={formatNumber(parseFloat(unformatNumber(formData?.parkingFees || ''))) || ''}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              parkingFees: e.target.value
            }))}
            fullWidth
          />
        </div>
        <div className="col-md-3 col-sm-12">
          <TextField
            label="Toll Fees"
            name="tollFees"
            value={formatNumber(parseFloat(unformatNumber(formData?.tollFees || ''))) || ''}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              tollFees: e.target.value
            }))}
            fullWidth
          />
        </div>
        <div className="col-md-3 col-sm-12">
          <TextField
            label="Deposit"
            name="deposit"
            value={formatNumber(parseFloat(unformatNumber(formData?.deposit || ''))) || ''}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              deposit: e.target.value
            }))}
            fullWidth
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <TextField
            label="Total Balance"
            name="totalBalance"
            value={formatNumber(calculateTotalBalance())}
            InputProps={{
              readOnly: true,
            }}
            fullWidth
          />
        </div>
      </div>
    </Box>
  );
};

export default PackageInfo;
