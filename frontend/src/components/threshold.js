import * as React from 'react';
import { Stack, TextField, Button, InputAdornment, FormGroup, FormControlLabel, Switch } from '@mui/material';

export function Threshold(props) {
    const { style } = props;

    return (
        <Stack direction="row" spacing={2} padding={3} style={style} justifyContent="left">
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
            <Button variant="contained" type="submit" sx={{ height: '35px' }}>
                add
            </Button>
        </Stack>

    );
            }