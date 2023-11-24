import './App.css';
import Navbar from "./Navbar";
import StockCard from "./components/StockCard";
import { Typography, Stack, Chip, TextField, Skeleton } from '@mui/material';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import logo from "./logotest.png"
import axios from 'axios';
import Autocomplete from '@mui/material/Autocomplete';
import { useEffect, useState } from 'react';
// import { Route, Routes } from "react-router-dom";
import { Grid } from "@mui/material";
import apiEndpoint from './apiEndpoint';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CircularProgress } from '@mui/material';
import { useLocalStorage } from './components/useLocalStorage';

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
 
  const [user, setUser] = useLocalStorage("user", "");

  const [selectedStocks, setSelectedStocks] = useState({});
  const [searchStock, setSearchStock] = useState("");
  const [stockInfo, setStockInfo] = useState({});
  const [stockInfoLoaded, setStockInfoLoaded] = useState(false);
  const [tickerList, setTickerList] = useState({});
  const tickerAPI = apiEndpoint + "/stockList/";

  const tickerListURL = apiEndpoint + "/stocklistDB/";
  
  useEffect(() => {
    getTickers().then(() => {
      loadSelectedStocks();
    });
  }, []);

  const loadSelectedStocks = () => {
    const selectedTickers = JSON.parse(localStorage.getItem('stockList'));
    if (selectedTickers) {
      setStockInfoLoaded(false);
      setSelectedStocks(selectedTickers);
      let tickersInfo = {};
      const dataNotFound = [];
      Promise.all(Object.values(selectedTickers).map((ticker) => 
        axios.get(tickerAPI + ticker).then(response => {
          const cardInfo = generateStockCardInfo(response.data);
          if (!cardInfo) {
            return dataNotFound.push(ticker);
          }
          tickersInfo[ticker] = response.data;
          tickersInfo[ticker].cardInfo = cardInfo;
        }).then(() => {
          setStockInfo(Object.assign({}, stockInfo, tickersInfo));
        })
        )).then(() => {
          // Show one stock card and async load remaining stocks so user does not assume indefinite loading for large list of tickers
          setStockInfoLoaded(true);
          if (dataNotFound.length > 0) {
          const removeTickersFromSelected = window.confirm( `Data could not be retrieved for the following symbols: ${dataNotFound}. If this is persistent, we recommend removing them from your list. Do you want to remove them?` );
          if (removeTickersFromSelected) deleteTickers(dataNotFound);
  }});
    }
  }

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
    return axios.get(tickerListURL)
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
    if (selectedStocks[searchStock]) {
      // Ideally here, if the stockcard already exists - scroll to it.
      return;
    }
    setSelectedStocks((prevSelectedStocks) => {
      const updatedSelectedStocks = { ...prevSelectedStocks, [searchStock]: searchStock };
      localStorage.setItem("stockList", JSON.stringify(updatedSelectedStocks));
      return updatedSelectedStocks;
    });
    // get stock data API GET CALL
    getStockData(searchStock);
  }

  const handleDelete = (item) => {
    const confirmed = window.confirm(`Confirm removing ${item} from selected stocks?`);
    if (!confirmed) return;
    deleteTicker(item);
  }

  const deleteTicker = (ticker) => {
    setSelectedStocks((prevSelectedStocks) => {
      const { [ticker]: _, ...updatedSelectedStocks } = prevSelectedStocks;
      localStorage.setItem("stockList", JSON.stringify(updatedSelectedStocks));
      return updatedSelectedStocks;
    });
  }

  const deleteTickers = (tickers) => {
    setSelectedStocks((prevSelectedStocks) => {
      const updatedSelectedStocks = { ...prevSelectedStocks };
      tickers.forEach((ticker) => {
        delete updatedSelectedStocks[ticker];
      });
      localStorage.setItem("stockList", JSON.stringify(updatedSelectedStocks));
      return updatedSelectedStocks;
    });
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

  const generateSkeletons = (numSkeletons) => {
    const skeletons = [];
    for (let i = 0; i < numSkeletons; i++) {
      skeletons.push(<Skeleton key={`skeleton-${i}`} variant="rounded" sx={{ borderRadius: "1em"}} width={200} height={295} />);
      if (i === Math.floor(numSkeletons/2) - 1) {
        skeletons.push(
          <Stack key="skeleton-stack" direction='column' justifyContent='center' alignItems='center'>
            <CircularProgress sx={{ mt: 5 }} />
            <Typography sx={{ mt: 3 }} align='center' color='black' variant='h6'>
              Fetching data for selected stocks...
            </Typography>
          </Stack>
        );
      }
    }
    return skeletons;
  }

  const selectedStocksList = Object.values(selectedStocks);

  return (
    <ThemeProvider theme={theme}>
    <div className="App">
      <Navbar selectedStocks={selectedStocks} user={user} setUser={setUser} />
      <header className="App-header">
      <Grid container spacing={2} justifyContent='center' alignContent='center'>
        <Grid item xs={11} sm={8} md={6} lg={3} xl={3}>
          <img src={logo} alt="StockWatch Logo" width="100%" />
        </Grid>
        <Grid item xs={12}>
          <Typography align='center' variant='p'>
            Watch Your Stock Around The Clock
          </Typography>
        </Grid>
        {/* Search Bar */}
        <Grid item xs={10} md={6} lg={6} xl={5}>
        <Paper
          component="form"
          onSubmit={searchBarSubmit}
          sx={{
            p: 1,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Autocomplete
            freeSolo
            id="ticker-search-autocomplete"
            options={Object.keys(tickerList).map(
              (key) => `${key} - ${tickerList[key]}`
            )}
            sx={{ ml: 1, width: "100%"}}
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
          </Grid>
        </Grid>
        <Stack sx={{ width: "80%", flexWrap: "wrap" }} direction="row" spacing={1} rowGap={1} margin="15px" justifyContent="center">
          {selectedStocksList.length > 0 ? (
            <Typography
              sx={{ mt: 3 }}
              align="center"
              color="black"
              variant="h5"
            >
              Selected Stocks:
            </Typography>
          ) : null}
          {selectedStocksList.map((ticker) => {
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
        <div style={{padding: "20px"}}>
          <Grid sx={{ mb: 1}} justifyContent="center" alignItems="center" container item spacing={2} xs={12} md={12}>
          {stockInfoLoaded && stockInfo && selectedStocksList.length > 0 ? (selectedStocksList.map((ticker) => {
            const stockData = stockInfo[ticker];
            if (!(stockData)) return null;
            if (!('cardInfo' in stockData)) return null;
            return <StockCard key={ticker} stockData={stockData} onClick={refreshTicker}/>
          })): selectedStocksList.length > 0 && !stockInfoLoaded ? <Stack direction="row" justifyContent='center' alignItems='center' spacing={2}>{generateSkeletons(6)}</Stack> : null}
          </Grid>
          </div>
      </header>
    </div>
    </ThemeProvider>
  );
 
  
}

export default App;
