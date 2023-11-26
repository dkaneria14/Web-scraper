import { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Typography, Grid } from "@mui/material";
import {TextField} from "@mui/material";

// Stepper
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

import { CircularProgress } from '@mui/material';
import axios from "axios";
import apiEndpoint from "../apiEndpoint";

const steps = ['Send Verification Email', 'Confirm Email Code'];
const emailEndpoint = apiEndpoint + "/email/";
const authEndpoint = apiEndpoint + "/auth/";
const incorrectCode = "The code you entered was incorrect. Please enter the correct code or request a new one.";

export default function AlertSignupModal(props) {
  const [verificationCode, setVerificationCode] = useState('');
  const [sendingCode, setSendingCode] = useState(false);

  const { setVerify, alertUser, registered, setUserEmail, email } = props;

  const handleClose = () => {
    setVerify(false);
  }

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => {
      if (prevActiveStep - 1 === 0) setSendingCode(false);
      return prevActiveStep - 1
    });
    
  };

  const handleVerificationCodeChange = (event) => {
    const inputCode = event.target.value;
    if (/^\d{0,6}$/.test(inputCode)) {
      setVerificationCode(inputCode);
    }
  };
  

  const renderStepOne = () => {
      return(<Grid item><DialogContentText>
        {registered ? "Log in with your one time code to access your account and set threshold alerts." :
         `To continue with subscribing to emailed threshold alerts, you must
        first verify your email so that only registered addresses receive
        the alerts that they sign up for.`}
      </DialogContentText>
      <Typography
        sx={{ mt: 3 }}
        align="center"
        variant="h6"
      >
        Email: {props.email}
      </Typography></Grid>)
  }

  const requestCode = () => {
    setSendingCode(true);
    handleNext();
    axios.post(`${emailEndpoint}send_code/`,{
      email: props.email
    }).then((response) => {
      alertUser(response.data);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    })
    .finally(() => setSendingCode(false));
  }

  const validateCode = () => {
    if (verificationCode.length !== 6) return;
    setSendingCode(true);
    const endpoint = registered ? `${authEndpoint}login/` : `${emailEndpoint}validate_code/`;
    axios.post(endpoint,{
      email: props.email,
      code: verificationCode
    }).then((response) => {
      setSendingCode(false);
      if (!response.data) return alertUser(incorrectCode, "error");
      alertUser("Code verified");
      handleClose();
      if (registered) {
        sessionStorage.setItem("accessToken", response.data.access_token)
        setUserEmail(email);
      }
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
      setSendingCode(false);
    });
  }

  const renderStepTwo = () => {
    return(
    <>
    <DialogContentText sx={{ mb: 1 }}>
        Your code is valid for the next 5 minutes. Enter the 6-digit verification code requested below
      </DialogContentText>
    <Grid item>
      <TextField
        required
        label="Verification Code"
        variant="outlined"
        value={verificationCode}
        onChange={handleVerificationCodeChange}
        type="number"
        inputProps={{ maxLength: 6 }}
      />
    </Grid>
    </>);
  }

  const backButtonText = () => {
    return registered ? "Not you?" : "Edit Email";
  }

  return (
    <Dialog open={true}>
      <DialogTitle>{registered ? "Login to your account" : "Verify your Email"}</DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            const stepProps: { completed?: boolean } = {};
            return (
              <Step key={label} {...stepProps}>
                <StepLabel>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        {activeStep === steps.length ? (
          <>
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - you&apos;re finished
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button onClick={handleClose}>Close</Button>
            </Box>
          </>
        ) : (
          <>
            <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
            <Grid container justifyContent="center" alignItems="center">
            {activeStep === 0 ? renderStepOne() : sendingCode ? 
            <Grid item><CircularProgress color="success" /></Grid> : renderStepTwo()}
            </Grid>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Button
                color="inherit"
                onClick={activeStep === 0 ? handleClose : handleBack}
                sx={{ mr: 1 }}
              >
                {activeStep === 0 ? backButtonText() : "Back"}
              </Button>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button disabled={sendingCode} onClick={activeStep === steps.length - 1 ? validateCode : requestCode}>
                {activeStep === steps.length - 1 ? "Complete" : "Send Verification Code"}
              </Button>
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
