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
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CircularProgress } from '@mui/material';

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
  const [stockInfo, setStockInfo] = useState({});
  const [stockInfoLoaded, setStockInfoLoaded] = useState(false);
  const [tickerList, setTickerList] = useState({});
  
  const tickerAPI = apiEndpoint + "/stockList/";

  const tickerListURL = apiEndpoint + "/stocklistDB/";
  
  useEffect(() => {
    getTickers();
    const selectedTickers = JSON.parse(localStorage.getItem('stockList'));
    if (selectedTickers) {
      setStockInfoLoaded(false);
      setTempStockList(selectedTickers);
      let tickersInfo = {};
      const dataNotFound = [];
      Promise.all(selectedTickers.map(ticker => 
        axios.get(tickerAPI + ticker).then(response => {
          const cardInfo = generateStockCardInfo(response.data);
          if (!cardInfo) {
            return dataNotFound.push(ticker);
          }
          tickersInfo[ticker] = response.data;
          tickersInfo[ticker].cardInfo = cardInfo;
        }).then(() => {
          setStockInfo(Object.assign({}, stockInfo, tickersInfo));
          // Show one stock card and async load remaining stocks so user does not assume indefinite loading for large list of tickers
          setStockInfoLoaded(true);
        })
      )).then(() => {
        if (dataNotFound.length > 0)
          alert(`Data could not be retrieved for the following symbols: ${dataNotFound}. If this is persistent, we recommend removing them from your list.`)
      })
    }
  }, [])

  const getStockData = (name) => {
    axios.get(tickerAPI + name)
      .then((response) => {
        if(response.data) {
          // Stock Card info should be generated when new data fetched rather than running calculations on every render
          const cardInfo = generateStockCardInfo(response.data);
          if (!cardInfo) {
            return window.alert(`Not enough data found for symbol: ${name}. We suggest that you remove it. If this is incorrect, please try again.`);
          }
          setStockInfo(prevStockInfo => {
            prevStockInfo[name] = {...response.data, cardInfo};
            return {...prevStockInfo};
          });
        }
      }).then(() => {if (!stockInfoLoaded) setStockInfoLoaded(true);})
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
    // Avoid nonexistent tickers
    if (!searchStock || !tickerList[searchStock]) return;
    // Avoid duplicate tickers/show user existing ticker
    if (tempStockList.includes(searchStock)) {
      // Ideally here, if the stockcard already exists - scroll to it.
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
    deleteTicker(item);
  }

  const deleteTicker = (ticker) => {
    let temp = tempStockList.filter(x => x !== ticker);
    setTempStockList(temp);
    localStorage.setItem('stockList', JSON.stringify(temp));
  }

  const refreshTicker = (ticker) => {
    // Avoid race condition
    setStockInfo(prevStockInfo => {
      prevStockInfo[ticker].cardInfo.refreshing = true;
      return {...prevStockInfo}
    });
    getStockData(ticker);
  };

  const searchBarSubmit = (e) => {
    e.preventDefault();
    if (tickerList[searchStock]) handleSubmit(e)
  }

  const generateStockCardInfo = (stockInfo) => {
    if (!stockInfo) return null
    const { symbol, shortName, currentPrice, previousClose } = stockInfo;
    // If required properties are not available, do not generate card
    if (!(symbol && shortName && currentPrice && previousClose)) return null;
    const curr = parseFloat(currentPrice).toFixed(2);
    const prev = parseFloat(previousClose);
    const priceChange = (curr - prev).toFixed(2).toString();
    const percentChange = (((curr - prev) / Math.abs(prev)) * 100)
      .toFixed(2)
      .toString();
    const cardInfo = { name: shortName, ticker: symbol, price: curr, priceChange, percentChange, refreshing: false};
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
        <div style={{ overflowY: "scroll", padding: "20px"}}>
          <Grid sx={{ mb: 1}} justifyContent="center" alignItems="center" container item spacing={2} xs={12} md={12}>
          {stockInfoLoaded && stockInfo && tempStockList.length > 0 ? tempStockList.map((ticker) => {
            const stockData = stockInfo[ticker];
            if (!(stockData)) return;
            if (!('cardInfo' in stockData)) return;
            return <StockCard key={ticker} cardInfo={stockData.cardInfo} onClick={refreshTicker}/>
          }): tempStockList.length > 0 && !stockInfoLoaded ? <CircularProgress sx={{ mt: 5}}/> : null}
          </Grid>
          </div>
      </header>
    </div>
    </ThemeProvider>
  );
 
  
}

export default App;
