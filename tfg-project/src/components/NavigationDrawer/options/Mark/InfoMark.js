import * as React from 'react';
import { useTranslation } from "react-i18next";

import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import './InfoMark.css';

function InfoMark({ comment, setComment, mark, setMarkNumber }) {
    const [t] = useTranslation();

    const handleKeyPress = (event) => {
        const charCode = event.charCode;
        if ((charCode < 48 || charCode > 57) && charCode !== 46 && charCode !== 0 && charCode !== 8 && charCode !== 37 && charCode !== 39) {
            event.preventDefault();
        }
    };

    const handleNumberChange = (event) => {
        let value = event.target.value;
        value = value.replace(',', '.');
        let floatValue = parseFloat(value);
        if (floatValue < 0) {
            floatValue = 0;
        } else if (floatValue > 10) {
            floatValue = 10;
        }
        event.target.value = floatValue;
        setMarkNumber(floatValue);
    };
    

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    return (
        <div className="infoMark-wrapper">
            <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={12}>
                    <TextField
                        id="outlined-required"
                        className="markNumber"
                        label={t('mark.mark')}
                        type="number"
                        inputProps={{
                            min: 0,
                            max: 10,
                            onKeyPress: handleKeyPress,
                            onBlur: handleNumberChange 
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                    <TextField
                        id="outlined-required"
                        className="markComment"
                        label={t('mark.comment')}
                        type="text"
                        onChange={handleCommentChange}
                        fullWidth
                        multiline
                        rows={4}
                        inputProps={{ maxLength: 1000 }}
                        value={comment}
                    />
                </Grid>
            </Grid>
        </div>
    );
}

export default InfoMark;
