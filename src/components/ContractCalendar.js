import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, Menu, MenuItem, TextField } from '@mui/material';
import '../css/ContractCalendar.css';

const ContractCalendar = () => {
  const [dragging, setDragging] = useState(null);
  const [activeSelection, setActiveSelection] = useState(null);
  const [selectedRanges, setSelectedRanges] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [contextMenu, setContextMenu] = useState({ time: null, team: null });
  const [teams, setTeams] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [contractData, setContractData] = useState([]);
  const [selectedDate, setSelectedDate] = useState('2024-08-12'); // Default date

  useEffect(() => {
    // Fetch teams
    const fetchTeams = async () => {
      const response = await fetch('http://localhost:5213/api/Teams');
      const data = await response.json();
      setTeams(data);
    };

    // Fetch time slots
    const fetchTimeSlots = async () => {
      const response = await fetch('http://localhost:5213/api/TimeSlots');
      const data = await response.json();
      setTimeSlots(data.map(slot => slot.time)); // Assuming the time property contains the time string
    };

    // Fetch contract data
    const fetchContractData = async () => {
      try {
        const response = await fetch(`http://localhost:5213/api/ContractTimeTeamInfoes/getAllContractsDateWise?date=${selectedDate}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        const data = result.$values || []; // Access the $values array

        console.log('Fetched contract data:', data);

        // Map the fetched data to the selected ranges
        const ranges = data.reduce((acc, contract) => {
          const { Team, TimeSlot } = contract;
          const teamId = Team?.TeamId;
          const time = TimeSlot?.Time;
          const date = contract.Date;

          if (teamId && time) {
            const teamNo = Team?.TeamNo || teamId;

            // Initialize nested structure if not present
            acc[teamNo] = acc[teamNo] || {};
            acc[teamNo][date] = acc[teamNo][date] || [];
            
            // Collect all times for the team on this date
            if (!acc[teamNo][date].includes(time)) {
              acc[teamNo][date].push(time);
            }
          }
          return acc;
        }, {});

        console.log("Selecting ranges");
        setSelectedRanges(ranges);
      } catch (error) {
        console.error('Error fetching contract data:', error);
        setContractData([]);
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
      setActiveSelection(prev => ({
        ...prev,
        end: time
      }));
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
    const dateRanges = selectedRanges[team] || {};
    const times = Object.values(dateRanges).flat();

    return times.includes(time);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

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
                <TableCell key={index}>{team.teamNo}</TableCell>
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
                    onMouseDown={(e) => handleMouseDown(e, time, team.teamNo)}
                    onMouseOver={(e) => handleMouseOver(e, time, team.teamNo)}
                    onContextMenu={(e) => handleContextMenu(e, time, team.teamNo)}
                    data-time={time}
                    data-team={team.teamNo}
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
          <MenuItem onClick={() => handleMenuClick('cancel')}>Cancel</MenuItem>
        </Menu>
      </TableContainer>
    </Box>
  );
};

export default ContractCalendar;
