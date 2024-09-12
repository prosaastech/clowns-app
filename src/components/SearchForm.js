import React, { useState, useEffect } from 'react';
import {
  Pagination,
  Stack,Typography, TextField, Button, Grid, Checkbox, FormControlLabel, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, MenuItem, Select, InputLabel, FormControl
} from '@mui/material';
import config from './Utils/config'
import '../css/SearchForm.css'
import Loader from './Utils/loader'; // Import Loader component
import ContractStatus from './ContractStatus'
// Example data (can be replaced with actual search results from API)
import { useNavigate } from 'react-router-dom';

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
    city:'',
    primaryHonoree:'',
    category: 0,
    partyPackage: 0,
    characters: 0,
    bounces: 0,
    addOns: 0,
    venue: 0,
    paymentStatus: 0,
    approval: false, // Added for checkbox
    confirmation: false, // Added for checkbox
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
  const [isLoading, setIsLoading] = useState(false); // Control loader visibility
  const navigate = useNavigate(); // Call useNavigate at the top level


  const rowsPerPage = 5;
  useEffect(() => {
    const fetchDropdownData = async (url, setter) => {
      const token = localStorage.getItem('token');
      setIsLoading(true);
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
      finally{
        setIsLoading(false);
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
    const { name, value, type, checked } = e.target;
    setSearchData({ ...searchData, [name]: type === 'checkbox' ? checked : value });
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
    setIsLoading(true);
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
    finally{
      setIsLoading(false);
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
  // const ClickOnCustomer = (customerId,contractId)=>{
  //   //navigate(`/customer/${customerId}/contract/${contractId}`)
  //   console.log(customerId + contractId);
  // //   <navigate
  // //   to="/Customer"
  // //   state={{
  // //     team: [],
  // //     timeStart: '12:00 AM',
  // //     timeEnd: '12:00 AM',
  // //     selectedTeam: 0,
  // //     selectedDate: Date
  // //   }}
  // // />
  // };

  const ClickOnCustomer = (customerId, contractId) => {
    navigate(`/customer/${customerId}/contract/${contractId}`, {
      state: {
        team: [],
        timeStart: '12:00 AM',
        timeEnd: '12:00 AM',
        selectedTeam: 0,
        selectedDate: new Date()
      }
    });
  };
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
  };
  return (
    <Box sx={{ p: 4 }} className="search-container">             
    <Loader isLoading={isLoading} />

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
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={searchData.approval}
                      onChange={handleInputChange}
                      name="approval"
                    />
                  }
                  label="Approval"
                />
              </Grid>

              {/* Checkbox for Confirmation */}
              <Grid item xs={12} md={3} className="advanced-search-section">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={searchData.confirmation}
                      onChange={handleInputChange}
                      name="confirmation"
                    />
                  }
                  label="Confirmation"
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
        <>
        <ContractStatus/>
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
      {results.map((row) => {
       // const navigate = useNavigate();  // useNavigate hook

        let backgroundColor = '';
        let color = 'black';

        switch (row.contractStatusId) {
          case 1:
            backgroundColor = 'green';
            color = 'white';
            break;
          case 2:
            backgroundColor = 'lightblue';
            break;
          case 3:
            backgroundColor = 'white';
            break;
          case 4:
            backgroundColor = 'yellow';
            break;
          case 5:
            backgroundColor = 'red';
            color = 'white';
            break;
          default:
            backgroundColor = ''; // Default background color if ContractStatusId doesn't match
        }

        return (
          <TableRow
            key={row.userId}
            sx={{
              backgroundColor: backgroundColor,
              color: color,
              fontWeight: 'bold',
              cursor: 'pointer',  // Add cursor pointer to indicate clickability
              '&:hover': {
                backgroundColor: 'lightgray',
              },
            }}
            onClick={() =>ClickOnCustomer(row.customerId,row.contractId)}  // Navigate to customer.js with row.userId
          >
            <TableCell sx={{ color: color }}>{row.firstName}</TableCell>
            <TableCell sx={{ color: color }}>{row.lastName}</TableCell>
            <TableCell sx={{ color: color }}>{row.contractNumber}</TableCell>
            <TableCell sx={{ color: color }}>{formatDate(row.contractDate)}</TableCell>
            <TableCell sx={{ color: color }}>{formatDate(row.eventDate)}</TableCell>
            <TableCell sx={{ color: color }}>{row.emailAddress}</TableCell>
            <TableCell sx={{ color: color }}>{row.stateName}</TableCell>
            <TableCell sx={{ color: color }}>{row.city}</TableCell>
            <TableCell sx={{ color: color }}>{row.packageName}</TableCell>
            <TableCell sx={{ color: color }}>{row.approval ? 'Yes' : 'No'}</TableCell>
            <TableCell sx={{ color: color }}>{row.confirmation ? 'Yes' : 'No'}</TableCell>
            <TableCell sx={{ color: color }}>{row.primaryHonoree}</TableCell>
            <TableCell sx={{ color: color }}>{row.characters}</TableCell>
            <TableCell sx={{ color: color }}>{row.bounces}</TableCell>
            <TableCell sx={{ color: color }}>{row.addOns}</TableCell>
          </TableRow>
        );
      })}
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


        </>

      )}
      {!results.length && (
        <>
                <ContractStatus/>

  <Typography>No results found</Typography>
  </>
)}

    </Box>
  );
};

export default SearchForm;
