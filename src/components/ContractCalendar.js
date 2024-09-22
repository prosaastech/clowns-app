// src/components/ContractCalendar.js
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, Menu, MenuItem, TextField } from '@mui/material';
import '../css/ContractCalendar.css';
import { Navigate } from 'react-router-dom';
import config from './Utils/config'
import Loader from './Utils/loader'; // Import Loader component
import toast from './Utils/showToast'
import { isObject } from 'chart.js/helpers';
import Swal from 'sweetalert2';


const ContractCalendar = () => {
  const [dragging, setDragging] = useState(null);
  const [activeSelection, setActiveSelection] = useState(null);
  const [currentSelection, setCurrentSelection] = useState(null);

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
  const [isRightClick, setIsRightClick] = useState(false);

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
      } finally {
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
        // ////console.log("timeslot " + data.map(slot => slot.time));
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
        ////console.log("Data of Contract:", data, null, 2);

        // Map the fetched data to the selected ranges
        // const ranges = data.reduce((acc, contract) => {
        //   const { teamNo, time, customerId, contractId } = contract;
        //   if (teamNo && time) {
        //     acc[teamNo] = acc[teamNo] || [];
        //     if (!acc[teamNo].includes(time)) {
        //       //////console.log(time);
        //       acc[teamNo].push(time, customerId, contractId);
        //     }
        //   }
        //   return acc;
        // }, {});
        // const ranges = data.reduce((acc, contract) => {
        //   const { teamNo, time, customerId, contractId } = contract;

        //   if (teamNo) {
        //     // Initialize array for team if it doesn't exist
        //     acc[teamNo] = acc[teamNo] || [];

        //     // Handle case where time is an object with start and end properties
        //     if (typeof time === 'object' && time.start && time.end) {
        //       const timeRange = `${time.start} - ${time.end}`;
        //       // Check if this time range already exists
        //       if (!acc[teamNo].some(item => item.timeRange === timeRange)) {
        //         acc[teamNo].push({ timeRange, customerId, contractId });
        //       }
        //     } 
        //     // Handle simple time string (e.g., "08:00 AM")
        //     else if (typeof time === 'string') {
        //       if (!acc[teamNo].some(item => item.time === time)) {
        //         acc[teamNo].push({ time, customerId, contractId });
        //       }
        //     }
        //   }

        //   return acc;
        // }, {});

        // ////console.log(ranges);

        const ranges = data.reduce((acc, contract) => {
          const { teamNo, time, customerId, contractId } = contract;

          if (teamNo && customerId && contractId) {
            // Initialize array for each team if it doesn't exist
            acc[teamNo] = acc[teamNo] || [];

            // Get the last added entry for the current team
            const lastEntry = acc[teamNo].length > 0 ? acc[teamNo][acc[teamNo].length - 1] : null;

            // Case 1: If time is an object with both start and end properties
            if (typeof time === 'object' && time.start && time.end) {
              const startTime = new Date(`1970/01/01 ${time.start}`);
              const endTime = new Date(`1970/01/01 ${time.end}`);

              // Ensure startTime is less than endTime
              if (startTime < endTime) {
                acc[teamNo].push({
                  startTime: time.start,
                  endTime: time.end,
                  customerId,
                  contractId
                });
              } else {
                console.error(`Invalid time range: start time (${time.start}) should be less than end time (${time.end})`);
              }
            }
            // Case 2: If time is a string with just a start time (no end time)
            else if (typeof time === 'string') {
              const startTime = time;

              // If the previous entry has the same customerId and contractId, update the endTime
              if (lastEntry && lastEntry.customerId === customerId && lastEntry.contractId === contractId) {
                lastEntry.endTime = startTime;  // Use the current start time as the previous entry's end time
              } else {
                // Otherwise, add a new entry with null as the end time
                acc[teamNo].push({
                  startTime: time,
                  endTime: null,  // End time will be updated by the next entry, if available
                  customerId,
                  contractId
                });
              }
            }
          }

          return acc;
        }, {});

        ////console.log(ranges);



        // const ranges = data.reduce((acc, contract) => {
        //   const { teamNo, time, customerId, contractId } = contract;
        //   ////console.log({ teamNo, time, customerId, contractId }); // Debugging
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
        ////console.log("Ranges:", ranges);
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
    setActiveSelection({ team, startTime: time, endTime: time, customerId: 0, contractId: 0 });
  };

  // const handleMouseOver = (event, time, team) => {
  //   if (dragging === team && activeSelection) {
  //     const updatedEnd = time;
  //     setActiveSelection(prev => ({
  //       ...prev,
  //       end: updatedEnd
  //     }));
  //     setFinalSelection(activeSelection);
  //     // ////console.log('MouseOver - Active Selection:', { ...activeSelection, end: updatedEnd });
  //   }
  // };
  const handleMouseOver = (event, time, team) => {
    if (dragging === team && activeSelection) {
      // Update the end time of the active selection as you drag
      setActiveSelection(prev => ({ ...prev, endTime: time }));
    }
  };

  const handleMouseUp = () => {
    
    if (activeSelection) {
      const { team, startTime, endTime, customerId, contractId } = activeSelection;

      setSelectedRanges(prev => {
        const teamRanges = prev[team] || [];
        const isOverlapping = teamRanges.some(range =>
          (range.startTime <= endTime && range.endTime >= startTime)
        );

        const newRange = { startTime, endTime, customerId, contractId };

        // If no overlapping range exists, add a new range
        if (isOverlapping) {
          // console.log(currentSelection.customerId);
          if (currentSelection?.customerId !=0) {
            console.log("overlapping:", isOverlapping)
            const overlappingRange = teamRanges.find(range =>
              (range.startTime <= endTime && range.endTime >= startTime)
            );
            const currentRangeUpdate = { team: team, startTime: startTime, endTime: endTime, customerId: overlappingRange.customerId, contractId: overlappingRange.contractId };
            setCurrentSelection(currentRangeUpdate);
            console.log("ccustid:",newRange);

          }
        }


        if (!isOverlapping) {
          setCurrentSelection(activeSelection);
          console.log("new:", activeSelection);
          return {
            ...prev,
            [team]: [...teamRanges, newRange],
          };
        }
        return prev; // No changes made if overlapping
      });

      // Optionally accumulate to final selections
      setFinalSelection(prevSelections => [
        ...(Array.isArray(prevSelections) ? prevSelections : []),
        activeSelection,
      ]);





      setActiveSelection(null); // Reset active selection after confirming
    }

    setDragging(null);
  };

  // const handleMouseUp = () => {
  //   //console.log("Active selection",activeSelection);
  //   if (activeSelection) {
  //     setSelectedRanges(prev => {
  //       const { team, startTime, endTime,customerId,contractId } = activeSelection;

  //       const newRange = { startTime, endTime,customerId,contractId };
  //       return {
  //         ...prev,
  //         [team]: [...(prev[team] || []), newRange]
  //       };
  //     });
  //     setActiveSelection(null);
  //   }
  //   setDragging(null);
  // };




  const handleContextMenu = (event, time, team) => {
    event.preventDefault();
    setAnchorEl({ top: event.clientY, left: event.clientX });
    setContextMenu({ time, team });
    setIsRightClick(true); // Set right-click flag
    console.log("Right-click detected"); // Debug log

  };

  const cancelFromServer = async (customerId, contractId) => {
    try {
      const token = localStorage.getItem('token');

      const payload = {};
      ////console.log('Sending Payload:', payload);  // Log the payload

      const response = await fetch(config.apiBaseUrl + 'Utils/CancelContract?CustomerId=' + customerId + '&ContractId=' + contractId, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the token in the header

        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        ////console.log('Email sent successfully:', data);
      } else {
        console.error('Failed to send email:', response.statusText);
      }
    } catch (error) {
      console.error('Error sending request:', error);
    }
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

      const selectedRange = selectedRanges[contextMenu.team]?.find(
        range => range[0] && contextMenu?.time &&
          normalizeTime(range[0]) === normalizeTime(contextMenu.time)[0]
      );

      const customerId = selectedRanges[contextMenu.team]?.[1] || 0;
      const contractId = selectedRanges[contextMenu.team]?.[2] || 0;


      if (customerId > 0) {
        setAnchorEl(null);
        // Show SweetAlert confirmation modal
        Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to cancel this contract!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, I want to cancel!',
          cancelButtonText: 'No, cancel!',
          reverseButtons: true,
        }).then((result) => {
          if (result.isConfirmed) {
            // User confirmed with "Yes"
            ////console.log(`User chose to edit the contract:${customerId}:${contractId}`);
            cancelFromServer(customerId, contractId);
            // Continue with the logic, if needed
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            // User clicked "No"
            ////console.log('User cancelled the edit');
            // Cancel further actions
          }
        });

        return false;
      }


    } else if (action === 'CreateContract') {


      const customerId = currentSelection.customerId || 0;
      const contractId = currentSelection.contractId || 0;
      // console.log("active", activeSelection);
      // console.log("current", currentSelection);


      if (customerId > 0) {
        toast({
          type: 'error',
          message: 'You can only edit this contract.',
        });
        return false;

      }
      //console.log(currentSelection);

       setNavigateToCustomer(true); // Trigger navigation
    }
    else if (action === 'EditContract') {


      if (currentSelection.customerId === 0) {
        toast({
          type: 'error',
          message: 'Edit is disabled for new contract.',
        });
        return false;

      }
      setContractData(prevData => ({
        ...prevData,
        contractId: currentSelection.contractId,
        customerId: currentSelection.customerId
      }));

      // ////console.log('selectedRange:', selectedRange);
      // ////console.log(`CustomerId:${customerId}:ContractId:${contractId}`);
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

  // const isSelected = (time, team) => {
  //   const ranges = Array.isArray(selectedRanges[team]) ? selectedRanges[team] : [];
  //   const currentTimeIndex = timeSlots.indexOf(time);

  //   return ranges.some(range => {
  //     if (typeof range === 'string') {
  //       return range === time;
  //     } else if (typeof range === 'object' && range.start && range.end) {
  //       const startTimeIndex = timeSlots.indexOf(range.start);
  //       const endTimeIndex = timeSlots.indexOf(range.end);
  //       const minTimeIndex = Math.min(startTimeIndex, endTimeIndex);
  //       const maxTimeIndex = Math.max(startTimeIndex, endTimeIndex);

  //       return currentTimeIndex >= minTimeIndex && currentTimeIndex <= maxTimeIndex;
  //     }
  //     return false;
  //   });
  // };
  const isSelected = (time, team) => {
    const ranges = Array.isArray(selectedRanges[team]) ? selectedRanges[team] : [];
    const currentTimeIndex = timeSlots.indexOf(time);

    if (currentTimeIndex === -1) {
      ////console.log('Time not found in timeSlots:', time);
      return false;
    }

    return ranges.some(range => {
      // Debug logs
      ////console.log('Checking range:', range);

      // Case 1: Object with startTime and endTime
      if (typeof range === 'object' && range.startTime) {
        const startTimeIndex = timeSlots.indexOf(range.startTime);
        const endTimeIndex = range.endTime ? timeSlots.indexOf(range.endTime) : startTimeIndex;

        if (startTimeIndex === -1) {
          ////console.log('StartTime not found in timeSlots:', range.startTime);
          return false;
        }

        const minTimeIndex = Math.min(startTimeIndex, endTimeIndex);
        const maxTimeIndex = Math.max(startTimeIndex, endTimeIndex);

        // Check if the current time falls within the range
        const isInRange = currentTimeIndex >= minTimeIndex && currentTimeIndex <= maxTimeIndex;
        ////console.log(`Time ${time} is in range: ${isInRange}`);
        return isInRange;
      }

      // Case 2: Simple time string
      if (typeof range === 'string') {
        const isSelected = range === time;
        ////console.log(`Time ${time} is equal to range ${range}: ${isSelected}`);
        return isSelected;
      }
      else if (typeof range === 'object' && range.start && range.end) {
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
    // ////console.log('Navigating with:', {
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
          timeStart: currentSelection?.startTime,
          timeEnd: currentSelection?.endTime,
          selectedTeam: currentSelection.team,
          selectedDate: selectedDate
        }}
      />
    );
  }

  if (navigateToCustomerEdit) {

    ////console.log(`accessing before navigate: ${contractData.customerId}:${contractData.contractId}`)
    return (
      <Navigate
        to="/Customer"
        state={{
          team: contextMenu.team,
          timeStart: finalSelection?.start,
          timeEnd: finalSelection?.end,
          selectedTeam: contextMenu.team,
          selectedDate: selectedDate,
          newCustomerId: currentSelection.customerId,
          newContractId: currentSelection.contractId
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
