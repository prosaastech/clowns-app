import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu'; // Optional: Add a menu icon for mobile views

const Navbar = () => {
    return (
        <AppBar position="static" sx={{ backgroundColor: '#2196F3' }}>
            <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Clowns
                </Typography>
                <Box sx={{ display: 'flex' }}>
                    <Button color="inherit" component={Link} to="/" sx={{ mr: 2 }}>
                        Home
                    </Button>
                    <Button color="inherit" component={Link} to="/users" sx={{ mr: 2 }}>
                        Users
                    </Button>
                    <Button color="inherit" component={Link} to="/login">
                        Login
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
