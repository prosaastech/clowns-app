import React, { useState, useEffect } from 'react';
import { Box, Tabs, Tab, TextField, MenuItem, Button } from '@mui/material';
import '../css/CustomerForm.css';
import EventInfo from './EventInfo';
import { useLocation } from 'react-router-dom';
import PackageInfo from './PackageInfo';
import BookingPaymentInfo from './BookingPaymentInfo'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"
import config from './Utils/config'
import { Category, Description } from '@mui/icons-material';

const CustomerForm = () => {
  const location = useLocation();
  const { team, timeStart, timeEnd, selectedTeam, selectedDate } = location.state || {}; // Destructure the values from location state

  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    customerId:0,
    firstName: '',
    lastName: '',
    emailAddress: '',
    phoneNo: '',
    relationshipId: 0,
    otherRelationshipId: 0,
    alternatePhone: '',
    address: '',
    addressTypeId: 0,
    city: '',
    zip: 0,
    stateId: 0,
    childrenId: 0,
    childrenUnderAgeId: 0,
    honoreeName: '',
    honoreeAge: 0,
    heardResourceId: 0,
    specifyOther: '',
    comments: '',
    contractEventInfoId:0,
    eventInfoEventType: 0,
    eventInfoNumberOfChildren: 0,
    eventInfoEventDate: '',
    eventInfoPartyStartTime: timeStart || '', // Initialize with timeStart
    eventInfoPartyEndTime: timeEnd || '',     // Initialize with timeEnd
    eventInfoTeamAssigned: selectedTeam || '', // Initialize with selectedTeam
    eventInfoStartClownHour: '',
    eventInfoEndClownHour: '',
    eventInfoEventAddress: '',
    eventInfoEventCity: '',
    eventInfoEventZip: 0,
    eventInfoEventState: 0,
    eventInfoVenue: 0,
    eventInfoVenueDescription: '',
    contractId:0,
    packageInfoId:0,
    categoryId:0,
    partyPackageId:0,
    price: 0,
    tax: 0,
    tip: 0,
    description: '',
    characters: [],
    addons: [],
    bounces: [],
    parkingFees: 0,
    tollFees: 0,
    deposit: 0,
    tip2:0,
    subtract:0,
    totalBalance:0,
    selectedDate:selectedDate,
    cardNumber1: '',
    cardType1: '',
    expirationDate1: '',
    cvv1: '',
    cardNumber2: '',
    cardType2: '',
    expirationDate2: '',
    cvv2: '',
    paymentStatus: '',
    address: '',
    billingAddress: '',
  });
 
 
 
 
  const [addressTypes, setAddressTypes] = useState([]);
  const [states, setStates] = useState([]);
  const [teams, setTeams] = useState([]);
  const [venues, setVenues] = useState([]);
  const [childrenOptions, setChildrenOptions] = useState([]);
  const [childrenUnderAge, setChildrenUnderAge] = useState([]);

  const [heardAboutUsOptions, setHeardAboutUsOptions] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [otherRelationships, setOtherRelationships] = useState([]);
  const [cardOptions, setCardOptions] = useState([]);

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

    fetchDropdownData(config.apiBaseUrl + 'AddressTypes', setAddressTypes);
    fetchDropdownData(config.apiBaseUrl + 'States', setStates);
    fetchDropdownData(config.apiBaseUrl + 'Children', setChildrenOptions);
    fetchDropdownData(config.apiBaseUrl + 'ChildrenUnderAges', setChildrenUnderAge);
    fetchDropdownData(config.apiBaseUrl + 'HeardResources', setHeardAboutUsOptions);
    fetchDropdownData(config.apiBaseUrl + 'Relationships', setRelationships);
    fetchDropdownData(config.apiBaseUrl + 'Relationships', setOtherRelationships);
    fetchDropdownData(config.apiBaseUrl + 'Teams', setTeams);
    fetchDropdownData(config.apiBaseUrl + 'CardOptions', setCardOptions);

  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => {
      const updatedFormData = { ...prev, [name]: value };
      return updatedFormData;
    });
  };

  const handleTabChange = (event, newValue) => {
    
   // setActiveTab(newValue);
  };

  const handleNext = async () => {
    // Attempt to save the form data
    if (activeTab === 0)
    {
        const success = await saveCustomerData();
        
        // Only move to the next tab if the save was successful
        if (success) {
          setActiveTab((prev) => Math.min(prev + 1, 2));
          return;
        }
    }
    else if  (activeTab === 1)
      {
          const success = await saveEventData();
          
          // Only move to the next tab if the save was successful
          if (success) {
            setActiveTab((prev) => Math.min(prev + 1, 2));
            return;
          }
      }
      else if  (activeTab === 2)
        {
          const success = await savePackageInfoData();
          
          // Only move to the next tab if the save was successful
          if (success) {
            setActiveTab((prev) => Math.min(prev + 1, 3));
            return;
          }
        }

 

  };
  function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

  const saveEventData = async () => {
    const token = localStorage.getItem('token');

    if (formData.eventInfoEventDate == '') {
      Toastify({
        text: "Invalid Event Date.",
        className: "error",
        style: {
          background: "linear-gradient(to right, #ff5f6d, #ffc371)",
        }
      }).showToast();
      return false; // Return false to prevent moving to the next tab
    }

    try {
      // Make the API call to save the form data
      //console.log(JSON.stringify(formData));
      const response = await fetch(config.apiBaseUrl + 'ContractEventInfoes/SaveEventInfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include your Bearer token if needed
        },
        body: JSON.stringify(formData), // Send the form data as JSON
      });
  
      if (!response.ok) {
        throw new Error(`Failed to save data: ${response.statusText}`);
      }
  
      const result = await response.json();
      //console.log("Form data saved successfully:", result);
      
      let msg = "added";
      
      if (formData.contractEventInfoId !=0){
       msg = "updated";
      }


      Toastify({
        text: "Event " + msg + " successfully!",
        className: "info",
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        }
      }).showToast();

      localStorage.setItem('contractEventInfoId', result.contractEventInfoId);
      
      if (formData.contractEventInfoId === 0){
        console.log(result.contractId);
        setFormData(prevFormData => ({
          ...prevFormData,
          contractEventInfoId: result.contractEventInfoId,
          contractId: result.contractId
        }));
      }
      else
      {
        setFormData(prevFormData => ({
          ...prevFormData,
          contractEventInfoId: result.contractEventInfoId,
          contractId: result.contractId
        }));
      }

      // Return true to indicate success
      return true;
    } catch (error) {
      console.error("Error saving form data:", error);
      Toastify({
        text: "An error occurred while saving the data. Please try again.",
        className: "error",
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        }
      }).showToast();
      //toast.error();
      //alert("An error occurred while saving the data. Please try again.");
      
      // Return false to indicate failure
      return false;
    }
  };
  const saveCustomerData = async () => {
    const token = localStorage.getItem('token');

    if (formData.emailAddress !=""){
    if (!validateEmail(formData.emailAddress)) {
      Toastify({
        text: "Please provide valid email",
        className: "error",
        style: {
          background: "linear-gradient(to right, #ff5f6d, #ffc371)",
        }
      }).showToast();
      return false; // Return false to prevent moving to the next tab
    }
  }
    if (!formData.firstName || !formData.lastName) {
      Toastify({
        text: "First Name and Last Name are required.",
        className: "error",
        style: {
          background: "linear-gradient(to right, #ff5f6d, #ffc371)",
        }
      }).showToast();
      return false; // Return false to prevent moving to the next tab
    }

    try {
      // Make the API call to save the form data
     // console.log(JSON.stringify(formData));
      const response = await fetch(config.apiBaseUrl + 'CustomerInfoes/SaveCustomer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include your Bearer token if needed
        },
        body: JSON.stringify(formData), // Send the form data as JSON
      });
  
      if (!response.ok) {
        throw new Error(`Failed to save data: ${response.statusText}`);
      }
  
      const result = await response.json();
      //console.log("Form data saved successfully:", result);
      let msg = "added";
     if (formData.customerId !=0){
      msg = "updated";
     }

      Toastify({
        text: "Customer " + msg + " successfully!",
        className: "info",
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        }
      }).showToast();

      localStorage.setItem('customerId', result.customerId);
      
      setFormData(prevFormData => ({
        ...prevFormData,
        customerId: result.customerId
      }));
      
      // Return true to indicate success
      return true;
    } catch (error) {
      console.error("Error saving form data:", error);
      Toastify({
        text: "An error occurred while saving the data. Please try again.",
        className: "error",
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        }
      }).showToast();
      //toast.error();
      //alert("An error occurred while saving the data. Please try again.");
      
      // Return false to indicate failure
      return false;
    }
  };
  function parseNumber(value) {
    // Convert null or undefined to empty string
    if (value == null || value === '') {
      return '0';
    }
  
    // Ensure value is a string
    if (typeof value !== 'string') {
      value = String(value);
    }
  
    // Remove commas
    const cleanedValue = value.replace(/,/g, '');
  
    // Parse the float
    const parsedValue = parseFloat(cleanedValue);
  
    // Check if the result is a valid number
    if (isNaN(parsedValue)) {
      return '0'; // Return '0' if parsing fails
    }
  
    // Remove trailing zeros
    return parsedValue.toString().replace(/(\.\d*?[1-9])0+$|\.0*$/, '$1');
  }
  const savePackageInfoData = async () => {
    const token = localStorage.getItem('token');
  
    try {
      console.log('FormData before API call:', JSON.stringify(formData, null, 2));
  
      // Parse numeric values to ensure no commas are included
      const requestBody = {
        customerId:formData.customerId,
        contractId:formData.contractId,
        categoryId: parseNumber(formData.categoryId) || 0,
        price: parseNumber(formData.price) || 0,
        tax: parseNumber(formData.tax) || 0,
        tip: parseNumber(formData.tip) || 0,
        partyPackageId: parseInt(formData.partyPackageId) || 0,
        description: formData.description || '',
        parkingFees: parseNumber(formData.parkingFees) || 0,
        tip2: parseNumber(formData.tip2) || 0, // Make sure 'tip2' is the correct case as per your API
        tollFees: parseNumber(formData.tollFees) || 0,
        substract: parseNumber(formData.subtract) || 0,
        deposit: parseNumber(formData.deposit) || 0,
        totalBalance: parseNumber(formData.totalBalance) || 0,
        characters: formData.characters.map(item => ({
          characterId: parseInt(item.characterId),
          price: parseFloat(item.price)
        })) || [],
        addons: formData.addons.map(item => ({
          addonId: parseInt(item.addonId),
          price: parseFloat(item.price)
        })) || [],
        bounces: formData.bounces.map(item => ({
          bounceId: parseInt(item.bounceId),
          price: parseFloat(item.price)
        })) || [],
        packageInfoId: parseInt(formData.packageInfoId) || 0
      };
  
      console.log("Request Body:", JSON.stringify(requestBody, null, 2));
  
      const response = await fetch(config.apiBaseUrl + 'ContractPackageInfoes/SavePackageInfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include your Bearer token if needed
        },
        body: JSON.stringify(requestBody), // Send the form data as JSON
      });
  
      if (!response.ok) {
        throw new Error(`Failed to save data: ${response.statusText}`);
      }
  
      const result = await response.json();
  
      let msg = formData.packageInfoId != 0 ? "updated" : "added";
  
      Toastify({
        text: "Event " + msg + " successfully!",
        className: "info",
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        }
      }).showToast();
  
      // Save the packageInfoId in localStorage and update the state
      localStorage.setItem('packageInfoId', result.packageInfoId);
      setFormData(prevFormData => ({
        ...prevFormData,
        packageInfoId: result.packageInfoId
      }));
  
      // Return true to indicate success
      return true;
    } catch (error) {
      console.error("Error saving form data:", error);
  
      Toastify({
        text: "An error occurred while saving the data. Please try again.",
        className: "error",
        style: {
          background: "linear-gradient(to right, #ff5f6d, #ffc371)",
        }
      }).showToast();
  
      // Return false to indicate failure
      return false;
    }
  };
  
  const handlePrevious = () => {
    setActiveTab((prev) => Math.max(prev - 1, 0)); // Move to previous tab
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('SubmitForm', {
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
        <Tab label="Booking & Payment Info" />
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
              name="emailAddress"
              value={formData.emailAddress}
              onChange={handleChange}
              fullWidth
            />
          </div>
          <div className="col-md-2 col-sm-12">
            <TextField
              label="Phone"
              name="phoneNo"
              value={formData.phoneNo}
              onChange={handleChange}
              fullWidth
            />
          </div>
         
          <div className="col-md-2 col-sm-12">
            <TextField
              label="Relationship"
              name="relationshipId"
              select
              value={formData.relationshipId}
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
              name="otherRelationshipId"
              select
              value={formData.otherRelationshipId}
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
              name="addressTypeId"
              select
              value={formData.addressTypeId}
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
              name="stateId"
              select
              value={formData.stateId}
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
              name="childrenId"
              select
              value={formData.childrenId}
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
              name="childrenUnderAgeId"
              select
              value={formData.childrenUnderAgeId}
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
              name="heardResourceId"
              select
              value={formData.heardResourceId}
              onChange={handleChange}
              fullWidth
            >
              {heardAboutUsOptions.map((option) => (
                <MenuItem key={option.id} value={option.heardResourceId}>{option.heardResourceName}</MenuItem>
              ))}
            </TextField>
          </div>
          {formData.heardResourceId === 2 && (
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
        <EventInfo
          formData={formData}
          setFormData={setFormData}
          states={states}
          teams={teams}
          timeStart={timeStart}   // Pass timeStart to EventInfo
          timeEnd={timeEnd}       // Pass timeEnd to EventInfo
          selectedTeam={selectedTeam} // Pass selectedTeam to EventInfo
        />
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
       <PackageInfo 
       formData={formData}
       setFormData={setFormData}
       
       
       />
        <div className="form-buttons">
          <Button variant="contained" onClick={handlePrevious} disabled={activeTab === 0}>
            Previous
          </Button>
          <Button variant="contained" onClick={handleNext} disabled={activeTab === 3}>
            Next
          </Button>
        </div>
      </div>

      <div className={`tab-content ${activeTab === 3 ? 'active' : ''}`}>
        <h2>Booking & Payment Info</h2>
       <BookingPaymentInfo
        formData={formData} handleChange={handleChange} cardOptions={cardOptions} 
        /> 
 
        <div className="form-buttons">
          <Button variant="contained" onClick={handlePrevious} disabled={activeTab === 0}>
            Previous
          </Button>
          <Button variant="contained" onClick={handleSubmit} disabled={activeTab !== 3}>
            Submit
          </Button>
        </div>
      </div>
    </Box>
  );
};

export default CustomerForm;
