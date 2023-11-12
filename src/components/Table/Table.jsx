import React, { useEffect, useState } from "react"
import { useParams } from 'react-router-dom';

export default function Table() {
  const { year } = useParams();
  const { language } = useParams();
  const [nobelPrizesForYear, setNobelPrizesForYear] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
        const response = await fetch(`https://api.nobelprize.org/2.1/nobelPrizes?nobelPrizeYear=${year}`);
        const data = await response.json();
        setNobelPrizesForYear(data.nobelPrizes);
    };

    fetchData();
  }, [year]);

  return (
    <div className="container">
      <div className="header">
        <h1>Nobel prizes for year {year}</h1>
      </div>
      <div className="content">
        <table>
          <thead>
            <tr>
              <td>Year</td>
              <td>Category</td>
              <td>Date</td>
              <td>Prize</td>
            </tr>
          </thead>
          <tbody>
            {nobelPrizesForYear.map(prize => {
                if (!prize.dateAwarded) {
                    return (
                        <tr key={prize.id}>
                            <td>{prize.awardYear}</td>
                            <td>{prize.category.en}</td>
                            <td>N/A</td>
                            <td>{prize.prizeAmount.toLocaleString()}</td>
                        </tr>
                    );
                }

                let dateAwarded = new Date(prize.dateAwarded);
                let year = dateAwarded.getFullYear();
                let month = dateAwarded.getMonth() + 1;
                let day = dateAwarded.getDate();

                let formattedDateAwarded =  day.toString().padStart(2, '0') + '.' + 
                                            month.toString().padStart(2, '0') + '.' + 
                                            year.toString();

                return (
                    <tr key={prize.id}>
                        <td>{prize.awardYear}</td>
                        <td>{prize.category[language]}</td>
                        <td>{formattedDateAwarded}</td>
                        <td>{prize.prizeAmount.toLocaleString()}</td>
                    </tr>
                );
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}