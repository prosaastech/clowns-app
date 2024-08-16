import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import Logo from '../Images/bg.jpg'; // Import your logo
import { getUserFromToken } from './Utils/authUtils'; // Import the utility function to get user info

const Navbar = () => {
  const user = getUserFromToken(); // Get the logged-in user's info
  const [anchorEl, setAnchorEl] = useState(null);

  console.log(user);
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Clear token from localStorage and redirect to login page
    localStorage.removeItem('token');
    setAnchorEl(null);
    window.location.href = '/';
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#2196F3' }}>
      <Toolbar>
        {/* Replace the three-line icon with a logo */}
        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
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
          {user ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button color="inherit" onClick={handleMenuClick}>
                {user} {/* Display the username */}
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </Box>
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
