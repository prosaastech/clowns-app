// src/components/Navbar.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import Logo from '../Images/bg.jpg'; // Import your logo
import { getUserFromToken } from './Utils/authUtils'; // Import the named export
import config from './Utils/config'

const Navbar = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const user = getUserFromToken(); // Get the logged-in user's info

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(config.apiBaseUrl + 'Users/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the token in the header
        },
      });
  
      if (!response.ok) {
        throw new Error(`Logout failed with status ${response.status}`);
      }
  
      // Clear token from localStorage
      localStorage.removeItem('token');
      
      // Optionally, clear any other session-related data here
      
      // Redirect to the login page
      navigate('/'); // Use navigate from react-router-dom for SPA redirection
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  return (
    <AppBar position="static" sx={{ backgroundColor: '#2196F3' }}>
      <Toolbar>
        {/* Replace the three-line icon with a logo */}
        <img src={Logo} alt="Logo" style={{ width: '40px', marginRight: '10px' }} />
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Clowns
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button color="inherit" component={Link} to="/" sx={{ mr: 2 }}>
            Home
          </Button>
          <Button color="inherit" component={Link} to="/Contract" sx={{ mr: 2 }}>
            Contract
          </Button>
          <Button color="inherit" component={Link} to="/Test" sx={{ mr: 2 }}>
            Test
          </Button>
          {user ? (
            <>
              <Button color="inherit" onClick={handleMenuClick} sx={{ mr: 2 }}>
                {user}
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
