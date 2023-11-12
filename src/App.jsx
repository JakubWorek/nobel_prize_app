import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home/Home';
import Table from './components/Table/Table';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/nagrody/:language/:year" element={<Table />} />
      </Routes>
    </Router>
  );
}

export default App;
