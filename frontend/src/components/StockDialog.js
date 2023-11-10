import React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText } from "@mui/material";

const StockDialog = (props) => {

    const { open, setOpen } = props;

    // Close Dialog
    const handleClose = () => {
        setOpen(false);
    };

    // Threshold Change function

    // Save button Function


    return (
        <Dialog
            open={open}
            onClose={handleClose}
        >
            <DialogTitle> Dialog Title Text
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Any content info will be diaplayed here.
                </DialogContentText>
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