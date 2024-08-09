import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';  // Ensure Navbar.js exists here
import Login from './components/Login';    // Ensure Login.js exists here
import Dashboard from './components/Dashboard'; // Ensure Dashboard.js exists here

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} /> {/* Login route */}
                <Route
                    path="/dashboard"
                    element={
                        <>
                            <Navbar /> {/* Navbar will be displayed on the Dashboard */}
                            <Dashboard />
                        </>
                    }
                />
                {/* Add other routes here */}
            </Routes>
        </Router>
    );
};

export default App;
