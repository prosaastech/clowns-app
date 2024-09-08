import React, { useState, useEffect } from 'react';
import {
  Pagination,
  Stack, TextField, Button, Grid, Checkbox, FormControlLabel, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, MenuItem, Select, InputLabel, FormControl
} from '@mui/material';
import config from './Utils/config'
import '../css/SearchForm.css'

// Example data (can be replaced with actual search results from API)

const SearchForm = () => {
  const [searchData, setSearchData] = useState({
    firstName: '',
    lastName: '',
    contractNumber: '',
    customerEmail: '',
    customerPhone: '',
    eventDate: '',
    advancedSearch: false,
    state: 0,
    category: 0,
    partyPackage: 0,
    characters: 0,
    bounces: 0,
    addOns: 0,
    venue: 0,
    paymentStatus: 0
  });

  const [states, setStates] = useState([]);
  const [categories, setCategories] = useState([]);
  const [packages, setPackages] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [bounces, setBounces] = useState([]);
  const [addons, setAddons] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState([]);
  const [venue, setVenues] = useState([]);
  const [totalCount, setTotalCount] = useState(0); // To store total number of results
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
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

    fetchDropdownData(config.apiBaseUrl + 'States', setStates);
    fetchDropdownData(config.apiBaseUrl + 'Categories', setCategories);
    fetchDropdownData(config.apiBaseUrl + 'PartyPackages', setPackages);
    fetchDropdownData(config.apiBaseUrl + 'Characters', setCharacters);
    fetchDropdownData(config.apiBaseUrl + 'Addons', setAddons);
    fetchDropdownData(config.apiBaseUrl + 'Bounces', setBounces);
    fetchDropdownData(config.apiBaseUrl + 'PaymentStatus', setPaymentStatus);
    fetchDropdownData(config.apiBaseUrl + 'Venues', setVenues);

  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchData({ ...searchData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    setSearchData({ ...searchData, advancedSearch: e.target.checked });
  };

  const [results, setResults] = useState([]); // To store API results

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    console.log("Page:"+ page);
    fetchSearchResults(page); // Fetch results for the new page
  };
  const paginatedResults = results.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );  
  const fetchSearchResults = async (page = 1) => {
    const token = localStorage.getItem('token');
    const searchParams = {
      ...searchData,
      page,
      pageSize: rowsPerPage,
    };
    if (searchParams.eventDate === '') searchParams.eventDate = '1009-01-01';

    try {
        const response = await fetch(`${config.apiBaseUrl}SearchContract/search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(searchParams),
        });

        if (!response.ok) throw new Error('Error fetching search results');
        const data = await response.json();
        setResults(data.data);
        setTotalCount(data.totalCount);
    } catch (error) {
        console.error('Error:', error);
    }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    fetchSearchResults(); // Fetch results for the first page
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
    <Box sx={{ p: 4 }} className="search-container">
      <h1>
        Search Form
      </h1>
      <br></br>
      {/* Search Form */}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} className="form-grid">
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
          <Grid item xs={12} className="advanced-search">
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

          {/* Advanced Search Fields */}
          {searchData.advancedSearch && (
            <>
              <Grid item xs={12} md={3} className="advanced-search-section">
                <FormControl fullWidth variant="outlined">
                  <InputLabel>State</InputLabel>
                  <Select
                    value={searchData.state}
                    name="state"
                    onChange={handleInputChange}
                    label="State"
                  >
                    {states.map((state) => (
                      <MenuItem key={state.stateId} value={state.stateId}>
                        {state.stateName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3} className="advanced-search-section">
                <TextField
                  label="City"
                  variant="outlined"
                  fullWidth
                  name="city"
                  value={searchData.city}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={3} className="advanced-search-section">
                <TextField
                  label="Primary Honoree"
                  variant="outlined"
                  fullWidth
                  name="primaryHonoree"
                  value={searchData.primaryHonoree}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={3} className="advanced-search-section">
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={searchData.category}
                    name="category"
                    onChange={handleInputChange}
                    label="Category"
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.categoryId} value={category.categoryId}>
                        {category.categoryName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3} className="advanced-search-section">
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Party Package</InputLabel>
                  <Select
                    value={searchData.partyPackage}
                    name="partyPackage"
                    onChange={handleInputChange}
                    label="Party Package"
                  >
                    {packages.map((pkg) => (
                      <MenuItem key={pkg.partyPackageId} value={pkg.partyPackageId}>
                        {pkg.partyPackageName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3} className="advanced-search-section">
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Characters</InputLabel>
                  <Select
                    value={searchData.characters}
                    name="characters"
                    onChange={handleInputChange}
                    label="Characters"
                  >
                    {characters.map((character) => (
                      <MenuItem key={character.characterId} value={character.characterId}>
                        {character.characterName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3} className="advanced-search-section">
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Bounces</InputLabel>
                  <Select
                    value={searchData.bounces}
                    name="bounces"
                    onChange={handleInputChange}
                    label="Bounces"
                  >
                    {bounces.map((bounce) => (
                      <MenuItem key={bounce.bounceId} value={bounce.bounceId}>
                        {bounce.bounceName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3} className="advanced-search-section">
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Add-ons</InputLabel>
                  <Select
                    value={searchData.addOns}
                    name="addOns"
                    onChange={handleInputChange}
                    label="Add-ons"
                  >
                    {addons.map((addon) => (
                      <MenuItem key={addon.addonId} value={addon.addonId}>
                        {addon.addonName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3} className="advanced-search-section">
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Venus</InputLabel>
                  <Select
                    value={searchData.venue}
                    name="venue"
                    onChange={handleInputChange}
                    label="Venue"
                  >
                    {venue.map((venue, index) => (
                      <MenuItem key={venue.venueId} value={venue.venueId}>
                        {venue.venueName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3} className="advanced-search-section">
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Payment Status</InputLabel>
                  <Select
                    value={searchData.paymentStatus}
                    name="paymentStatus"
                    onChange={handleInputChange}
                    label="Payment Status"
                  >
                    {paymentStatus.map((status, index) => (
                      <MenuItem key={status.paymentStatusId} value={status.paymentStatusId}>
                        {status.paymentStatusName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3} className="advanced-search-section">
                <TextField
                  label="Approval"
                  variant="outlined"
                  fullWidth
                  name="approval"
                  value={searchData.approval}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={3} className="advanced-search-section">
                <TextField
                  label="Confirmation"
                  variant="outlined"
                  fullWidth
                  name="confirmation"
                  value={searchData.confirmation}
                  onChange={handleInputChange}
                />
              </Grid>
            </>
          )}
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

      {/* Displaying Results */}
      {results.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <h2>Search Results</h2>
          <TableContainer component={Paper}>
            <Table>
              <TableHead className="result-table">
                <TableRow>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
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
                {results.map((row) => (
                  <TableRow key={row.userId}>
                    <TableCell>{row.firstName}</TableCell>
                    <TableCell>{row.lastName}</TableCell>
                    <TableCell>{row.contractNumber}</TableCell>
                    <TableCell>{row.contractDate}</TableCell>
                    <TableCell>{row.eventDate}</TableCell>
                    <TableCell>{row.emailAddress}</TableCell>
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

          {/* Pagination */}

          <Stack spacing={2} style={{ marginTop: '20px' }}>
            <Pagination
              className="pagination"

              count={Math.ceil(totalCount / rowsPerPage)} // Total pages
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default SearchForm;
