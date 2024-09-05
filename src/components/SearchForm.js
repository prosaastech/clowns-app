import React, { useState } from 'react';
import { TextField, Button, Grid, Checkbox, FormControlLabel, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

// Example data (can be replaced with actual search results from API)
const exampleData = [
  {
    firstName: 'Marisa',
    lastName: 'Kodos',
    userId: '1',
    contractNumber: '04112023N186766',
    contractDate: '04/11/2023',
    eventDate: '06/24/2023',
    email: 'marisa.kodes@gmail.com',
    state: 'NY',
    city: 'Scarsdale',
    partyPackage: 'Character Platinum Entertainment Package',
    approval: 'No',
    confirmation: 'Yes',
    primaryHonoree: 'Marisa',
    characters: 'Clown, Superhero',
    bounces: 'Bounce House',
    addOns: 'Extra Time',
  },
  {
    firstName: 'Winnie',
    lastName: 'Chan',
    userId: '2',
    contractNumber: '04112023N186765',
    contractDate: '04/11/2023',
    eventDate: '04/29/2023',
    email: 'wdwedding2016@gmail.com',
    state: 'NY',
    city: 'Manhattan',
    partyPackage: 'Princess Silver Entertainment Package',
    approval: 'No',
    confirmation: 'No',
    primaryHonoree: 'Winnie',
    characters: 'Princess',
    bounces: 'None',
    addOns: 'None',
  },
  // Add more rows as needed
];

const SearchForm = () => {
  const [searchData, setSearchData] = useState({
    firstName: '',
    lastName: '',
    contractNumber: '',
    customerEmail: '',
    customerPhone: '',
    eventDate: '',
    advancedSearch: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchData({ ...searchData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    setSearchData({ ...searchData, advancedSearch: e.target.checked });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle search submission (possibly with an API call to filter results)
    console.log('Search data:', searchData);
  };

  const handleReset = () => {
    setSearchData({
      firstName: '',
      lastName: '',
      contractNumber: '',
      customerEmail: '',
      customerPhone: '',
      eventDate: '',
      advancedSearch: false,
    });
  };

  return (
    <Box sx={{ p: 4 }}>
        <h1>
            Search Form
        </h1>
        <br></br>
      {/* Search Form */}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField
              label="First Name"
              variant="outlined"
              fullWidth
              name="firstName"
              value={searchData.firstName}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="Last Name"
              variant="outlined"
              fullWidth
              name="lastName"
              value={searchData.lastName}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="Contract Number"
              variant="outlined"
              fullWidth
              name="contractNumber"
              value={searchData.contractNumber}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="Customer Email"
              variant="outlined"
              fullWidth
              name="customerEmail"
              value={searchData.customerEmail}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="Customer Phone"
              variant="outlined"
              fullWidth
              name="customerPhone"
              value={searchData.customerPhone}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="Event Date"
              variant="outlined"
              fullWidth
              type="date"
              name="eventDate"
              value={searchData.eventDate}
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={searchData.advancedSearch}
                  onChange={handleCheckboxChange}
                />
              }
              label="Advanced Search"
            />
          </Grid>
        </Grid>
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" color="primary" type="submit" sx={{ mr: 2 }}>
            Search
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleReset}>
            Reset
          </Button>
        </Box>
      </form>

      {/* Results Table */}
      <Box sx={{ mt: 4 }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>User ID</TableCell>
                <TableCell>Contract Number</TableCell>
                <TableCell>Contract Date</TableCell>
                <TableCell>Event Date</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>State</TableCell>
                <TableCell>City</TableCell>
                <TableCell>Party Package</TableCell>
                <TableCell>Approval</TableCell>
                <TableCell>Confirmation</TableCell>
                <TableCell>Primary Honoree</TableCell>
                <TableCell>Characters</TableCell>
                <TableCell>Bounces</TableCell>
                <TableCell>Add-ons</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {exampleData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.firstName}</TableCell>
                  <TableCell>{row.lastName}</TableCell>
                  <TableCell>{row.userId}</TableCell>
                  <TableCell>{row.contractNumber}</TableCell>
                  <TableCell>{row.contractDate}</TableCell>
                  <TableCell>{row.eventDate}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.state}</TableCell>
                  <TableCell>{row.city}</TableCell>
                  <TableCell>{row.partyPackage}</TableCell>
                  <TableCell>{row.approval}</TableCell>
                  <TableCell>{row.confirmation}</TableCell>
                  <TableCell>{row.primaryHonoree}</TableCell>
                  <TableCell>{row.characters}</TableCell>
                  <TableCell>{row.bounces}</TableCell>
                  <TableCell>{row.addOns}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default SearchForm;
