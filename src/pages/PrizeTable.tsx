import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Prize } from '../interfaces/PrizeInterface';
import { fetchData } from '../api/fetchData';
import {  Table, TableHead, TableBody, TableRow, TableContainer, TableCell, TableSortLabel, 
          Box, Paper, Button, FormControl, InputLabel, Input } from '@mui/material';

const languages = ['en', 'no', 'se'];
type languageType = "en" | "no" | "se";

const validateLanguage = (language: string | undefined) => {return language && languages.includes(language)}
const validateYear = (data: Prize[], year: string | undefined) => {return year && data.map(prize => prize.awardYear).includes(year)}

export default function PrizeTable() {
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [sortCategory, setSortCategory] = useState<boolean>(false);
  const [sortDateAwarded, setSortDateAwarded] = useState<boolean>(false);
  const [filterText, setFilterText] = useState<string | undefined>(undefined);

  const {language, year} = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData()
      .then( (data: Prize[]) => {
        if (validateLanguage(language) && validateYear(data, year)) {
          setPrizes(data);
        } else {
          navigate('/');
        }
      })
      .catch(error => console.log(error));
  }, [language, year, navigate])

  const sortByCategory = () => {
    const sortedPrizes = prizes.sort((a, b) => a.category[language as languageType].localeCompare(b.category[language as languageType]))
    setSortCategory(!sortCategory)
    setPrizes(sortCategory ? sortedPrizes.reverse() : sortedPrizes)
  }

  const sortByDateAwarded = () => {
    const sortedPrizes = prizes.sort((a, b) => new Date(a.dateAwarded).getTime() - new Date(b.dateAwarded).getTime())
    setSortDateAwarded(!sortDateAwarded)
    setPrizes(sortDateAwarded ? sortedPrizes.reverse() : sortedPrizes)
  }

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(event.target.value);
  };

  const handleBack = () => {
    navigate('/');
  }

  const filterByCategory = (data: Prize[], category: string | undefined) => {
    if (!category) {
      return data;
    }
    return data.filter(prize => prize.category[language as languageType].toLowerCase().includes(category.toLowerCase()));
  };

  const getDataForTable = (data: Prize[]) => {
    return filterByCategory(data.filter(prize => prize.awardYear === year), filterText);
  }

  const dataForTable = getDataForTable(prizes)

  return (
    <Box sx={{ minWidth: 120, padding: 2, borderRadius: 2, boxShadow: 5, textAlign: "center"}}>
      <h1>Nobel prizes for year {year}</h1>
      <Box component="form" sx={{padding: 2}}>
        <FormControl fullWidth>
          <InputLabel htmlFor="category">Filter by category</InputLabel>
          <Input id="category" value={filterText} onChange={handleFilterChange} />
        </FormControl>
      </Box>
      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableCell align="left">Year</TableCell>
            <TableCell align="right">
                <TableSortLabel active={sortCategory} direction={sortCategory ? 'desc' : 'asc'} onClick={sortByCategory}>
                  Category
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel active={sortDateAwarded} direction={sortDateAwarded ? 'desc' : 'asc'} onClick={sortByDateAwarded}>
                  Date awarded
                </TableSortLabel>
              </TableCell>
            <TableCell align="right">Prize amount</TableCell>
          </TableHead>
          <TableBody>
            {dataForTable.map((prize, id) => (
              <TableRow key={id}>
                <TableCell align="left">{prize.awardYear}</TableCell>
                <TableCell align="right">{prize.category[language as languageType]}</TableCell>
                <TableCell align="right">{prize.dateAwarded ? prize.dateAwarded?.split("-").reverse().join(".") : "N/A"}</TableCell>
                <TableCell align="right">{prize.prizeAmount.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box component="div" sx={{marginTop: 2}}>
        <Button variant="contained" onClick={handleBack} sx={{ boxShadow: 5 }}>Back to home page</Button>
      </Box>
    </Box>
  )
}