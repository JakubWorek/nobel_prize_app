import React, {useState, useEffect} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {  Table, TableHead, TableBody, TableRow, TableContainer, TableCell, 
          Box, Paper, Button} from '@mui/material';

interface Prize {
  awardYear: string,
  categoryFullName: {
    en: string;
    no: string;
    se: string;
  },
  dateAwarded: string,
  prizeAmount: number
}

export default function PrizeTable() {
  return (
    <div>
      <h1>Table</h1>
    </div>
  )
}