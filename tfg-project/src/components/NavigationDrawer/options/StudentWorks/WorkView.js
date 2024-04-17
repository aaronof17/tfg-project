import * as React from 'react';
import { useState, useEffect} from 'react';
import {useTranslation} from "react-i18next";
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

import './WorkView.css';

function WorkView({work}) {
    const [t] = useTranslation();

    useEffect(() => {
        console.log(work);
        // const fetchInfo = async () => {
        //     const id = await getTeacherId(setTeacherID,userData.html_url);
        //     getLabGroups(setLabGroups,id);
        //     getSubjectsFromGroup(setSubjects,id);
        // };
    
        // fetchInfo();
      }, []);


    const estiloTextField = {
        pointerEvents: 'none',
    };

    const descriptionStyle = {
        maxHeight: '200px', // Altura máxima del TextField antes de que se active el scroll
        overflowY: 'auto', // Habilitar el scroll vertical cuando sea necesario
    };

  return (
    <div className='work-view-div'>
        <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        id="outlined-required-title"
                        className="workTitle"
                        label={t('studentWorks.title')}
                        value={work.title}
                        style={estiloTextField}
                        InputLabelProps={{ style: { color: 'black' } }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        id="outlined-required-group"
                        className="workGroup"
                        label={t('studentWorks.group')}
                        value={work.group}
                        style={estiloTextField}
                        InputLabelProps={{ style: { color: 'black' } }}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                    <TextField
                        id="outlined-required-description"
                        className="workDescription"
                        label={t('studentWorks.description')}
                        value={work.description}
                        fullWidth
                        multiline
                        rows={4}
                        style={estiloTextField}
                        InputLabelProps={{ style: { color: 'black' } }}
                    />
                </Grid>
            </Grid>
    </div>
  );
}


export default WorkView;
