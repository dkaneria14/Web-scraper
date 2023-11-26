import React from "react";
import {Threshold} from './threshold'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Grid, Card, CardContent } from "@mui/material";

const StockDialog = (props) => {
  const { open, setOpen, userEmail } = props;
  const {
    shortName,
    symbol,
    currency,
    marketCap,
    totalRevenue,
    floatShares,
    peRatio,
    currentPrice,
    dayHigh,
    dayLow
  } = props.stockInfo;
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.toLocaleString("default", { month: "long" });

  // Close Dialog
  const handleClose = () => {
    setOpen(false);
  };

  const convertToBillion = (number) => {
    const absNumber = Math.abs(number);
    if (absNumber >= 1e12) {
      return (number / 1e12).toFixed(2) + "T";
    } else if (absNumber >= 1e9 && absNumber < 1e12) {
      return (number / 1e9).toFixed(2) + "B";
    } else {
      return number.toFixed(2);
    }
  };

  const stockDialogInfo = (title, value) => {
    return (

    <Grid item xs={6}>
      <Card sx={{ borderRadius: "1em", height: "100%" }} >
        <CardContent >
          <Typography variant='p' fontWeight="bold" sx={{color: 'text.secondary'}}>{title}</Typography>
          <Typography variant='body1'>{value}</Typography>
        </CardContent>
      </Card>
      </Grid>);
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle style={{ fontSize: "1.8rem", display: "flex", justifyContent: "center"}} sx={{bgcolor: 'background.default'}}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{shortName} - {symbol}</span>
        </div>
      </DialogTitle>
      <DialogContent sx={{bgcolor: 'background.default'}}>
      <Grid container spacing={1} justifyContent='center' alignContent='center'>
        {stockDialogInfo("Current Price:", `${currentPrice} ${currency}`)}
        {stockDialogInfo("High/Low:", `${dayHigh}/${dayLow.toFixed(2)}`)}
        {stockDialogInfo("Market Capitalization:", convertToBillion(marketCap))}
        {stockDialogInfo("Total Revenue:", convertToBillion(totalRevenue))}
        {stockDialogInfo("Float Shares:", convertToBillion(floatShares))}
        {stockDialogInfo("Price to Earnings Ratio:", peRatio)}
        <Grid item >
          {userEmail ? <Threshold  sx={{bgcolor: 'background.default'}}/> : <Typography>Please Sign in to set thresholds for stocks</Typography>}
        </Grid>
      </Grid>
      </DialogContent>
      <DialogActions style={{ justifyContent: "space-between", padding: "16px"}} sx={{bgcolor: 'background.default'}}>
        <span style={{ fontSize: "0.8rem", color: "rgb(128, 128, 128)" }}>
          Date: {day} {month}
        </span>
        <span>
        <Button onClick={handleClose} autoFocus sx={{ m: 1}}>
          Close
        </Button>
        <Button variant="contained" type="submit" sx={{ m: 1}}>
                Save
        </Button>
        </span>
      </DialogActions>
    </Dialog>
  );
};

export default StockDialog;
