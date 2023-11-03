import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Image from '../assets/stockGraphs/AAPL.png';
import Image2 from '../assets/stockGraphs/AMZN.png';
import { Grid } from '@mui/material';

export default function MediaCard() {
  return (
    <div style={{margin: '5%'}}>
    <Grid container spacing={2}>
  <Grid item xs={6} md={6}>
  <Card sx={{ width: 200 }}>
      <CardMedia
        component="img"
        height="90"
        image={Image}
        alt=""
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div" color='gray'>
          Apple Inc
        </Typography>
        <Typography variant="h5" color='black'>
          AAPL 
          $168.22
        </Typography>
        <Typography variant="body1" color='green'>
          +/- $0.54 (+1.19%)
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Expand</Button>
      </CardActions>
    </Card>
  </Grid>
  <Grid item xs={6} md={4}>
  <Card sx={{ width: 200 }}>
      <CardMedia
        component="img"
        height="90"
        image={Image2}
        alt=""
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div" color='gray'>
          Amazon.com, Inc
        </Typography>
        <Typography variant="h5" color='black'>
          AMZN 
          $127.74
        </Typography>
        <Typography variant="body1" color='red'>
          +/- $1.33 (-0.82%)
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Expand</Button>
      </CardActions>
    </Card>
  </Grid>
</Grid>

    </div>

  );
}