// src/components/ContractCalendar.js
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, Menu, MenuItem, TextField } from '@mui/material';
import '../css/ContractCalendar.css';
import { Navigate } from 'react-router-dom';

const ContractCalendar = () => {
  const [dragging, setDragging] = useState(null);
  const [activeSelection, setActiveSelection] = useState(null);
  const [finalSelection, setFinalSelection] = useState(null);
  const [selectedRanges, setSelectedRanges] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [contextMenu, setContextMenu] = useState({ time: null, team: null });
  const [teams, setTeams] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState('2024-08-12'); // Default date
  const [navigateToCustomer, setNavigateToCustomer] = useState(false); // New state for navigation

  useEffect(() => {
    const token = localStorage.getItem('token');

    // Fetch teams
    const fetchTeams = async () => {
      try {
        const response = await fetch('http://localhost:5213/api/Teams', {
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
      }
    };

    // Fetch time slots
    const fetchTimeSlots = async () => {
      try {
        const response = await fetch('http://localhost:5213/api/TimeSlots', {
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
        setTimeSlots(data.map(slot => slot.time)); // Assuming the time property contains the time string
      } catch (error) {
        console.error('Error fetching time slots:', error);
      }
    };

    // Fetch contract data
    const fetchContractData = async () => {
      try {
        const response = await fetch(`http://localhost:5213/api/ContractTimeTeamInfoes/getAllContractsDateWise?date=${selectedDate}`, {
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

        // Map the fetched data to the selected ranges
        const ranges = data.reduce((acc, contract) => {
          const { teamNo, time } = contract;
          if (teamNo && time) {
            acc[teamNo] = acc[teamNo] || [];
            if (!acc[teamNo].includes(time)) {
              acc[teamNo].push(time);
            }
          }
          return acc;
        }, {});

        setSelectedRanges(ranges);
      } catch (error) {
        console.error('Error fetching contract data:', error);
        setSelectedRanges({});
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
      console.log('MouseOver - Active Selection:', { ...activeSelection, end: updatedEnd });
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
      console.log('Active Selection on CreateContract:', finalSelection);
      //console.log('MouseOver - Active Selection:', { ...activeSelection });

      setNavigateToCustomer(true); // Trigger navigation
    }

    setAnchorEl(null);
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
    console.log('Navigating with:', {
      team: contextMenu.team,
      timeStart: activeSelection?.start,
      timeEnd: activeSelection?.end,
      selectedTeam: contextMenu.team
    });
    return (
      <Navigate
        to="/Customer"
        state={{
          team: contextMenu.team,
          timeStart: finalSelection?.start,
          timeEnd: finalSelection?.end,
          selectedTeam: contextMenu.team
        }}
      />
    );
  }
  
  return (
    <Box>
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
          <MenuItem onClick={() => handleMenuClick('cancel')}>Cancel</MenuItem>
        </Menu>
      </TableContainer>
    </Box>
  );
};

export default ContractCalendar;
