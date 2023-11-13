export const fetchData = async () => {
  return await fetch('https://api.nobelprize.org/2.1/nobelPrizes')
                  .then(response => response.json())
                  .then(data => data.nobelPrizes)
};