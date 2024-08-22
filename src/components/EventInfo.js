import React, { useState, useEffect } from 'react';
import { Box, TextField, MenuItem } from '@mui/material';

const EventInfo = ({ formData, setFormData, states, teams, selectedTeam, time }) => {
  
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [venues, setVenues] = useState([]);
  const [eventType, setEventType] = useState([]);
 

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

    fetchDropdownData('http://localhost:5213/api/EventTypes', setEventType);
    fetchDropdownData('http://localhost:5213/api/Venues', setVenues);
   }, []);

  useEffect(() => {
    console.log("Team No:" + selectedTeam);
    if (selectedTeam) {
      // Find the teamId based on the teamNo
      const matchingTeam = teams.find(team => team.teamNo === selectedTeam);
      if (matchingTeam) {
        setFormData(prev => ({
          ...prev,
          eventInfo_teamAssigned: matchingTeam.teamId,
        }));
      }
    }
    if (time) {
      setFormData(prev => ({
        ...prev,
        eventInfo_partyStartTime: time.startTime,
        eventInfo_partyEndTime: time.endTime,
      }));
    }
  }, [selectedTeam, time, teams, setFormData]);
  

  return (
    <Box>
      <div className="row">
        <div className="col-md-3 col-sm-12">
          <TextField
            label="Event Type"
            name="eventInfo_eventType"
            select
            value={formData.eventInfo_eventType || ''}
            onChange={handleChange}
            fullWidth
          >
            {eventType.map((type) => (
              <MenuItem key={type.id} value={type.eventTypeId}>{type.eventTypeName}</MenuItem>
            ))}
          </TextField>
        </div>
        <div className="col-md-3 col-sm-12">
          <TextField
            label="Number of Children Expected"
            name="eventInfo_numberOfChildren"
            type="number"
            value={formData.eventInfo_numberOfChildren || ''}
            onChange={handleChange}
            fullWidth
          />
        </div>
        <div className="col-md-3 col-sm-12">
          <TextField
            label="Date Of Event"
            name="eventInfo_eventDate"
            type="date"
            value={formData.eventInfo_eventDate || ''}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>
        <div className="col-md-3 col-sm-12">
          <TextField
            label="Party Start Time"
            name="eventInfo_partyStartTime"
            type="time"
            value={formData.eventInfo_partyStartTime || ''}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>
        <div className="col-md-3 col-sm-12">
          <TextField
            label="Party End Time"
            name="eventInfo_partyEndTime"
            type="time"
            value={formData.eventInfo_partyEndTime || ''}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>
        <div className="col-md-3 col-sm-12">
        <TextField
        label="Team Assigned"
        name="eventInfo_teamAssigned"
        select
        value={formData.eventInfo_teamAssigned || ''}
        onChange={handleChange}
        fullWidth
      >
      {teams.map((team) => (
        <MenuItem key={team.id} value={team.teamId}>
          {team.teamNo}
        </MenuItem>
      ))}
    </TextField>

        </div>
        <div className="col-md-3 col-sm-12">
          <TextField
            label="Start Clowns Hour"
            name="eventInfo_startClownHour"
            type="time"
            value={formData.eventInfo_startClownHour || ''}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>
        <div className="col-md-3 col-sm-12">
          <TextField
            label="End Clowns Hour"
            name="eventInfo_endClownHour"
            type="time"
            value={formData.eventInfo_endClownHour || ''}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>
        <div className="col-md-3 col-sm-12">
          <TextField
            label="Event Address"
            name="eventInfo_eventAddress"
            value={formData.eventInfo_eventAddress || ''}
            onChange={handleChange}
            fullWidth
          />
        </div>
        <div className="col-md-3 col-sm-12">
          <TextField
            label="City"
            name="eventInfo_eventCity"
            value={formData.eventInfo_eventCity || ''}
            onChange={handleChange}
            fullWidth
          />
        </div>
        <div className="col-md-3 col-sm-12">
          <TextField
            label="ZIP"
            name="eventInfo_eventZip"
            value={formData.eventInfo_eventZip || ''}
            onChange={handleChange}
            fullWidth
          />
        </div>
        <div className="col-md-3 col-sm-12">
          <TextField
            label="State"
            name="eventInfo_eventState"
            select
            value={formData.eventInfo_eventState || ''}
            onChange={handleChange}
            fullWidth
          >
            {states.map((state) => (
              <MenuItem key={state.id} value={state.stateId}>{state.stateName}</MenuItem>
            ))}
          </TextField>
        </div>
        <div className="col-md-3 col-sm-12">
          <TextField
            label="Venue"
            name="eventInfo_venue"
            select
            value={formData.eventInfo_venue || ''}
            onChange={handleChange}
            fullWidth
          >
            {venues.map((venue) => (
              <MenuItem key={venue.id} value={venue.venueId}>{venue.venueName}</MenuItem>
            ))}
          </TextField>
        </div>
        <div className="col-md-3 col-sm-12">
          <TextField
            label="Venue Description"
            name="eventInfo_venueDescription"
            value={formData.eventInfo_venueDescription || ''}
            onChange={handleChange}
            fullWidth
          />
        </div>
      </div>
    </Box>
  );
};

export default EventInfo;
