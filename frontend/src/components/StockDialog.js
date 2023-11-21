import React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

const StockDialog = (props) => {
  const { open, setOpen } = props;
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

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle style={{ fontSize: "1.8rem", display: "flex", justifyContent: "center", marginBottom: "10px" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{shortName} - {symbol}</span>
        </div>
      </DialogTitle>
      <DialogContent>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr style={{ borderBottom: "1px solid #ddd" }}>
              <th style={{ color: "rgb(17, 0, 107)", padding: "8px" }}>Current Price:</th>
              <td style={{ padding: "8px" }}>
                <span className="font-bold">{currentPrice} USD</span>
              </td>
            </tr>
            <tr style={{ borderBottom: "1px solid #ddd" }}>
              <th style={{ color: "rgb(17, 0, 107)", padding: "8px" }}>High/Low:</th>
              <td style={{ padding: "8px" }}>
                <span className="font-bold">
                  {dayHigh}/{dayLow.toFixed(2)}
                </span>
              </td>
            </tr>
            <tr style={{ borderBottom: "1px solid #ddd" }}>
              <th style={{ color: "rgb(17, 0, 107)", padding: "8px" }}>Market Capitalization:</th>
              <td style={{ padding: "8px" }}>
                <span className="font-bold">{`${convertToBillion(marketCap)}`}</span>
              </td>
            </tr>
            <tr style={{ borderBottom: "1px solid #ddd" }}>
              <th style={{ color: "rgb(17, 0, 107)", padding: "8px" }}>Total Revenue:</th>
              <td style={{ padding: "8px" }}>
                <span className="font-bold">{`${convertToBillion(totalRevenue)}`}</span>
              </td>
            </tr>
            <tr style={{ borderBottom: "1px solid #ddd" }}>
              <th style={{ color: "rgb(17, 0, 107)", padding: "8px" }}>Float Shares:</th>
              <td style={{ padding: "8px" }}>
                <span className="font-bold">{`${convertToBillion(floatShares)}`}</span>
              </td>
            </tr>
            <tr style={{ borderBottom: "1px solid #ddd" }}>
              <th style={{ color: "rgb(17, 0, 107)", padding: "8px" }}>Price to Earnings Ratio:</th>
              <td style={{ padding: "8px" }}>
                <span className="font-bold">{peRatio}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </DialogContent>
      <DialogActions style={{ justifyContent: "space-between", padding: "16px" }}>
        <span style={{ fontSize: "0.8rem", color: "rgb(128, 128, 128)" }}>
          Date: {day} {month}
        </span>
        <Button onClick={handleClose} autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StockDialog;
