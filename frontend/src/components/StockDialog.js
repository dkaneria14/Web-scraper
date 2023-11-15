import React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText } from "@mui/material";

const StockDialog = (props) => {

    const { open, setOpen } = props;
    const { shortName, symbol, ...remainingStockInfo } = props.stockInfo;

    // Close Dialog
    const handleClose = () => {
        setOpen(false);
    };

    // Threshold Change function

    // Save button Function

    const convertToPascalCaseSpaced = (camelCase) => {
        const spacedString = camelCase.replace(/([A-Z])/g, ' $1');
        return `${spacedString.charAt(0).toUpperCase()}${spacedString.slice(1)}`;
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
        >
            <DialogTitle> {shortName} - {symbol}
            </DialogTitle>
            <DialogContent>
          {/* Placeholder content - flat objects */}
          {Object.keys(remainingStockInfo).map((infoKey) => {
            const info = remainingStockInfo[infoKey];
            return !(typeof info === "object" && info !== null) ? (
              <DialogContentText key={`${symbol}-${infoKey}`}>
                <b style={{ color: "rgb(17, 0, 107)" }}>
                  {convertToPascalCaseSpaced(infoKey)}:
                </b>{" "}
                {remainingStockInfo[infoKey]}
                <br />
              </DialogContentText>
            ) : null;
          })}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} autoFocus>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default StockDialog;