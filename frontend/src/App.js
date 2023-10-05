import './App.css';
import { Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <Paper
          component="form"
          sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
        >
          
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search Google Maps"
            inputProps={{ 'aria-label': 'search google maps' }}
          />
          <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
            <SearchIcon />
          </IconButton>
          <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
          
        </Paper>
        <Typography sx={{ mt: 3 }} align='center' color='primary' variant="h5">Hana hello to react</Typography>

      </header>
    </div>
  );
}

export default App;
