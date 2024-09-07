import React, { useState,useEffect } from 'react';
import { TextField, Button, Grid, Checkbox, FormControlLabel, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import config from './Utils/config'

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
  const [venue,setVenues] = useState([]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      console.log("json:" + JSON.stringify(searchData));
      const response = await fetch(`${config.apiBaseUrl}SearchContract/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(searchData),
      });

      if (!response.ok) {
        throw new Error('Error fetching search results');
      }

      const data = await response.json();
      console.log("search result:", data, null,2);
      setResults(data); // Set the fetched data to state
    } catch (error) {
      console.error('Error:', error);
    }
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

          {/* Advanced Search Fields */}
          {searchData.advancedSearch && (
            <>
              <Grid item xs={12} md={3}>
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
              <Grid item xs={12} md={3}>
                <TextField
                  label="City"
                  variant="outlined"
                  fullWidth
                  name="city"
                  value={searchData.city}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  label="Primary Honoree"
                  variant="outlined"
                  fullWidth
                  name="primaryHonoree"
                  value={searchData.primaryHonoree}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={3}>
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
              <Grid item xs={12} md={3}>
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
              <Grid item xs={12} md={3}>
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
              <Grid item xs={12} md={3}>
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
              <Grid item xs={12} md={3}>
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
              <Grid item xs={12} md={3}>
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
              <Grid item xs={12} md={3}>
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
              <Grid item xs={12} md={3}>
                <TextField
                  label="Approval"
                  variant="outlined"
                  fullWidth
                  name="approval"
                  value={searchData.approval}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={3}>
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
              {results.map((row) => (
                <TableRow key={row.userId}>
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
