import React from "react";
import {Threshold} from './threshold'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

const StockDialog = (props) => {

    const { open, setOpen } = props;
    const { shortName, symbol, currency, marketCap, totalRevenue, floatShares, peRatio, currentPrice, dayHigh, dayLow } = props.stockInfo;

    // Close Dialog
    const handleClose = () => {
        setOpen(false);
    };

    // Threshold Change function

    // Save button Function

    // const convertToPascalCaseSpaced = (camelCase) => {
    //     const spacedString = camelCase.replace(/([A-Z])/g, ' $1');
    //     return `${spacedString.charAt(0).toUpperCase()}${spacedString.slice(1)}`;
    // }
  
    const convertToBillion = (number) => {
      return (number / 1000000000).toFixed(2);
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
        >
            <DialogTitle> {shortName} - {symbol}
            </DialogTitle>
            <DialogContent>
              <ul>
                <b style={{ color: "rgb(17, 0, 107)" }}>
                    Curreny:
                </b>{" "}
                <span className="font-bold">
                {currency}
              </span>
              </ul>
              <ul>
                <b style={{ color: "rgb(17, 0, 107)" }}>
                    Current Price:
                </b>{" "}
                <span className="font-bold">
                {currentPrice}
              </span>
              </ul>
              <ul>
                <b style={{ color: "rgb(17, 0, 107)" }}>
                    High/Low:
                </b>{" "}
                <span className="font-bold">
                {dayHigh}/{dayLow.toFixed(2)}
              </span>
              </ul>
              <ul>
                <b style={{ color: "rgb(17, 0, 107)" }}>
                    Market Capitalization:
                </b>{" "}
                <span className="font-bold">
                {`${convertToBillion(marketCap)}B`}
              </span>
              </ul>
              <ul>
                <b style={{ color: "rgb(17, 0, 107)" }}>
                    Total Revenue:
                </b>{" "}
                <span className="font-bold">
                {`${convertToBillion(totalRevenue)}B`}
              </span>
              </ul> 
              <ul>
                <b style={{ color: "rgb(17, 0, 107)" }}>
                    Float Shares:
                </b>{" "}
                <span className="font-bold">
                {`${convertToBillion(floatShares)}B`}
              </span>
              </ul> 
              <ul>
                <b style={{ color: "rgb(17, 0, 107)" }}>
                    Price to Earnings Ratio:
                </b>{" "}
                <span className="font-bold">
                {peRatio}
              </span>
              </ul> 
            </DialogContent>
            <Threshold />
            <DialogActions>
                <Button onClick={handleClose} autoFocus>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default StockDialog;