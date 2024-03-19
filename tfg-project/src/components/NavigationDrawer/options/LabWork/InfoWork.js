import * as React from 'react';

import { useTranslation } from "react-i18next";
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import './InfoWork.css';

function InfoWork() {
    const [t] = useTranslation();

    const handleKeyPress = (event) => {
        const charCode = event.charCode;
        if (charCode < 48 || charCode > 57) {
            event.preventDefault();
        }
    };

    const handlePercentageChange = (event) => {
        let value = event.target.value;
        let intValue = parseInt(value, 10);
        if (intValue > 100) {
            intValue = 100;
        }
        event.target.value = intValue;
    };

    return (
        <div className="info-wrapper">
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <TextField
                        id="outlined-required"
                        className="titleWork"
                        label="Title"
                        type="text"
                        inputProps={{ maxLength: 50 }}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        id="outlined-required"
                        className="percentageWork"
                        label="Percentage"
                        type="number"
                        inputProps={{
                            min: 0,
                            max: 100,
                            onKeyPress: handleKeyPress,
                            onInput: handlePercentageChange
                        }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        id="outlined-required"
                        className="descriptionWork"
                        label="Description"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        inputProps={{ maxLength: 200 }}
                    />
                </Grid>
            </Grid>
        </div>
    );
}

export default InfoWork;
