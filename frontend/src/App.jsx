import Header from './components/Header';
import ChartArea from './components//Chartarea';
import DataBoxes from './components/DataBoxes';
import { useState } from 'react';
import SearchBar from './components/Searchbar';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const [selectedDate, setSelectedDate] = useState(null); // State to store the selected date

  return (
    <Router>
      <Routes>
        <Route path="/" element ={<Header/>} />
        <Route path="/:symbol" element={<ChartArea />} />
      </Routes>
    </Router>
  );
}

export default App;
