import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PersonIcon from '@mui/icons-material/Person';
import '../Login.css'; // Import the CSS file
import config from '../Utils/config'
import Loader from '../Utils/loader'
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import showToast from '../Utils/showToast'


export default function ClientVerification() {
  const location = useLocation();

  const [loginCode, setLoginCode] = useState('');
  const { newCustomerId, newContractId } = location.state || {}; // Destructure the values from location state

  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate
  const [isLoading, setIsLoading] = useState(false); // Control loader visibility
  const { customerId: paramCustomerId, contractId: paramContractId } = useParams();

  console.log('URL Params:', { paramCustomerId, paramContractId });
  console.log('Props:', { newCustomerId, newContractId });

  // Initialize state from URL params or props
  const [customerId, setCustomerId] = useState(paramCustomerId || newCustomerId || '');
  const [contractId, setContractId] = useState(paramContractId || newContractId || '');
  useEffect(() => {
    const updateCustomerAndContract = () => {
      // Log state values before setting them
      console.log('Before Update - CustomerId:', customerId, 'ContractId:', contractId);

      let updatedCustomerId = customerId;
      let updatedContractId = contractId;

      // Update state if newCustomerId or newContractId are available and different from current state
      if (newCustomerId && newCustomerId !== customerId) {
        updatedCustomerId = newCustomerId;
        setCustomerId(newCustomerId);
      }
      if (newContractId && newContractId !== contractId) {
        updatedContractId = newContractId;
        setContractId(newContractId);
      }

      // Log updated state values
      console.log('Updated - CustomerId:', updatedCustomerId, 'ContractId:', updatedContractId);
      if (updatedCustomerId && updatedContractId) {
        sendRequestToServer();
      }
    };

    updateCustomerAndContract();
  }, [newCustomerId, newContractId]);

  const validateToken = async (customerId, token) => {
    try {
      const token1 = localStorage.getItem('token');

      setIsLoading(true); // Show loader before login starts

      const response = await fetch(config.apiBaseUrl + `UtilFunc/ValidateToken?CustomerId=` + customerId + '&token=' + token, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
    //      'Authorization': `Bearer ${token1}`, // Include the token in the header
        },
        body: JSON.stringify({ customerId, token }),
      });
      //const data = await response.json();
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token); // Store the token
        console.log('Login successful:', data);
         navigate(`/ClientView/${customerId}/contract/${contractId}`);

      } else {
        showToast({
          type: 'error',
          message: 'Invalid or expired token',
        });
      } 
    }
    catch (error) {

    }
    finally {
      setIsLoading(false); // Hide loader after login completes  console.log(result);

    }
  };

  const sendRequestToServer = async () => {
    try {
      const token = localStorage.getItem('token');

      const payload = { customerId, contractId };
      console.log('Sending Payload:', token);  // Log the payload

      const response = await fetch(config.apiBaseUrl + 'UtilFunc/SendToken?CustomerId=' + customerId + '&ContractId=' + contractId, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
          //'Authorization': `Bearer ${token}`, // Include the token in the header

        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Email sent successfully:', data);
      } else {
        console.error('Failed to send email:', response.statusText);
      }
    } catch (error) {
      console.error('Error sending request:', error);
    }
  };

  const handleValidateToken = async (event) => {
    event.preventDefault();

    validateToken(customerId, loginCode);


  };

  const handleFocus = (e) => {
    e.target.value = '';
  };


  return (
    <div className='login-container'>
      <Loader isLoading={isLoading} />
      <Box
        component="form"
        onSubmit={handleValidateToken}
        sx={{
          '& > :not(style)': { m: 1, width: '100%' },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          maxWidth: '400px',
          margin: 'auto',
          padding: '1rem',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}
        noValidate
        autoComplete="off"
      >

        <FormControl sx={{ m: 1, width: '100%' }} variant="outlined">
          <InputLabel
            htmlFor="password-field"
            sx={{
              fontSize: '14px', // Smaller font size for longer text
              whiteSpace: 'normal', // Allow text to wrap
              lineHeight: '1.2', // Adjust line height for readability
            }}
          >
            Please check your email and enter the token
          </InputLabel>          <OutlinedInput
            id="Token-field"
            type={'text'}
            value={loginCode}
            onChange={(e) => setLoginCode(e.target.value)}
            onFocus={handleFocus} // Clear value on focus
            startAdornment={
              <InputAdornment position="center"
                sx={{ display: 'flex', alignItems: 'left', width: '65px' }}>
                <IconButton
                  aria-label="toggle Token visibility"
                  edge="end"

                >
                </IconButton>
              </InputAdornment>
            }
            sx={{
              '& input': {
                paddingLeft: '10px', // Adjust padding for the text input inside the field
              },
            }}
            label="Login Code"
          />
        </FormControl>
        <Button type="submit" variant="contained" color="primary">
          Verify Token
        </Button>
        {error && <p className='error-message'>{error}</p>}
      </Box>
    </div>
  );
}
