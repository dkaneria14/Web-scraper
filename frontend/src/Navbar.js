// import { Link, useMatch, useResolvedPath } from "react-router-dom"
import {TextField, Alert, Snackbar} from '@mui/material';
import { useState } from "react";
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import axios from "axios";
import VerificationModal from './components/VerificationModal';
import apiEndpoint from "./apiEndpoint";

const noStockError = "Error - Please select some stocks below first.";
const emailVerifiedError = "Your email is not yet verified. Please follow verification instructions.";
const emailVerified = "Your email is verified, you may now schedule alerts and thresholds for your stocks.";

const userMessages = {
  noStockError: { msg: noStockError, type: "error" },
  emailVerifiedError: { msg: emailVerifiedError, type: "error" },
  emailVerified: { msg: emailVerified },
}

export default function Navbar(props) {

  const { selectedStocks, user, setUser } = props;
  const [showUserAlerts, showAlert] = useState(false);
  const [userMessage, setUserMsg] = useState(userMessages.noStockError);
  const [verify, setVerify] = useState(false);
  const [signUpEmail, setEmail] = useState("");
  const verificationEndpoint = apiEndpoint + "/email/verified/";

  const signUp = (event) => {
    event.preventDefault();
    if (selectedStocks.length === 0) return showAlert(true);
    // Otherwise check if email is verified or not before proceeding to Modal
    axios.get(verificationEndpoint + signUpEmail)
      .then((response) => {
        if (response.data) {
          setUserMsg(userMessages.emailVerified);
          setUser(signUpEmail);
        } else {
          setUserMsg(userMessages.emailVerifiedError);
          setVerify(true);
        }
        showAlert(true);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }

  const handleClose = () => {
    showAlert(false);
  }

  const Logout = () => {
    setUser("");
    setEmail("");
  }

  const alertUser = (message, type = null) => {
    let alert = { msg: message };
    if (type) alert.type = type;
    setUserMsg(alert);
    showAlert(true);
  }

  const createVerifyModal = () => {
    return <VerificationModal alertUser={alertUser} setVerify={setVerify} email={signUpEmail} user={user} setUser={setUser}></VerificationModal>;
  };

  return (
    <div className="nav">
      <a href="/home"><img className="stockwatch-logo" src={logo1} alt="Logo" width="60" height="60" style={{ marginLeft: 10 }} /></a>

      {!user &&
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
            SignUp/Login
          </Button>
        </Paper>}
      {
        user &&
        <Paper
          component="form"
          sx={{
            p: "10px 15px",
            display: "flex",
            alignItems: "center",
            width: 500,
            marginLeft: "auto",
            mr: 3,
            height: 40,
          }}
          onSubmit={Logout}
        >
          <Typography
            sx={{ ml: 1, flex: 1 }}
            variant="standard"
            type="email"
          >Logged in as <b>{user}</b> </Typography>
          <Button variant="contained" type="submit">
            Logout
          </Button>
        </Paper>
      }
      <Snackbar open={showUserAlerts} autoHideDuration={1500} onClose={handleClose} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert onClose={handleClose} severity={userMessage['type'] ? userMessage['type'] : "success"} sx={{ width: "100%" }}>{userMessage.msg}</Alert>
      </Snackbar>
      {verify ? createVerifyModal() : null}
    </div>
  );
}


