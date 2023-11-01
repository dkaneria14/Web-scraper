import './App.css';
import Navbar from "./Navbar";
import StockCards from "./stockCards";
import { Typography, Stack, Chip, TextField, Card } from '@mui/material';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import logo from "./logotest.png"
import axios from 'axios';
import Autocomplete from '@mui/material/Autocomplete';
import { useEffect, useState } from 'react';
import { Route, Routes } from "react-router-dom";


function App() {
 
  const [tempStockList, setTempStockList] = useState([]);
  const [searchStock, setSearchStock] = useState("");
  const [stockInfo, setStockInfo] = useState(null);
  const [flag, setFlag] = useState(false);
  const [tickerList, setTickerList] = useState({});
  
  const apiUrl = "http://127.0.0.1:8000/stockList/";

  const tickerListURL = "http://127.0.0.1:8000/stocklistDB/";

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('stockList'));
    if (items) {
      setTempStockList(items);
    }
    getTickers();
  }, [])

  const getStockData = (name) => {
    axios.get(apiUrl + name)
      .then((response) => {
        if(response.data)
        setStockInfo(response.data);
      setFlag(true);
      })
      .catch((error) => {
        // Handle any errors here
        console.error('Error fetching data:', error);
      });
  }

  const getTickers = () => {
    axios.get(tickerListURL)
      .then((response) => {
        if(response.data) setTickerList(response.data);
      })
      .catch((error) => {
        // Handle any errors here
        console.error('Error fetching data:', error);
      });
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    var temp = [...tempStockList];
    temp.push(searchStock);
    setTempStockList(temp);
    localStorage.setItem('stockList', JSON.stringify(temp));
    // get stock data API GET CALL
    getStockData(searchStock);
  }

  const handleDelete = (item) => {
    var temp = tempStockList.filter(x => x !== item);
    console.log(temp);
    setTempStockList(temp);
    localStorage.setItem('stockList', JSON.stringify(temp));
  }

  const handleClick = (x) => {
    console.info('You clicked the Chip.');
    // getStockData(x);
  };
  
  return (
    <div className="App">
      <Navbar />
      <div className="container">
        <Routes>
          {}
        </Routes>
      </div>
      <header className="App-header">
        {<img src={logo} alt="Logo" width="400" />}
        <p>
          Watch Your Stock Around The Clock
        </p>

        {/* Search Bar */}
        <Paper
          component="form"
          sx={{ p: '2px 20px', display: 'flex', alignItems: 'center', width: 600, height: 60 }}
        >
          <Autocomplete
            freeSolo
            id="ticker-search-autocomplete"
            options={Object.keys(tickerList).map(key => `${key} - ${tickerList[key]}`)}
            sx={{ ml: 1, flex: 1 }}
            renderInput={(params) =>
              <TextField
                {...params}
                focused={false}
                variant="standard"
                InputProps={{
                  ...params.InputProps,
                  disableUnderline: true,
                  style: { fontSize: '25px', outline: 'none' }
                }}
                onSelect={(e) => setSearchStock(e.target.value.split(" ")[0])}
                // // sx={{ ml: 1, flex: 1 }}
                placeholder="Search Stocks"
                value={searchStock}
              // variant="standard"
              // onChange={(e) => setSearchStock(e.target.value)}
              // InputProps={{
              //   disableUnderline: true,
              //   style: { fontSize: '25px' }
              // }}
              />
            }
          />
          <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={handleSubmit}>
            <SearchIcon fontSize="large" />
          </IconButton>
        </Paper>
        <Stack direction="row" spacing={1} margin="15px">
          {
            tempStockList.map((x) => {
              return (
                <Chip
                key={x}
                  label={x} color="primary"
                  onClick={handleClick(x)}
                  onDelete={(e) => handleDelete(x)}
                />
              )
            })
          }
        </Stack>
        <Typography sx={{ mt: 3 }} align='center' color='black' variant="h6">The text below will display the API response in json format.</Typography>
        <StockCards>
          <div className="container">
            <Routes>
              {}
            </Routes>
          </div>
     </StockCards>
        
      </header>
    </div>
  );
 
  
}

export default App;
