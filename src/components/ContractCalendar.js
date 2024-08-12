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
      const [year, month, day] = selectedDate.split('-');
      const dayOfWeek = new Date(selectedDate).getDay(); // 0 (Sunday) through 6 (Saturday)
      console.log(selectedDate);
      console.log(day);
      try {
        const response = await fetch(`http://localhost:5213/api/ContractTimeTeamInfoes/getAllContractsDateWise?date=${selectedDate}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Check if the data is in expected format
        if (Array.isArray(data)) {
          setContractData(data);
        } else {
          console.error('Unexpected data format:', data);
          setContractData([]); // or handle accordingly
        }
      } catch (error) {
        console.error('Error fetching contract data:', error);
        setContractData([]); // or handle accordingly
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
    const ranges = selectedRanges[team] || [];
    const currentTimeIndex = timeSlots.indexOf(time);

    return ranges.some(range => {
      const startTimeIndex = timeSlots.indexOf(range.start);
      const endTimeIndex = timeSlots.indexOf(range.end);

      const minTimeIndex = Math.min(startTimeIndex, endTimeIndex);
      const maxTimeIndex = Math.max(startTimeIndex, endTimeIndex);

      return currentTimeIndex >= minTimeIndex && currentTimeIndex <= maxTimeIndex;
    });
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
                <TableCell key={index}>{team.teamNo}</TableCell> // Update to `team.teamNo`
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
                    onMouseDown={(e) => handleMouseDown(e, time, team.teamNo)} // Update to `team.teamNo`
                    onMouseOver={(e) => handleMouseOver(e, time, team.teamNo)} // Update to `team.teamNo`
                    onContextMenu={(e) => handleContextMenu(e, time, team.teamNo)} // Update to `team.teamNo`
                    data-time={time}
                    data-team={team.teamNo} // Update to `team.teamNo`
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
