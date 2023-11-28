import "./App.css";
import Navbar from "./Navbar";
import StockCard from "./components/StockCard";
import {
  Typography,
  Stack,
  Chip,
  TextField,
  Skeleton,
  Box,
  Divider,
} from "@mui/material";
import Paper from "@mui/material/Paper";
// Icons
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
// Logos
import wordmark from "./assets/branding/wordmark.png";
import wordmarkWhite from "./assets/branding/wordmark-white.png";
import brandmark from "./assets/branding/brandmark.png";
import brandmarkWhite from "./assets/branding/brandmark-white.png";
import axios from "axios";
import Autocomplete from "@mui/material/Autocomplete";
import { useEffect, useMemo, useState } from "react";
// import { Route, Routes } from "react-router-dom";
import { Grid } from "@mui/material";
import apiEndpoint from "./apiEndpoint";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CircularProgress } from "@mui/material";
import { useLocalStorage } from "./components/useLocalStorage";
import StockDialog from "./components/StockDialog";

const darkModeConstants = {
  dark: { wordmark: wordmarkWhite, brandmark: brandmarkWhite },
  light: { wordmark: wordmark, brandmark: brandmark },
};

function App() {
  const [user, setUser] = useLocalStorage("user", "");
  const [userData, setUserData] = useState({});
  const [userStockNames, setUserStockNames] = useState([]);
  const [suggestedStockNames, setSuggestedStockNames] = useLocalStorage(
    "stockList",
    {}
  );
  const [searchStock, setSearchStock] = useState("");
  const [stockInfo, setStockInfo] = useState({});
  const [stockInfoLoaded, setStockInfoLoaded] = useState(false);
  const [tickerList, setTickerList] = useState({});
  const [darkMode, setDarkMode] = useState("dark");
  const [openDialog, setOpenDialog] = useState(false);
  const [tickerInfo, setTickerInfo] = useState({});

  // Endpoints
  const tickerAPI = apiEndpoint + "/stockList/";
  const tickerListURL = apiEndpoint + "/stocklistDB/";
  const getUserStocks = apiEndpoint + "/getUserSetStockValues/";

  const theme = useMemo(
    () =>
      createTheme({
        typography: {
          fontFamily: `'Quicksand',-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;`,
          fontWeightLight: 400,
          fontWeightRegular: 500,
          fontWeightMedium: 600,
          fontWeightBold: 700,
        },
        palette: {
          mode: darkMode,
        },
      }),
    [darkMode]
  );

  // Get all stocks in user's list from db
  const FetchUserInfo = (email) => {
    axios({
      method: "get",
      url: `${getUserStocks}?email=${email}`,
    })
      .then((response) => {
        // console.log(response.data);
        var list = [];
        if (response.data == null) {
          // console.log("setting");
          setUserStockNames([]);
          loadSelectedStocks(suggestedStockNames);
        } else {
          let list = [];
          // console.log(response.data)
          setUserData(response.data);
          if (
            response.data.stockList.length &&
            response.data.stockList.length > 0
          )
            response.data.stockList.map((x) => {
              list.push(x.name);
              return list;
            });
          setUserStockNames(list);
          loadSelectedStocks(list);
          // console.log(userStockList)
          // console.log(selectedStocksList)
        }
      })
      .catch((error) => {
        // Handle any errors here
        console.error("Error fetching user info:", error);
      });
  };

  useEffect(() => {
    if (!user) {
      setUserStockNames([]);
      loadSelectedStocks(suggestedStockNames);

      // FetchUserInfo(user);
    }

    if (user) {
      // deleteTickers()
      FetchUserInfo(user);
      loadSelectedStocks(userStockNames);
    }
  }, [user]);

  useEffect(() => {
    getTickers().then(() => {
      // get dropdown list of stocks
      loadSelectedStocks(suggestedStockNames); // load stock info for all suggested stocks from local storage
    });
  }, []);

  // Load stock info for stocks in local storage
  const loadSelectedStocks = (names) => {
    if (names) {
      setStockInfoLoaded(false);
      var dataNotFound = [];
      Promise.all(
        Object.values(names).map((ticker) =>
          axios.get(tickerAPI + ticker).then((response) => {
            if (response.data) {
              var cardInfo = generateStockCardInfo(response.data);
              if (!cardInfo) {
                return dataNotFound.push(ticker);
              }
                            setStockInfo((prevStockInfo) => {
                prevStockInfo[ticker] = { ...response.data, cardInfo};
                return { ...prevStockInfo };
              });
            }
          })
        )
      ).then(() => {
        // Show one stock card and async load remaining stocks so user does not assume indefinite loading for large list of tickers
        setStockInfoLoaded(true);
        if (dataNotFound.length > 0) {
          const removeTickersFromSelected = window.confirm(
            `Data could not be retrieved for the following symbols: ${dataNotFound}. If this is persistent, we recommend removing them from your list. Do you want to remove them?`
          );
          if (removeTickersFromSelected) deleteTickers(dataNotFound);
        }
      });
    }
  };

  // Get All stocks Tickers
  const getTickers = () => {
    return axios
      .get(tickerListURL)
      .then((response) => {
        if (response.data) setTickerList(response.data);
        // console.log(response.data);
      })
      .catch((error) => {
        // Handle any errors here
        console.error("Error fetching data:", error);
      });
  };

  // Handle search submit button
  const handleSubmit = (event) => {
    event.preventDefault();

    // Avoid nonexistent tickers, Avoid duplicate tickers/show user existing ticker
    // Ideally here, if the stockcard already exists - scroll to it.
    if (
      !searchStock ||
      !tickerList[searchStock] ||
      suggestedStockNames[searchStock]
    )
      return;

    setSuggestedStockNames((prevSelectedStocks) => {
      const updatedSelectedStocks = {
        ...prevSelectedStocks,
        [searchStock]: searchStock,
      };
      // localStorage.setItem("stockList", JSON.stringify(updatedSelectedStocks));
      return updatedSelectedStocks;
    });
    // get stock data API GET CALL
    loadSelectedStocks([searchStock]);
    setSearchStock("");
  };

  // handle on delete stock
  const handleDelete = (item) => {
    const confirmed = window.confirm(
      `Confirm removing ${item} from selected stocks?`
    );
    if (!confirmed) return;
    deleteTickers([item]);
  };

  // Delete stock from suggested list
  const deleteTickers = (tickers) => {
    setSuggestedStockNames((prevSelectedStocks) => {
      const updatedSelectedStocks = { ...prevSelectedStocks };
      tickers.forEach((ticker) => {
        delete updatedSelectedStocks[ticker];
      });
      // localStorage.setItem("stockList", JSON.stringify(updatedSelectedStocks));
      return updatedSelectedStocks;
    });
  };

  // Refresh stock info - fetch again
  const refreshTicker = (ticker) => {
    // Avoid race condition
    setStockInfo((prevStockInfo) => {
      prevStockInfo[ticker].cardInfo.refreshing = true;
      return { ...prevStockInfo };
    });
    loadSelectedStocks([ticker]);
  };

  // Handle chip click submit
  const handleChipClick = (ticker) => {
    // e.preventDefault();
    refreshTicker(ticker);
    setTickerInfo(stockInfo[ticker]);
    // console.log(stockInfo[ticker]);
    setOpenDialog(true);
  };

  // Generate Stock Card Info
  const generateStockCardInfo = (stockInfo) => {
    if (!stockInfo) return null;
    const { symbol, shortName, currentPrice, previousClose } = stockInfo;
    // If required properties are not available, do not generate card
    if (!(symbol && shortName && currentPrice && previousClose)) return null;

    // console.log(userData);
    const curr = parseFloat(currentPrice).toFixed(2);
    const prev = parseFloat(previousClose);
    const priceChange = (curr - prev).toFixed(2).toString();
    const percentChange = (((curr - prev) / Math.abs(prev)) * 100)
      .toFixed(2)
      .toString();
    const cardInfo = {
      name: shortName,
      ticker: symbol,
      price: curr,
      priceChange,
      percentChange,
      refreshing: false,
          };
    return cardInfo;
  };

  const generateSkeletons = (numSkeletons) => {
    const skeletons = [];
    for (let i = 0; i < numSkeletons; i++) {
      skeletons.push(
        <Skeleton
          key={`skeleton-${i}`}
          variant="rounded"
          sx={{ borderRadius: "1em" }}
          width={200}
          height={295}
        />
      );
      if (i === Math.floor(numSkeletons / 2) - 1) {
        skeletons.push(
          <Stack
            key="skeleton-stack"
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <CircularProgress sx={{ mt: 5 }} />
            <Typography
              sx={{ mt: 3 }}
              align="center"
              color="text.primary"
              variant="h6"
            >
              Fetching data for selected stocks...
            </Typography>
          </Stack>
        );
      }
    }
    return skeletons;
  };

  const selectedStocksList = Object.values(suggestedStockNames);

  return (
    <ThemeProvider theme={theme}>
      <Box className="App" sx={{ bgcolor: "background.default" }}>
        <Navbar
          user={user}
          setUser={setUser}
          suggestedStockNames={suggestedStockNames}
          brandmark={darkModeConstants[darkMode].brandmark}
          sx={{ bgcolor: "background.default" }}
        />
        <Box className="App-header" sx={{ bgcolor: "background.default" }}>
          <IconButton
            sx={{ ml: 1 }}
            onClick={() =>
              setDarkMode((prevMode) =>
                prevMode === "light" ? "dark" : "light"
              )
            }
          >
            {theme.palette.mode === "dark" ? (
              <Brightness7Icon />
            ) : (
              <Brightness4Icon />
            )}
          </IconButton>
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignContent="center"
          >
            <Grid item xs={11} sm={8} md={6} lg={3} xl={3}>
              <img
                src={darkModeConstants[darkMode].wordmark}
                alt="StockWatch Logo"
                width="100%"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography align="center" variant="p" color="text.primary">
                Watch Your Stock Around The Clock
              </Typography>
            </Grid>
            {/* Search Bar */}
            <Grid item xs={10} md={6} lg={6} xl={5}>
              <Paper
                component="form"
                onSubmit={handleSubmit}
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
                  sx={{ ml: 1, width: "100%" }}
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
                      onSelect={(e) =>
                        setSearchStock(e.target.value.split(" ")[0])
                      }
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
          <Stack
            sx={{ width: "80%", flexWrap: "wrap" }}
            direction="row"
            spacing={1}
            rowGap={1}
            margin="15px"
            justifyContent="center"
          >
            {selectedStocksList.length > 0 ? (
              <Typography
                sx={{ mt: 3 }}
                align="center"
                color="text.primary"
                variant="h5"
              >
                Suggested Stocks:
              </Typography>
            ) : null}
            {selectedStocksList.map((ticker) => {
              return (
                <Chip
                  key={ticker}
                  label={ticker}
                  color="primary"
                  onClick={() => {
                    if (stockInfo[ticker] && stockInfo[ticker].cardInfo)
                      handleChipClick(ticker);
                  }}
                  onDelete={(e) => handleDelete(ticker)}
                />
              );
            })}
          </Stack>
          {!stockInfoLoaded && (
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing={2}
            >
              {generateSkeletons(2)}
            </Stack>
          )}
          {stockInfoLoaded && (
            <>
              <div style={{ padding: "20px", width: "70%" }}>
                <Grid
                  sx={{ mb: 1 }}
                  justifyContent="center"
                  alignItems="center"
                  container
                  item
                  spacing={2}
                  xs={12}
                  md={12}
                >
                  {stockInfo &&
                    selectedStocksList.length > 0 &&
                    selectedStocksList.map((ticker) => {
                      const stockData = stockInfo[ticker];
                      if (!stockData) return null;
                      if (!("cardInfo" in stockData)) return null;
                      return (
                        <StockCard
                          key={ticker}
                          user={user}
                          stockData={stockData}
                          onClick={refreshTicker}
                        />
                      );
                    })}
                </Grid>
              </div>
              {stockInfo && userStockNames.length > 0 && (
                <div style={{ padding: "20px", width: "70%" }}>
                  <Divider
                    style={{
                      display: "flex",
                      alignItems: "left",
                      paddingBottom: "40px",
                    }}
                  >
                    <Typography
                      color="text.primary"
                      variant="p"
                      style={{ alignItems: "left" }}
                    >
                      My Watch List
                    </Typography>
                  </Divider>
                  <Grid
                    sx={{ mb: 1 }}
                    justifyContent="center"
                    alignItems="center"
                    container
                    item
                    spacing={2}
                    xs={12}
                    md={12}
                  >
                    {userStockNames.map((ticker) => {
                      const stockData = stockInfo[ticker];
                      if (!stockData) return null;
                      if (!("cardInfo" in stockData)) return null;
                      let foundObj = userData.stockList.find(obj => obj.name == ticker);
                      let userStockData = {...stockData, threshold: foundObj.threshold, isAbove: foundObj.isAbove}
                      return (
                        <StockCard
                          key={ticker}
                          user={user}
                          stockData={userStockData}
                          onClick={refreshTicker}
                        />
                      );
                    })}
                    {!stockInfoLoaded && (
                      <Stack
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        spacing={2}
                      >
                        {generateSkeletons(2)}
                      </Stack>
                    )}
                  </Grid>
                </div>
              )}
            </>
          )}
        </Box>
        {openDialog && tickerInfo ? (
          <StockDialog
            open={openDialog}
            user={user}
            setOpen={setOpenDialog}
            tickerInfo={tickerInfo}
          />
        ) : null}
      </Box>
    </ThemeProvider>
  );
}

export default App;
