// src/components/PaymentInfo.js

import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import InputMask from 'react-input-mask'; // Import react-input-mask
import '../css/PaymentInfo.css'; // Import the CSS file

const PaymentInfo = ({ formData, handleChange, cardOptions }) => {
  const [useAddress, setUseAddress] = useState(false);
  const [billingAddress, setBillingAddress] = useState(formData.address);
console.log('cardoption' + cardOptions);
  useEffect(() => {
    // Update billingAddress if useAddress is checked and formData.address changes
    if (useAddress) {
      setBillingAddress(formData.address);
    }
  }, [formData.address, useAddress]);

  const handleCheckboxChange = (event) => {
    setUseAddress(event.target.checked);
    if (event.target.checked) {
      setBillingAddress(formData.address);
    } else {
      setBillingAddress('');
    }
  };

  const handleBillingAddressChange = (event) => {
    setBillingAddress(event.target.value);
    handleChange(event);
  };
  return (
    <div className="payment-info">
      <Card className="payment-card" variant="outlined">
        <CardHeader title="Primary Card" className="payment-card-header" />
        <CardContent>
          <div className="payment-fields">
            <TextField
              label="Card Number"
              name="cardNumber1"
              value={formData.cardNumber1}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              select
              label="Card Type"
              name="cardType1"
              value={formData.cardType1}
              onChange={handleChange}
              fullWidth
              margin="normal"
            >
              {cardOptions.map((option) => (
                <MenuItem key={option.value} value={option.cardOptionId}>
                  {option.cardOptionName}
                </MenuItem>
              ))}
            </TextField>
            <InputMask
              mask="99/99"
              value={formData.expirationDate1}
              onChange={handleChange}
            >
              {() => (
                <TextField
                  label="Expiration Date (MM/YY)"
                  name="expirationDate1"
                  fullWidth
                  margin="normal"
                />
              )}
            </InputMask>
            <TextField
              label="CVV"
              name="cvv1"
              value={formData.cvv1}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="payment-card" variant="outlined">
        <CardHeader title="Secondary Card" className="payment-card-header" />
        <CardContent>
          <div className="payment-fields">
            <TextField
              label="Card Number"
              name="cardNumber2"
              value={formData.cardNumber2}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              select
              label="Card Type"
              name="cardType2"
              value={formData.cardType2}
              onChange={handleChange}
              fullWidth
              margin="normal"
            >
              {cardOptions.map((option) => (
                <MenuItem key={option.value} value={option.cardOptionId}>
                  {option.cardOptionName}
                </MenuItem>
              ))}
            </TextField>
            <InputMask
              mask="99/99"
              value={formData.expirationDate2}
              onChange={handleChange}
            >
              {() => (
                <TextField
                  label="Expiration Date (MM/YY)"
                  name="expirationDate2"
                  fullWidth
                  margin="normal"
                />
              )}
            </InputMask>
            <TextField
              label="CVV"
              name="cvv2"
              value={formData.cvv2}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </div>
        </CardContent>
      </Card>

      <div className="payment-status-address">
        <TextField
          select
          label="Payment Status"
          name="paymentStatus"
          value={formData.paymentStatus}
          onChange={handleChange}
          margin="normal"
          sx={{ width: '300px' }} // Adjust the width as needed
        >
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
          <MenuItem value="Failed">Failed</MenuItem>
        </TextField>

        <div className="address-checkbox">
          <FormControlLabel
            control={
              <Checkbox
                checked={useAddress}
                onChange={handleCheckboxChange}
                name="useAddress"
              />
            }
            label="Use Address as Billing Address"
          />
        </div>

        {useAddress ? (
          <TextField
            label="Billing Address"
            name="billingAddress"
            value={billingAddress}
            onChange={handleBillingAddressChange}
            fullWidth
            margin="normal"
          />
        ) : (
          <TextField
            label="Billing Address"
            name="billingAddress"
            value={billingAddress}
            onChange={handleBillingAddressChange}
            fullWidth
            margin="normal"
          />
        )}
      </div>
    </div>
  );
};

export default PaymentInfo;
