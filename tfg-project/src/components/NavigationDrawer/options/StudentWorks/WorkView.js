import * as React from 'react';
import { useState, useEffect} from 'react';
import {useTranslation} from "react-i18next";
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import {formatDate} from '../../../../functions/genericFunctions';

import './WorkView.css';

function WorkView({work}) {
    const [t] = useTranslation();

    useEffect(() => {
        console.log(work);
    

      }, []);

    const estiloTextField = {
        pointerEvents: 'none',
    };


  return (
    <div className='work-view-div'>
        <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                    <h2>{work.title}</h2>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        id="outlined-required-group"
                        className="workGroup"
                        label={t('studentWorks.group')}
                        value={work.groupName}
                        style={estiloTextField}
                        InputLabelProps={{ style: { color: 'black' } }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        id="outlined-required-percentage"
                        className="workPercentage"
                        label={t('studentWorks.percentage')}
                        value={work.percentage}
                        style={estiloTextField}
                        InputLabelProps={{ style: { color: 'black' } }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        id="outlined-required-idate"
                        className="workInitialDate"
                        label={t('studentWorks.initialDate')}
                        value={formatDate(work.initialdate)}
                        style={estiloTextField}
                        InputLabelProps={{ style: { color: 'black' } }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        id="outlined-required-fdate"
                        className="workInitialDate"
                        label={t('studentWorks.finalDate')}
                        value={formatDate(work.finaldate)}
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
                        InputLabelProps={{ style: { color: 'black' } }}
                    />
                </Grid>
                {work.mark != "" ?
                (
                    <Grid item xs={12} sm={12} md={12}>
                        <div className='mark-comment-div'>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12}>
                                <h3>{t('studentWorks.mark')}</h3>
                            </Grid>
                            
                            {work.comment != "" ?
                            (
                                <>
                                <Grid item xs={12} sm={2}>
                                    <h3>{work.mark}</h3>
                                </Grid>
                                <Grid item xs={12} sm={10}>
                                    <TextField
                                        id="outlined-required-comment"
                                        className="workComment"
                                        label={t('studentWorks.comment')}
                                        value={work.comment}
                                        fullWidth
                                        multiline
                                        rows={4}
                                        InputLabelProps={{ style: { color: 'black' } }}
                                    />
                                </Grid>
                                </>
                            ):(
                                <>
                                <Grid item xs={12} sm={12}>
                                    <h3>{work.mark}</h3>
                                </Grid>
                                </>
                            )
                            }    
                        </Grid>
                        </div>
                    </Grid>
                )
                :
                (
                    <Grid item xs={12} sm={12} md={12}>
                        <div className='mark-comment-div'>
                            <Grid item xs={12} sm={12}>
                                <h3>{t('studentWorks.withoutMark')}</h3>
                            </Grid>
                        </div>
                    </Grid>
                )
                }
            </Grid>
    </div>
  );
}


export default WorkView;
