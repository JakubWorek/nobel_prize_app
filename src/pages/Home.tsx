import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Prize } from '../interfaces/PrizeInterface';
import Select, { SelectChangeEvent } from '@mui/material/Select'
import {  Box, MenuItem, FormControl, FormControlLabel, 
          FormLabel, InputLabel, Button, RadioGroup, Radio } 
from '@mui/material';

export default function Home() {
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [availableYears, setAvailableYears] = useState<string[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      return await fetch('https://api.nobelprize.org/2.1/nobelPrizes')
                      .then(response => response.json())
                      .then(data => data.nobelPrizes)
    };

    fetchData()
      .then((data: Prize[]) => {
        setAvailableYears(Array.from(new Set(data.map(prize => prize.awardYear))));
      })
      .catch(error => console.log(error));
  }, [])

  const handleYearChange = (event : SelectChangeEvent ) => {
    setSelectedYear(event.target.value as string);
  };

  const handleLanguageChange = (event : any) => {
    setSelectedLanguage(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate(`/nagrody/${selectedLanguage}/${selectedYear}`);
  }

  return (
    <Box sx={{ minWidth: 120, padding: 2, borderRadius: 2, boxShadow: 5, display: "flex-row", justifyContent: "center", alignItems: "center" }} >
      <h1>🏆 Nobel Prize App 🏆</h1>
      <Box sx={{ minWidth: 120, gap:1 }} component="form" onSubmit={handleSubmit}>
        <FormControl fullWidth>
          <InputLabel id="year-label">Select year</InputLabel>
          <Select 
            onChange={handleYearChange}
            labelId="year-label"
            id="year-select"
            value={selectedYear}
            label="Select year"
          >
            {availableYears.map(year => (
              <MenuItem key={year} value={year}>{year}</MenuItem>
            ))}
          </Select>
          <FormLabel id="language-label">Select language</FormLabel>
          <RadioGroup 
            onChange={handleLanguageChange} 
            row
            aria-labelledby="language-label"
            value={selectedLanguage}
            
          > 
            <FormControlLabel value="en" control={<Radio />} label="English" />
            <FormControlLabel value="no" control={<Radio />} label="Norwegian" />
            <FormControlLabel value="se" control={<Radio />} label="Swedish" />
          </RadioGroup>
          <Button disabled={selectedYear === "" || selectedLanguage === ""} variant="contained" type="submit" >Search for prizes</Button>
        </FormControl>
      </Box>
    </Box>
  )
}