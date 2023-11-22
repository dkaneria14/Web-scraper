import * as React from 'react';
import { Stack, TextField, Button, InputAdornment, FormGroup, FormControlLabel, Switch, Typography  } from '@mui/material';

export function Threshold() {
    return (
        <Stack direction="row" spacing={2} padding={3} margin={1}>
            <TextField
                id="filled-number"
                label="Enter Threshold Value"
                type="number"
                InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                variant="standard" />
            <FormGroup>
                <FormControlLabel control={<Switch defaultChecked />} label="Above" />
            </FormGroup>
            <Button variant="contained" type="submit">
                add
              </Button>
        </Stack>

    );
            }