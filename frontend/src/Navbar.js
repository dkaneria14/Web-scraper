// import { Link, useMatch, useResolvedPath } from "react-router-dom"
import logo1 from "./logotest1.png"
import {TextField, Alert, Snackbar} from '@mui/material';
import { useState } from "react";
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import axios from "axios";
import VerificationModal from './components/VerificationModal';
import apiEndpoint from "./apiEndpoint";

const noStockError = "Error - Please select some stocks below first.";
const emailVerifiedError = "Your email is not yet verified. Please follow verification instructions.";
const emailVerified = "Your email is verified, you may now schedule alerts and thresholds for your stocks";

export default function Navbar(props) {

  const [showStockError, showError] = useState(false);
  const [errorMessage, setErrorMsg] = useState(noStockError);
  const [verify, setVerify] = useState(false);
  const [signUpEmail, setEmail] = useState("");
  const verificationEndpoint =  apiEndpoint + "/email/verified/";

  const signUp = (event) => {
    event.preventDefault();
    if (props.selectedStocks.length === 0) return showError(true);
    // Otherwise check if email is verified or not before proceeding to Modal
    console.log(verificationEndpoint + signUpEmail);
    axios.get(verificationEndpoint + signUpEmail)
      .then((response) => {
        if(response.data) {
          setErrorMsg(emailVerified);
          showError(true);
        } else {
          setErrorMsg(emailVerifiedError);
          showError(true);
          setVerify(true);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }

  const handleClose = () => {
    showError(false);
  }
  
  const createVerifyModal = () => {
    return <VerificationModal setVerify={setVerify} email={signUpEmail}></VerificationModal>;
  };

  return (
    <div className="nav">
      <img src={logo1} alt="Logo" width="60" height="60" style={{ marginLeft: 10 }} />
      <Paper
        component="form"
        sx={{
          p: "10px 15px",
          display: "flex",
          alignItems: "center",
          width: 400,
          marginLeft: "auto",
          mr: 3,
          height: 40,
        }}
        onSubmit={signUp}
      >
        <TextField
          sx={{ ml: 1, flex: 1 }}
          placeholder="Sign up for Email Alerts"
          value={signUpEmail}
          variant="standard"
          type="email"
          required
          InputProps={{
            disableUnderline: true,
          }}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button variant="contained" type="submit">
          SignUp
        </Button>
      </Paper>
      <Snackbar open={showStockError} autoHideDuration={1500} onClose={handleClose} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert onClose={handleClose} severity={errorMessage === emailVerified ? "success" : "error"} sx={{ width: "100%" }}>{errorMessage}</Alert>
      </Snackbar>
      {verify ? createVerifyModal() : null}
    </div>
  );
}


