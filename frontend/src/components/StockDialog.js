import React, { useState, useEffect } from "react";
import { Threshold } from "./threshold";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import apiEndpoint from "../apiEndpoint";
import axios from "axios";

const StockDialog = (props) => {
  const { open, setOpen, user, onClick } = props;
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
    dayLow,
    threshold,
    isAbove,
  } = props.stockInfo;

  const [updateUserStock, setUpdateUserStock] = useState({});
  const [isAboveValue, setIsAbove] = useState(isAbove == false ? false : true);
  const [thresholdValue, setThreshold] = useState(threshold || 0);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({});
  const [openAlert, setOpenAlert] = useState(false);

  // endpoints
  const postUserStock = apiEndpoint + "/insertList/";

  // static labels for button
  // const DialogButtonLabel = {
  //   saveAndAdd: { label: "Save and Add", disabled: false },
  //   save: { label: "Save Changes", disabled: false },
  //   register: { label: "Sign In", disabled: true },
  // };

  const alerts = {
    updated: {
      type: "success",
      msg: "Your changes have been saved successfully!",
    },
    added: {
      type: "success",
      msg: "This Stock has been added to your watchlist!",
    },
    error: {
      type: "error",
      msg: "Error processing request. Try again later.",
    },
  };

  const getCurrentDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");

    return `${year}/${month}/${day}`;
  };

  const handleThresholdIsAboveChange = () => {
    var newStockData = {
      name: symbol,
      threshold: thresholdValue,
      isAbove: isAboveValue,
      date: getCurrentDate(),
    };

    var newStockList = [newStockData];

    var newUpdatedObj = {
      email: user,
      stockList: newStockList,
    };
    return newUpdatedObj;
  };

  useEffect(() => {
    setUpdateUserStock({
      email: user,
      stockList: [
        {
          name: symbol,
          threshold: thresholdValue,
          isAbove: isAboveValue,
          date: getCurrentDate(),
        },
      ],
    });
  }, []);

  useEffect(() => {
    setUpdateUserStock(handleThresholdIsAboveChange());
  }, [thresholdValue, isAboveValue]);

  const handleDialogSubmit = () => {
    var payload = handleThresholdIsAboveChange();
    setUpdateUserStock(payload);
    // console.log(payload)

    setLoading(true);
    axios
      .post(postUserStock, payload)
      .then((response) => {
        // Handle the response data
        console.log("Response:", response.data);
        setAlert(alerts.added);
      })
      .catch((error) => {
        // Handle errors
        console.error("Error:", error);
        setAlert(alerts.error);
      })
      .finally(() => {
        setLoading(false);
        setOpenAlert(true);
        // setOpen(false);
      });
  };

  // Close Dialog
  const handleClose = () => {
    setOpen(false);
    onClick();
  };

  // Close Dialog
  const handleCloseAlert = () => {
    setOpenAlert(false);
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
        <Card sx={{ borderRadius: "1em", height: "100%" }}>
          <CardContent>
            <Typography
              variant="p"
              fontWeight="bold"
              sx={{ color: "text.secondary" }}
            >
              {title}
            </Typography>
            <Typography variant="body1">{value}</Typography>
          </CardContent>
        </Card>
      </Grid>
    );
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle
        style={{
          fontSize: "1.8rem",
          display: "flex",
          justifyContent: "center",
        }}
        sx={{ bgcolor: "background.default" }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            {shortName} - {symbol}
          </span>
        </div>
      </DialogTitle>
      <DialogContent sx={{ bgcolor: "background.default" }}>
        <Grid
          container
          spacing={1}
          justifyContent="center"
          alignContent="center"
        >
          {stockDialogInfo("Current Price:", `${currentPrice} ${currency}`)}
          {stockDialogInfo("High/Low:", `${dayHigh}/${dayLow.toFixed(2)}`)}
          {stockDialogInfo(
            "Market Capitalization:",
            convertToBillion(marketCap)
          )}
          {stockDialogInfo("Total Revenue:", convertToBillion(totalRevenue))}
          {stockDialogInfo("Float Shares:", convertToBillion(floatShares))}
          {stockDialogInfo("Price to Earnings Ratio:", peRatio)}
          {user && (
            <Grid item>
              <Threshold
                threshold={thresholdValue}
                setThreshold={setThreshold}
                isAbove={isAboveValue}
                setIsAbove={setIsAbove}
                sx={{ bgcolor: "background.default" }}
              />
            </Grid>
          )}
          {!user && (
            <Grid item>
              <Typography>
                Sign in to add this stock to your watchlist.
              </Typography>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions
        style={{ justifyContent: "space-between", padding: "16px" }}
        sx={{ bgcolor: "background.default" }}
      >
        <span style={{ fontSize: "0.8rem", color: "rgb(128, 128, 128)" }}>
          Date: {getCurrentDate()}
        </span>
        <span>
          <Button onClick={handleClose} autoFocus sx={{ m: 1 }}>
            Close
          </Button>
          {user && (
            <Button
              variant="contained"
              type="submit"
              sx={{ m: 1 }}
              onClick={handleDialogSubmit}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={10} /> : <></>}
            >
              Save
            </Button>
          )}
        </span>
      </DialogActions>
      <Snackbar
        open={openAlert}
        autoHideDuration={1500}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alert.type}
          sx={{ width: "100%" }}
        >
          {alert.msg}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default StockDialog;
