import React, { useState, useEffect } from 'react';
import { Box, TextField, MenuItem } from '@mui/material';
import config from './Utils/config'

const EventInfo = ({ formData, setFormData, states, teams, selectedTeam, time }) => {

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Convert 24-hour format to 12-hour format with AM/PM
  const convertTo12HourFormat = (time) => {
    let [hours, minutes] = time.split(':');
    const suffix = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert '0' hours to '12' for AM
    return `${hours}:${minutes} ${suffix}`;
  };

  // Convert 12-hour format to 24-hour format
  const convertTo24HourFormat = (time) => {

    if (time === null || time === '' || time === undefined)
      return '';

    console.log('time' + time);
    const [timeString, modifier] = time.split(' ');
    let [hours, minutes] = timeString.split(':');
  
    if (modifier === 'PM' && hours !== '12') {
      hours = String(parseInt(hours, 10) + 12);
    } else if (modifier === 'AM' && hours === '12') {
      hours = '00';
    }
  
    return `${hours.padStart(2, '0')}:${minutes}`;
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

    fetchDropdownData(config.apiBaseUrl + 'EventTypes', setEventType);
    fetchDropdownData(config.apiBaseUrl + 'Venues', setVenues);
   }, []);

  useEffect(() => {
    console.log("Team No:" + selectedTeam);
    if (selectedTeam) {
      // Find the teamId based on the teamNo
      const matchingTeam = teams.find(team => team.teamNo === selectedTeam);
      if (matchingTeam) {
        setFormData(prev => ({
          ...prev,
          eventInfoTeamAssigned: matchingTeam.teamId,
        }));
      }
    }
    if (time) {
      console.log("this time" + time);
      setFormData(prev => ({
        ...prev,
        eventInfoPartyStartTime: convertTo12HourFormat(time.startTime),
        eventInfoPartyEndTime: convertTo12HourFormat(time.endTime),
      }));
    }
  }, [selectedTeam, time, teams, setFormData]);

  return (
    <Box>
      <div className="row">
        <div className="col-md-3 col-sm-12">
          <TextField
            label="Event Type"
            name="eventInfoEventType"
            select
            value={formData.eventInfoEventType || ''}
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
            name="eventInfoNumberOfChildren"
            type="number"
            value={formData.eventInfoNumberOfChildren || ''}
            onChange={handleChange}
            fullWidth
          />
        </div>
        <div className="col-md-3 col-sm-12">
          <TextField
            label="Date Of Event"
            name="eventInfoEventDate"
            type="date"
            value={formData.eventInfoEventDate || ''}
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
            name="eventInfoPartyStartTime"
            type="time"  // Using type="time"
            value={convertTo24HourFormat(formData.eventInfoPartyStartTime) || ''}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              eventInfoPartyStartTime: convertTo24HourFormat(e.target.value)
            }))}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>
        <div className="col-md-3 col-sm-12">
          <TextField
            label="Party End Time"
            name="eventInfoPartyEndTime"
            type="time"
            placeholder="HH:MM AM/PM"
            value={convertTo24HourFormat(formData.eventInfoPartyEndTime) || ''}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              eventInfoPartyEndTime: convertTo24HourFormat(e.target.value)
            }))}
            fullWidth
          />
        </div>
        <div className="col-md-3 col-sm-12">
          <TextField
            label="Team Assigned"
            name="eventInfoTeamAssigned"
            select
            value={formData.eventInfoTeamAssigned || ''}
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
            name="eventInfoStartClownHour"
            type="time"
            value={formData.eventInfoStartClownHour || ''}
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
            name="eventInfoEndClownHour"
            type="time"
            value={formData.eventInfoEndClownHour || ''}
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
            name="eventInfoEventAddress"
            value={formData.eventInfoEventAddress || ''}
            onChange={handleChange}
            fullWidth
          />
        </div>
        <div className="col-md-3 col-sm-12">
          <TextField
            label="City"
            name="eventInfoEventCity"
            value={formData.eventInfoEventCity || ''}
            onChange={handleChange}
            fullWidth
          />
        </div>
        <div className="col-md-3 col-sm-12">
          <TextField
            label="ZIP"
            name="eventInfoEventZip"
            value={formData.eventInfoEventZip || ''}
            onChange={handleChange}
            fullWidth
          />
        </div>
        <div className="col-md-3 col-sm-12">
          <TextField
            label="State"
            name="eventInfoEventState"
            select
            value={formData.eventInfoEventState || ''}
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
            name="eventInfoVenue"
            select
            value={formData.eventInfoVenue || ''}
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
            name="eventInfoVenueDescription"
            value={formData.eventInfoVenueDescription || ''}
            onChange={handleChange}
            fullWidth
          />
        </div>
      </div>
    </Box>
  );
};

export default EventInfo;
