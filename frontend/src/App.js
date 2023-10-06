import './App.css';
import { Typography, Stack, Chip, TextField, Card } from '@mui/material';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import logo from "./logotest.png"
import axios from 'axios';
import { useEffect, useState } from 'react';

function App() {

  const [tempStockList, setTempStockList] = useState([]);
  const [searchStock, setSearchStock] = useState("");
  const [stockInfo, setStockInfo] = useState({"test1":"hello", "test2": "hi"});
  // const apiUrl = "";

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('stockList'));
    if (items) {
      setTempStockList(items);
    }
  }, [])

  const handleSubmit = () => {
    var temp = [...tempStockList];
    temp.push(searchStock);
    setTempStockList(temp);
    localStorage.setItem('stockList', JSON.stringify(temp));

    // axios.get(apiUrl)
    //   .then((response) => {
    //     if(response.data)
    //     setStockInfo(response.data);
    //   })
    //   .catch((error) => {
    //     // Handle any errors here
    //     console.error('Error fetching data:', error);
    //   });
  }

  const handleDelete = (item) => {
    var temp = tempStockList.filter(x => x !== item);
    console.log(temp);
    setTempStockList(temp);
    localStorage.setItem('stockList', JSON.stringify(temp));
  }

  const handleClick = () => {
    console.info('You clicked the Chip.');
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} alt="Logo" width="400" />
        <p>
          Buy when it makes sense.
        </p>
        <Paper
          component="form"
          sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
        >
          <TextField
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search Stocks"
            value={searchStock}
            variant="standard"
            onChange={(e) => setSearchStock(e.target.value)}
          />
          <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={handleSubmit}>
            <SearchIcon />
          </IconButton>
        </Paper>
        <Stack direction="row" spacing={1} margin="15px">
          {
            tempStockList.map((x) => {
              return (
                <Chip
                key={x}
                  label={x} color="primary"
                  onClick={handleClick}
                  onDelete={(e) => handleDelete(x)}
                />
              )
            })
          }
        </Stack>
        <Paper>
          {
            JSON.stringify(stockInfo)
          }
        </Paper>
        {/* <Typography sx={{ mt: 3 }} align='center' color='primary' variant="h5">Hana hello to react</Typography> */}
      </header>
    </div>
  );
}

export default App;
