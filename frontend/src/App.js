import './App.css';
import { Typography, Stack, Chip } from '@mui/material';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import logo from "./logotest.png"
import { useState } from 'react';

function App() {

  const [tempStockList, setTempStockList] = useState([]);
  const [searchStock, setSearchStock] = useState("");

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
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search Stocks"
            inputProps={searchStock}
          />
          <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Paper>
        <Stack direction="row" spacing={1} margin="15px">
          <Chip
            // label="Clickable Deletable"
            label="Apple Inc." color="primary"
            onClick={handleClick}
          />
          <Chip
            // label="Clickable Deletable"
            label="NVIDIA Corp" color="primary"
            onClick={handleClick}
          />
          <Chip
            // label="Clickable Deletable"
            label="TD Bank" color="primary"
            onClick={handleClick}
          />
          <Chip
            // label="Clickable Deletable"
            label="Microsoft Corp" color="primary"
            onClick={handleClick}
          />
        </Stack>
        {/* <Typography sx={{ mt: 3 }} align='center' color='primary' variant="h5">Hana hello to react</Typography> */}
      </header>
    </div>
  );
}

export default App;
