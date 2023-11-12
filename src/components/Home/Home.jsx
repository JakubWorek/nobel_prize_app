import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import flagEn from "../../assets/images/en.png"
import flagSe from "../../assets/images/se.png"
import flagNo from "../../assets/images/no.png"

export default function Home() {
  const [nobelPrizes, setNobelPrizes] = useState([]);
  const [awardYears, setAwardYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
        const response = await fetch('https://api.nobelprize.org/2.1/nobelPrizes');
        const data = await response.json();
        setNobelPrizes(data.nobelPrizes);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const years = nobelPrizes.map(prize => prize.awardYear);
    setAwardYears([...new Set(years)]);
  }, [nobelPrizes]);

  const handleYearChange = event => {
    setSelectedYear(event.target.value);
  };

  const handleLanguageChange = event => {
    setSelectedLanguage(event.target.value);
  };

  const handleSubmit = () => {
    if (selectedYear) {
      navigate(`/nagrody/${selectedLanguage}/${selectedYear}`);
    }
  }

  return (
    <div className="container">
      <div className="header">
        <h1>
          Nobel Prize App
        </h1>
      </div>
      <div className="content">
        <div className="year">
          <label htmlFor="year">Select year:</label>
          <select id="year" onChange={handleYearChange} value={selectedYear}>
            <option value="">--Please choose an option--</option>
            {awardYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        <div className="language">
          <label htmlFor="language">Select language:</label>
          <div>
            <img src={flagEn} alt="England" onClick={() => handleLanguageChange({ target: { value: 'en' } })} style={{height: 50 + "px"}}/>
            <img src={flagSe} alt="Sweden" onClick={() => handleLanguageChange({ target: { value: 'se' } })} style={{height: 50 + "px"}}/>
            <img src={flagNo} alt="Norway" onClick={() => handleLanguageChange({ target: { value: 'no' } })} style={{height: 50 + "px"}}/>
          </div>
        </div>
        <button onClick={handleSubmit} disabled={!selectedYear || !selectedLanguage}>Wyszukaj nagrody</button>
      </div>
    </div>
  )
}