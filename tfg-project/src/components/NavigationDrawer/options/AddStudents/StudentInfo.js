import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import { useState, useEffect} from 'react';
import {useTranslation} from "react-i18next";

function StudentInfo({setName, setEmail, setUser, setRepository}) {

    const [t] = useTranslation();

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleUserChange = (e) => {
        setUser(e.target.value);
    };
    
    const handleRepositoryChange = (e) => {
        setRepository(e.target.value);
    };
            

    return (
        <div className="student-info-wrapper">
            <Grid container spacing={2}>
                <Grid item xs={12} sm={3}>
                    <TextField
                        id="outlined-required"
                        className="studentName"
                        label="Nombre Completo"
                        type="text"
                        inputProps={{ maxLength: 45 }}
                        onChange={handleNameChange}
                    />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <TextField
                        id="outlined-required"
                        className="studentEmail"
                        label="Email"
                        type="email"
                        inputProps={{ maxLength: 45 }}
                        onChange={handleEmailChange}
                    />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <TextField
                        id="outlined-required"
                        className="studentGitHubUser"
                        label="GitHub User"
                        type="text"
                        inputProps={{ maxLength: 45 }}
                        onChange={handleUserChange}
                    />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <TextField
                        id="outlined-required"
                        className="studentRepository"
                        label="Repository"
                        type="text"
                        inputProps={{ maxLength: 200 }}
                        onChange={handleRepositoryChange}
                    />
                </Grid>
            </Grid>
        </div>
    );
}

export default StudentInfo;
