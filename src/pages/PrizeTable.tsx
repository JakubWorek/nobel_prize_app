import React, {useState, useEffect} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {  Table, TableHead, TableBody, TableRow, TableContainer, TableCell, TableSortLabel, 
          Box, Paper, Button} from '@mui/material';

interface Prize {
  awardYear: string,
  category: {
    en: string;
    no: string;
    se: string;
  },
  dateAwarded: string,
  prizeAmount: number
}

const languages = ['en', 'no', 'se'];
type languageType = "en" | "no" | "se";

const validateLanguage = (language: string | undefined) => {return language && languages.includes(language)}
const validateYear = (data: Prize[], year: string | undefined) => {return year && data.map(prize => prize.awardYear).includes(year)}

export default function PrizeTable() {
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [sortCategory, setSortCategory] = useState<boolean>(false);
  const [sortDateAwarded, setSortDateAwarded] = useState<boolean>(false);

  const {language, year} = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      return await fetch('https://api.nobelprize.org/2.1/nobelPrizes')
                      .then(response => response.json())
                      .then(data => data.nobelPrizes)
    };

    fetchData()
      .then( (data: Prize[]) => {
        if (validateLanguage(language) && validateYear(data, year)) {
          setPrizes(data.filter(prize => prize.awardYear === year));
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

  const handleBack = () => {
    navigate('/');
  }

  return (
    <Box sx={{ minWidth: 120, padding: 2, borderRadius: 2, boxShadow: 5, textAlign: "center"}}>
      <h1>Nobel prizes for year {year}</h1>
      <TableContainer component={Paper}>
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
            {prizes.map((prize, id) => (
              <TableRow key={id}>
                <TableCell align="left">{prize.awardYear}</TableCell>
                <TableCell align="right">{prize.category[language as languageType]}</TableCell>
                <TableCell align="right">{prize.dateAwarded?.split("-").reverse().join(".")}</TableCell>
                <TableCell align="right">{prize.prizeAmount.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box component="div" sx={{marginTop: 2}}>
        <Button variant="contained" onClick={handleBack}>Back</Button>
      </Box>
    </Box>
  )
}