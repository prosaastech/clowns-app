import React, { useState, useEffect } from 'react';
import { Box, Tabs, Tab, TextField, MenuItem, Button } from '@mui/material';
import '../css/CustomerForm.css';

const CustomerForm = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    relationship: '',
    otherRelationship: '',
    alternatePhone: '',
    address: '',
    addressType: '',
    city: '',
    zip: '',
    state: '',
    children: '',
    childrenAge: '',
    honoreeName: '',
    honoreeAge: '',
    heardAboutUs: '',
    specifyOther: '',
    comments: '',
  });

  const [addressTypes, setAddressTypes] = useState([]);
  const [states, setStates] = useState([]);
  const [childrenOptions, setChildrenOptions] = useState([]);
  const [childrenUnderAge, setChildrenUnderAge] = useState([]);

  const [heardAboutUsOptions, setHeardAboutUsOptions] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [otherRelationships, setOtherRelationships] = useState([]);

  useEffect(() => {
    // Fetch address types
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

    fetchDropdownData('http://localhost:5213/api/AddressTypes', setAddressTypes);
    fetchDropdownData('http://localhost:5213/api/States', setStates);
    fetchDropdownData('http://localhost:5213/api/Children', setChildrenOptions);
    fetchDropdownData('http://localhost:5213/api/ChildrenUnderAges', setChildrenUnderAge);
    fetchDropdownData('http://localhost:5213/api/HeardResources', setHeardAboutUsOptions);
    fetchDropdownData('http://localhost:5213/api/Relationships', setRelationships);
    fetchDropdownData('http://localhost:5213/api/Relationships', setOtherRelationships);
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
     
    setFormData((prev) => ({ ...prev, [name]: value }));
    console.log(formData.children);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleNext = () => {
    setActiveTab((prev) => Math.min(prev + 1, 2)); // Move to next tab
  };

  const handlePrevious = () => {
    setActiveTab((prev) => Math.max(prev - 1, 0)); // Move to previous tab
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5213/api/SubmitForm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed to submit form');
      alert('Form submitted successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Box>
      <Tabs value={activeTab} onChange={handleTabChange} aria-label="form tabs">
        <Tab label="Customer Info" />
        <Tab label="Event Info" />
        <Tab label="Package Info" />
      </Tabs>

      <div className={`tab-content ${activeTab === 0 ? 'active' : ''}`}>
        <h2>Customer Info</h2>
        <div className="row">
          <div className="col-md-2 col-sm-12">
            <TextField
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              fullWidth
            />
          </div>
          <div className="col-md-2 col-sm-12">
            <TextField
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              fullWidth
            />
          </div>
          <div className="col-md-2 col-sm-12">
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
            />
          </div>
          <div className="col-md-2 col-sm-12">
            <TextField
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              fullWidth
            />
          </div>
         
          <div className="col-md-2 col-sm-12">
            <TextField
              label="Relationship"
              name="relationship"
              select
              value={formData.relationship}
              onChange={handleChange}
              fullWidth
            >
              {relationships.map((rel) => (
                <MenuItem key={rel.id} value={rel.relationshipId}>{rel.relationshipName}</MenuItem>
              ))}
            </TextField>
          </div>
          <div className="col-md-2 col-sm-12">
            <TextField
              label="Other Relationship"
              name="otherRelationship"
              select
              value={formData.otherRelationship}
              onChange={handleChange}
              fullWidth
            >
              {otherRelationships.map((rel) => (
                <MenuItem key={rel.id} value={rel.relationshipId}>{rel.relationshipName}</MenuItem>
            ))}
            </TextField>
          </div>
          <div className="col-md-2 col-sm-12">
            <TextField
              label="Alternate Phone"
              name="alternatePhone"
              value={formData.alternatePhone}
              onChange={handleChange}
              fullWidth
            />
          </div>
          <div className="col-md-2 col-sm-12">
            <TextField
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              fullWidth
            />
          </div>
         
          <div className="col-md-2 col-sm-12">
            <TextField
              label="Address Type"
              name="addressType"
              select
              value={formData.addressType}
              onChange={handleChange}
              fullWidth
            >
              {addressTypes.map((type) => (
                <MenuItem key={type.id} value={type.addressTypeId}>{type.addressTypeName}</MenuItem>
              ))}
            </TextField>
          </div>
          <div className="col-md-2 col-sm-12">
            <TextField
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              fullWidth
            />
          </div>
          <div className="col-md-2 col-sm-12">
            <TextField
              label="ZIP"
              name="zip"
              value={formData.zip}
              onChange={handleChange}
              fullWidth
            />
          </div>
          <div className="col-md-2 col-sm-12">
            <TextField
              label="State"
              name="state"
              select
              value={formData.state}
              onChange={handleChange}
              fullWidth
            >
              {states.map((state) => (
                <MenuItem key={state.id} value={state.stateId}>{state.stateName}</MenuItem>
              ))}
            </TextField>
          </div>
         
          <div className="col-md-2 col-sm-12">
            <TextField
              label="Children"
              name="children"
              select
              value={formData.children}
              onChange={handleChange}
              fullWidth
            >
              {childrenOptions.map((option) => (
                <MenuItem key={option.id} value={option.childrenId}>{option.childrenNo}</MenuItem>
              ))}
            </TextField>
          </div>
          <div className="col-md-2 col-sm-12">
            <TextField
              label="Children Under Age 11"
              name="children"
              select
              value={formData.childrenAge}
              onChange={handleChange}
              fullWidth
            >
              {childrenUnderAge.map((option) => (
                <MenuItem key={option.id} value={option.childrenUnderAgeId}>{option.childrenUnderAgeNo}</MenuItem>
              ))}
            </TextField>
          </div>
          <div className="col-md-2 col-sm-12">
            <TextField
              label="Honoree Name"
              name="honoreeName"
              value={formData.honoreeName}
              onChange={handleChange}
              fullWidth
            />
          </div>
          <div className="col-md-2 col-sm-12">
            <TextField
              label="Honoree Age"
              name="honoreeAge"
              value={formData.honoreeAge}
              onChange={handleChange}
              fullWidth
            />
          </div>
        
          <div className="col-md-2 col-sm-12">
            <TextField
              label="Where Have You Heard About Us"
              name="heardAboutUs"
              select
              value={formData.heardAboutUs}
              onChange={handleChange}
              fullWidth
            >
              {heardAboutUsOptions.map((option) => (
                <MenuItem key={option.id} value={option.heardResourceId}>{option.heardResourceName}</MenuItem>
              ))}
            </TextField>
          </div>
          {formData.heardAboutUs === 'Other' && (
            <div className="col-md-2 col-sm-12">
              <TextField
                label="If other, Please Specify"
                name="specifyOther"
                value={formData.specifyOther}
                onChange={handleChange}
                fullWidth
              />
            </div>
          )}
        
          <div className="col-md-11 col-sm-12">
            <TextField
              label="Comments"
              name="comments"
              multiline
              rows={4}
              value={formData.comments}
              onChange={handleChange}
              fullWidth
            />
          </div>
        </div>
        <div className="form-buttons">
          <Button variant="contained" onClick={handlePrevious} disabled={activeTab === 0}>
            Previous
          </Button>
          <Button variant="contained" onClick={handleNext} disabled={activeTab === 2}>
            Next
          </Button>
        </div>
      </div>

      <div className={`tab-content ${activeTab === 1 ? 'active' : ''}`}>
        <h2>Event Info</h2>
        {/* Add Event Info form fields here */}
        <div className="form-buttons">
          <Button variant="contained" onClick={handlePrevious} disabled={activeTab === 0}>
            Previous
          </Button>
          <Button variant="contained" onClick={handleNext} disabled={activeTab === 2}>
            Next
          </Button>
        </div>
      </div>

      <div className={`tab-content ${activeTab === 2 ? 'active' : ''}`}>
        <h2>Package Info</h2>
        {/* Add Package Info form fields here */}
        <div className="form-buttons">
          <Button variant="contained" onClick={handlePrevious} disabled={activeTab === 0}>
            Previous
          </Button>
          <Button variant="contained" onClick={handleSubmit} disabled={activeTab !== 2}>
            Submit
          </Button>
        </div>
      </div>
    </Box>
  );
};

export default CustomerForm;
