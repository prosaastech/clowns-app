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

const PaymentInfo = ({ formData, handleChange, cardOptions, paymentOptions, setFormData }) => {
  const [useAddress, setUseAddress] = useState(false);
  const [billingAddress, setBillingAddress] = useState(formData.address);

  useEffect(() => {
    // Update billingAddress if useAddress is checked and formData.address changes
    if (useAddress) {
      setBillingAddress(formData.address);
    }
  }, [formData.address, useAddress]);

  const handleCheckboxChange = (event) => {
    setUseAddress(event.target.checked);

    const { name, checked } = event.target;
    setFormData((prev) => {
      const updatedFormData = { ...prev, [name]: checked };
      return updatedFormData;
    });

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
            {/* Credit card number with numeric mask */}
            <InputMask
              mask="9999 9999 9999 9999" // 16-digit card number format
              value={formData.cardNumber1}
              onChange={handleChange}
              alwaysShowMask={true}
            >
              {() => (
                <TextField
                  label="Card Number"
                  name="cardNumber1"
                  fullWidth
                  margin="normal"
                />
              )}
            </InputMask>

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

            {/* CVV with 3-digit numeric mask */}
            <InputMask
              mask="999" // CVV format (3 digits)
              value={formData.cvv1}
              onChange={handleChange}
            >
              {() => (
                <TextField
                  label="CVV"
                  name="cvv1"
                  fullWidth
                  margin="normal"
                />
              )}
            </InputMask>
          </div>
        </CardContent>
      </Card>

      <Card className="payment-card" variant="outlined">
        <CardHeader title="Secondary Card" className="payment-card-header" />
        <CardContent>
          <div className="payment-fields">
            {/* Credit card number with numeric mask */}
            <InputMask
              mask="9999 9999 9999 9999" // 16-digit card number format
              value={formData.cardNumber2}
              onChange={handleChange}
              alwaysShowMask={true}
            >
              {() => (
                <TextField
                  label="Card Number"
                  name="cardNumber2"
                  fullWidth
                  margin="normal"
                />
              )}
            </InputMask>

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

            {/* CVV with 3-digit numeric mask */}
            <InputMask
              mask="999" // CVV format (3 digits)
              value={formData.cvv2}
              onChange={handleChange}
            >
              {() => (
                <TextField
                  label="CVV"
                  name="cvv2"
                  fullWidth
                  margin="normal"
                />
              )}
            </InputMask>
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
          {paymentOptions.map((option) => (
            <MenuItem key={option.value} value={option.paymentStatusId}>
              {option.paymentStatusName}
            </MenuItem>
          ))}
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

        <TextField
          label="Billing Address"
          name="billingAddress"
          value={billingAddress}
          onChange={handleBillingAddressChange}
          fullWidth
          margin="normal"
        />
      </div>
    </div>
  );
};

export default PaymentInfo;
