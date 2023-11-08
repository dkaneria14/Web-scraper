import './App.css';
import Navbar from "./Navbar";
import StockCard from "./components/StockCard";
import { Typography, Stack, Chip, TextField, Card } from '@mui/material';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import logo from "./logotest.png"
import axios from 'axios';
import Autocomplete from '@mui/material/Autocomplete';
import { useEffect, useState } from 'react';
import { Route, Routes } from "react-router-dom";
import { Grid } from "@mui/material";
import apiEndpoint from './apiEndpoint';
import { CircularProgress } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    "fontFamily": `'Quicksand',-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;`,
    "fontWeightLight": 400,
    "fontWeightRegular": 500,
    "fontWeightMedium": 600,
    "fontWeightBold": 700,
   }
});

function App() {
 
  const [tempStockList, setTempStockList] = useState([]);
  const [searchStock, setSearchStock] = useState("");
  const [stockInfo, setStockInfo] = useState(null);
  const [stockInfoLoaded, setStockInfoLoaded] = useState(false);
  const [tickerList, setTickerList] = useState({});
  
  const tickerAPI = apiEndpoint + "/stockList/";

  const tickerListURL = apiEndpoint + "/stocklistDB/";

  useEffect(() => {
    getTickers();
  }, [])

  useEffect(() => {
    const selectedTickers = JSON.parse(localStorage.getItem('stockList'));
    if (selectedTickers) {
      setTempStockList(selectedTickers);
      let tickersInfo = {};
      Promise.all(selectedTickers.map(ticker => 
        axios.get(tickerAPI + ticker).then(response => {
          tickersInfo[ticker] = response.data;
        }).then((responses) => {
          setStockInfo(Object.assign({}, stockInfo, tickersInfo));
        })
      )).then(() => setStockInfoLoaded(true))
    }
  }, [])

  const getStockData = (name) => {
    axios.get(tickerAPI + name)
      .then((response) => {
        if(response.data) {
          let temp = {...stockInfo};
          temp[name] = response.data;
          setStockInfo(temp);
        }
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
    // Avoid duplicates
    if (!searchStock || tempStockList.includes(searchStock)) {
      return;
    }
    var temp = [...tempStockList];
    temp.push(searchStock);
    setTempStockList(temp);
    localStorage.setItem('stockList', JSON.stringify(temp));
    // get stock data API GET CALL
    getStockData(searchStock);
  }

  const handleDelete = (item) => {
    const confirmed = window.confirm(`Confirm removing ${item} from selected stocks?`);
    if (!confirmed) return;
    var temp = tempStockList.filter(x => x !== item);
    setTempStockList(temp);
    localStorage.setItem('stockList', JSON.stringify(temp));
  }

  const refreshTicker = (ticker) => {
    getStockData(ticker);
  };

  const searchBarSubmit = (e) => {
    e.preventDefault();
    if (tickerList[searchStock]) handleSubmit(e)
  }

  const generateStockCardInfo = (ticker) => {
    if (!stockInfo[ticker]) return null
    const { symbol, shortName, currentPrice, previousClose } = stockInfo[ticker];
    // If required properties are not available, do not generate card
    if (!(symbol && shortName && currentPrice && previousClose)) return null;
    const curr = parseFloat(currentPrice).toFixed(2);
    const prev = parseFloat(previousClose);
    const priceChange = (curr - prev).toFixed(2).toString();
    const percentChange = (((curr - prev) / Math.abs(prev)) * 100)
      .toFixed(2)
      .toString();
    const cardInfo = { name: shortName, ticker: symbol, price: curr, priceChange, percentChange};
    return cardInfo;
  };

  return (
    <ThemeProvider theme={theme}>
    <div className="App">
      <Navbar selectedStocks={tempStockList} />
      <div className="container">
        <Routes>{}</Routes>
      </div>
      <header className="App-header">
        <img src={logo} alt="Logo" width="400" />
        <p>Watch Your Stock Around The Clock</p>

        {/* Search Bar */}
        <Paper
          component="form"
          onSubmit={searchBarSubmit}
          sx={{
            p: "2px 20px",
            display: "flex",
            alignItems: "center",
            width: 600,
            height: 60,
          }}
        >
          <Autocomplete
            freeSolo
            id="ticker-search-autocomplete"
            options={Object.keys(tickerList).map(
              (key) => `${key} - ${tickerList[key]}`
            )}
            sx={{ ml: 1, flex: 1 }}
            // Always open down and prevent overflow to scroll
            componentsProps={{
              popper: {
                modifiers: [
                  {
                    name: "flip",
                    enabled: false,
                  },
                  {
                    name: "preventOverflow",
                    enabled: true,
                  },
                ],
              },
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                focused={false}
                variant="standard"
                InputProps={{
                  ...params.InputProps,
                  disableUnderline: true,
                  style: { fontSize: "25px", outline: "none" },
                }}
                onSelect={(e) => setSearchStock(e.target.value.split(" ")[0])}
                placeholder="Search Stocks"
                value={searchStock}
              />
            )}
          />
          <IconButton
            type="button"
            sx={{ p: "10px" }}
            aria-label="search"
            onClick={handleSubmit}
          >
            <SearchIcon fontSize="large" />
          </IconButton>
        </Paper>
        <Stack sx={{ width: "80%", flexWrap: "wrap"}} direction="row" spacing={1} rowGap={1} margin="15px">
          {tempStockList.length > 0 ? (
            <Typography
              sx={{ mt: 3 }}
              align="center"
              color="black"
              variant="h6"
            >
              Selected Stocks:
            </Typography>
          ) : null}
          {tempStockList.map((ticker) => {
            return (
              <Chip
                key={ticker}
                label={ticker}
                color="primary"
                onClick={() => refreshTicker(ticker)}
                onDelete={(e) => handleDelete(ticker)}
              />
            );
          })}
        </Stack>
        {/* <Typography sx={{ mt: 3 }} align='center' color='black' variant="h6">The text below will display the API response in json format.</Typography> */}
        <div style={{ overflowY: "scroll", padding: "20px"}}>
          <Grid sx={{ mb: 1}} justifyContent="center" alignItems="center" container item spacing={2} xs={12} md={12}>
          {stockInfoLoaded && stockInfo && tempStockList.length > 0 ? tempStockList.map((ticker) => {
            // Grab Stock Data - This should be refactored into its own function though.
            const cardInfo = generateStockCardInfo(ticker);
            return cardInfo ? <StockCard key={ticker} cardInfo={cardInfo} onClick={refreshTicker}/> : null
          }) : tempStockList.length > 0 ? <CircularProgress sx={{ mt: 5}}/> : null}
          </Grid>
          </div>
      </header>
    </div>
    </ThemeProvider>
  );
 
  
}

export default App;
