import { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Typography } from "@mui/material";
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
const incorrectCode = "The code you entered was incorrect. Please enter the correct code or request a new one.";

export default function AlertSignupModal(props) {
  const [verificationCode, setVerificationCode] = useState('');
  const [sendingCode, setSendingCode] = useState(false);

  const { setVerify, alertUser } = props;

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
      return(<><DialogContentText>
        To continue with subscribing to emailed threshold alerts, you must
        first verify your email so that only registered addresses receive
        the alerts that they sign up for.
      </DialogContentText>
      <Typography
        sx={{ mt: 3 }}
        align="center"
        color="black"
        variant="h6"
      >
        Email: {props.email}
      </Typography></>)
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
    axios.post(`${emailEndpoint}validate_code/`,{
      email: props.email,
      code: verificationCode
    }).then((response) => {
      setSendingCode(false);
      if (!response.data) return alertUser(incorrectCode, "error");
      alertUser(response.data);
      handleClose();
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
      <TextField
        required
        label="Verification Code"
        variant="outlined"
        value={verificationCode}
        onChange={handleVerificationCodeChange}
        type="number"
        inputProps={{ maxLength: 6 }}
      />
    </>);
  }

  return (
    <Dialog open={true}>
      <DialogTitle>Verify your Email</DialogTitle>
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
            {activeStep === 0 ? renderStepOne() : sendingCode ? 
            <CircularProgress color="success" /> : renderStepTwo()}
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Button
                color="inherit"
                onClick={activeStep === 0 ? handleClose : handleBack}
                sx={{ mr: 1 }}
              >
                {activeStep === 0 ? "Edit Email" : "Back"}
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
