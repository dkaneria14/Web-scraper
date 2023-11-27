import * as React from "react";
import {
  Stack,
  TextField,
  InputAdornment,
  FormGroup,
  FormControlLabel,
  Switch,
} from "@mui/material";

export function Threshold(props) {
  const { isAbove, setIsAbove, threshold, setThreshold, style } = props;

  const handleChange = () => {
    setIsAbove(!isAbove);
  };

  const handleThresholdChange = (event) => {
    setThreshold(event.target.value);
  };


  return (
    <Stack
      direction="row"
      spacing={10}
      padding={2}
      style={style}
      justifyContent="flex-start"
    >
      <TextField
        id="filled-number"
        label="Enter Threshold Value"
        type="number"
        value={threshold}
        onChange={handleThresholdChange}
        InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }}
        variant="standard"
      />
      <FormGroup>
        <FormControlLabel control={<Switch checked={isAbove}
          onChange={handleChange} />} label={isAbove ? "Above" : "Below"} />
      </FormGroup>
    </Stack>
  );
}
