import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';  // Ensure Navbar.js exists here
import Login from './components/Login';    // Ensure Login.js exists here
import Dashboard from './components/Dashboard'; // Ensure Dashboard.js exists here
import Contract from './components/Contract';
import ProtectedRoute from './components/Utils/ProtectedRoute'; // Import the ProtectedRoute component
import Test from './components/Test';
import Customer from './components/Customer';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} /> {/* Login route */}
                
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Navbar /> {/* Navbar will be displayed on the Dashboard */}
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                
                <Route
                    path="/Contract"
                    element={
                        <ProtectedRoute>
                            <Navbar /> {/* Navbar will be displayed on the Contract page */}
                            <Contract />
                         </ProtectedRoute>
                    }
                />
                <Route
                    path="/Customer"
                    element={
                        <ProtectedRoute>
                            <Navbar /> {/* Navbar will be displayed on the Contract page */}
                            <Customer />
                         </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;
