import * as React from 'react';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import {useTranslation} from "react-i18next";

function StudentInfo({setName, setEmail, setUser, setRepository, setPath}) {

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

    const handlePathChange = (e) => {
        setPath(e.target.value);
    };
            

    return (
        <div className="student-info-wrapper">
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        id="outlined-required"
                        className="studentName"
                        label={t('addStudents.name')}
                        type="text"
                        inputProps={{ maxLength: 45 }}
                        onChange={handleNameChange}
                        sx={{ width: '100%' }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        id="outlined-required"
                        className="studentEmail"
                        label={t('addStudents.email')}
                        type="email"
                        inputProps={{ maxLength: 45 }}
                        onChange={handleEmailChange}
                        sx={{ width: '100%' }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        id="outlined-required"
                        className="studentGitHubUser"
                        label={t('addStudents.user')}
                        type="text"
                        inputProps={{ maxLength: 45 }}
                        onChange={handleUserChange}
                        sx={{ width: '100%' }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        id="outlined-required"
                        className="studentRepository"
                        label={t('addStudents.repository')}
                        type="text"
                        inputProps={{ maxLength: 200 }}
                        onChange={handleRepositoryChange}
                        sx={{ width: '100%' }}
                    />
                </Grid>
                <Grid item xs={12} sm={12}>
                    <TextField
                        id="outlined-required"
                        className="studentLocalPath"
                        label={t('addStudents.localpath')}
                        type="text"
                        inputProps={{ maxLength: 1000 }}
                        onChange={handlePathChange}
                        sx={{ width: '100%' }}
                    />
                </Grid>
            </Grid>
        </div>
    );
}

export default StudentInfo;
