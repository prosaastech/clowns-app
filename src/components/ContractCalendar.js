// src/components/ContractCalendar.js
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, Menu, MenuItem, TextField } from '@mui/material';
import '../css/ContractCalendar.css';
import { Navigate } from 'react-router-dom';
import config from './Utils/config'
import Loader from './Utils/loader'; // Import Loader component

const ContractCalendar = () => {
  const [dragging, setDragging] = useState(null);
  const [activeSelection, setActiveSelection] = useState(null);
  const [finalSelection, setFinalSelection] = useState(null);
  const [selectedRanges, setSelectedRanges] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [contextMenu, setContextMenu] = useState({ time: null, team: null });
  const [teams, setTeams] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  // const [selectedDate, setSelectedDate] = useState('2024-08-12'); // Default date
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Default date is the current date
  const [navigateToCustomer, setNavigateToCustomer] = useState(false); // New state for navigation
  const [navigateToCustomerEdit, setNavigateToCustomerEdit] = useState(false); // New state for navigation

  const [contractData, setContractData] = useState({
    contractId: 0,
    customerId: 0
  });

  const [isLoading, setIsLoading] = useState(false); // Control loader visibility

  useEffect(() => {
    const token = localStorage.getItem('token');

    // Fetch teams
    const fetchTeams = async () => {

      try {
        setIsLoading(true);
        const response = await fetch(config.apiBaseUrl + 'Teams', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Include the token in the header
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setTeams(data);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }finally{
        setIsLoading(false);
      }
    };

    // Fetch time slots
    const fetchTimeSlots = async () => {
      try {
        setIsLoading(true);

        const response = await fetch(config.apiBaseUrl + 'TimeSlots', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Include the token in the header
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
       // console.log("timeslot " + data.map(slot => slot.time));
        setTimeSlots(data.map(slot => slot.time)); // Assuming the time property contains the time string
      } catch (error) {
        console.error('Error fetching time slots:', error);
      } finally {
        setIsLoading(false);

      }
    };

    // Fetch contract data
    const fetchContractData = async () => {
      try {
        setIsLoading(true);

        const response = await fetch(config.apiBaseUrl + `ContractTimeTeamInfoes/getAllContractsDateWise?date=${selectedDate}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Include the token in the header
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        const data = result.contracts || [];
        console.log("Data of Contract:", data,null,2);
        // Map the fetched data to the selected ranges
        const ranges = data.reduce((acc, contract) => {
          const { teamNo, time, customerId, contractId } = contract;
          if (teamNo && time) {
            acc[teamNo] = acc[teamNo] || [];
            if (!acc[teamNo].includes(time)) {
              //console.log(time);
              acc[teamNo].push(time,customerId,contractId);
            }
          }
          return acc;
        }, {});

        // const ranges = data.reduce((acc, contract) => {
        //   const { teamNo, time, customerId, contractId } = contract;
        //   console.log({ teamNo, time, customerId, contractId }); // Debugging
        //   if (teamNo && time) {
        //     acc[teamNo] = acc[teamNo] || [];
        //     if (!acc[teamNo].includes(time)) {

        //     acc[teamNo].push({
        //       time,        // Store the time
        //       customerId,  // Store customerId
        //       contractId   // Store contractId
        //     });
        //   }
        //   }
        //   return acc;
        // }, {});
        
         

        setSelectedRanges(ranges);
      } catch (error) {
        console.error('Error fetching contract data:', error);
        setSelectedRanges({});
      } finally {
        setIsLoading(false);

      }
    };

    fetchTeams();
    fetchTimeSlots();
    fetchContractData();
  }, [selectedDate]);

  const handleMouseDown = (event, time, team) => {
    event.preventDefault();
    setDragging(team);
    setActiveSelection({ team, start: time, end: time });
  };

  const handleMouseOver = (event, time, team) => {
    if (dragging === team && activeSelection) {
      const updatedEnd = time;
      setActiveSelection(prev => ({
        ...prev,
        end: updatedEnd
      }));
      setFinalSelection(activeSelection);
     // console.log('MouseOver - Active Selection:', { ...activeSelection, end: updatedEnd });
    }
  };

  const handleMouseUp = () => {
    if (activeSelection) {
      setSelectedRanges(prev => {
        const { team, start, end } = activeSelection;
        const newRange = { start, end };
        return {
          ...prev,
          [team]: [...(prev[team] || []), newRange]
        };
      });
      setActiveSelection(null);
    }
    setDragging(null);
  };

  const handleContextMenu = (event, time, team) => {
    event.preventDefault();
    setAnchorEl({ top: event.clientY, left: event.clientX });
    setContextMenu({ time, team });
  };

  const handleMenuClick = (action) => {
    if (action === 'cancel') {
      setSelectedRanges(prev => {
        const updatedRanges = { ...prev };
        const team = contextMenu.team;
        if (team) {
          updatedRanges[team] = updatedRanges[team].filter(range =>
            !(range.start === contextMenu.time || range.end === contextMenu.time)
          );
        }
        return updatedRanges;
      });
    } else if (action === 'CreateContract') {
    //  console.log('Active Selection on CreateContract:', finalSelection);
      //console.log('MouseOver - Active Selection:', { ...activeSelection });

      setNavigateToCustomer(true); // Trigger navigation
    } 
    else if (action === 'EditContract') {
      console.log('edit call1:', selectedRanges[contextMenu.team]);

      const selectedRange = selectedRanges[contextMenu.team]?.find(
        range => range[0] && contextMenu?.time && 
                 normalizeTime(range[0]) === normalizeTime(contextMenu.time)[0]
      );
    
      const customerId = selectedRanges[contextMenu.team]?.[1] || 0;
      const contractId = selectedRanges[contextMenu.team]?.[2] || 0;
      
      setContractData(prevData => ({
        ...prevData,
        contractId: contractId,
        customerId: customerId
      }));
      
      // console.log('selectedRange:', selectedRange);
      // console.log(`CustomerId:${customerId}:ContractId:${contractId}`);
      setNavigateToCustomerEdit(true);
     
    }
    
    
    setAnchorEl(null);
  };
  const normalizeTime = (timeStr) => {
    if (!timeStr) {
      return null; // Return null or handle it based on your logic
    }
    
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':');
    
    if (modifier === 'PM' && hours !== '12') {
      hours = parseInt(hours, 10) + 12;
    }
    if (modifier === 'AM' && hours === '12') {
      hours = '00';
    }
  
    return `${hours}:${minutes}`;
  };
  
  useEffect(() => {
    const handleMouseMove = (event) => {
      if (dragging) {
        const cell = event.target;
        const time = cell.dataset.time;
        const team = cell.dataset.team;
        handleMouseOver(event, time, team);
      }
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, activeSelection]);

  const isSelected = (time, team) => {
    const ranges = Array.isArray(selectedRanges[team]) ? selectedRanges[team] : [];
    const currentTimeIndex = timeSlots.indexOf(time);

    return ranges.some(range => {
      if (typeof range === 'string') {
        return range === time;
      } else if (typeof range === 'object' && range.start && range.end) {
        const startTimeIndex = timeSlots.indexOf(range.start);
        const endTimeIndex = timeSlots.indexOf(range.end);
        const minTimeIndex = Math.min(startTimeIndex, endTimeIndex);
        const maxTimeIndex = Math.max(startTimeIndex, endTimeIndex);

        return currentTimeIndex >= minTimeIndex && currentTimeIndex <= maxTimeIndex;
      }
      return false;
    });
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  if (navigateToCustomer) {
    // console.log('Navigating with:', {
    //   team: contextMenu.team,
    //   timeStart: activeSelection?.start,
    //   timeEnd: activeSelection?.end,
    //   selectedTeam: contextMenu.team
    // });
    return (
      <Navigate
        to="/Customer"
        state={{
          team: contextMenu.team,
          timeStart: finalSelection?.start,
          timeEnd: finalSelection?.end,
          selectedTeam: contextMenu.team,
          selectedDate: selectedDate
        }}
      />
    );
  }

  if (navigateToCustomerEdit) {
   
  console.log(`accessing before navigate: ${contractData.customerId}:${contractData.contractId}`)
    return (
      <Navigate
        to="/Customer"
        state={{
          team: contextMenu.team,
          timeStart: finalSelection?.start,
          timeEnd: finalSelection?.end,
          selectedTeam: contextMenu.team,
          selectedDate: selectedDate,
          newCustomerId: contractData.customerId,
          newContractId: contractData.contractId
        }}
      />
    );
    
  }
  return (
    <Box>
              <Loader isLoading={isLoading} />

      <TextField
        type="date"
        value={selectedDate}
        onChange={handleDateChange}
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 2 }}
      />

      <TableContainer component={Box}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Time</TableCell>
              {teams.map((team, index) => (
                <TableCell key={index}>{team.teamNo}</TableCell> // Ensure teamNo is used
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {timeSlots.map((time, rowIndex) => (
              <TableRow key={rowIndex}>
                <TableCell>{time}</TableCell>
                {teams.map((team, colIndex) => (
                  <TableCell
                    key={colIndex}
                    onMouseDown={(e) => handleMouseDown(e, time, team.teamNo)} // Ensure teamNo is used
                    onMouseOver={(e) => handleMouseOver(e, time, team.teamNo)} // Ensure teamNo is used
                    onContextMenu={(e) => handleContextMenu(e, time, team.teamNo)} // Ensure teamNo is used
                    data-time={time}
                    data-team={team.teamNo} // Ensure teamNo is used
                    sx={{
                      border: '1px solid #ddd',
                      backgroundColor: isSelected(time, team.teamNo) ? '#2196F3' : 'inherit',
                      color: isSelected(time, team.teamNo) ? 'white' : 'inherit',
                      cursor: 'pointer'
                    }}
                  >
                    {/* Optionally display selection */}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Menu
          anchorReference="anchorPosition"
          anchorPosition={anchorEl ? { top: anchorEl.top, left: anchorEl.left } : undefined}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem onClick={() => handleMenuClick('CreateContract')}>Create Contract</MenuItem>
          <MenuItem onClick={() => handleMenuClick('EditContract')}>Edit Contract</MenuItem>
          <MenuItem onClick={() => handleMenuClick('cancel')}>Cancel</MenuItem>
        </Menu>
      </TableContainer>
    </Box>
  );
};

export default ContractCalendar;
