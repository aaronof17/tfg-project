import * as React from 'react';
import { useTranslation } from "react-i18next";
import { formatDate } from '../../../../functions/genericFunctions';

import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

import './WorkView.css';

function WorkView({ work }) {
    const [t] = useTranslation();

    const estiloTextField = {
        pointerEvents: 'none',
    };

    return (
        <div className='work-view-container'>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                    <h2>{work.title}</h2>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        id="work-group"
                        label={t('studentWorks.group')}
                        value={work.groupName}
                        style={estiloTextField}
                        InputProps={{ readOnly: true }}
                        InputLabelProps={{ htmlFor: "work-group", style: { color: 'black' } }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        id="work-percentage"
                        label={t('studentWorks.percentage')}
                        value={work.percentage}
                        style={estiloTextField}
                        InputProps={{ readOnly: true }}
                        InputLabelProps={{ htmlFor: "work-percentage", style: { color: 'black' } }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        id="work-initial-date"
                        label={t('studentWorks.initialDate')}
                        value={formatDate(work.initialdate)}
                        style={estiloTextField}
                        InputProps={{ readOnly: true }}
                        InputLabelProps={{ htmlFor: "work-initial-date", style: { color: 'black' } }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        id="work-final-date"
                        label={t('studentWorks.finalDate')}
                        value={formatDate(work.finaldate)}
                        style={estiloTextField}
                        InputProps={{ readOnly: true }}
                        InputLabelProps={{ htmlFor: "work-final-date", style: { color: 'black' } }}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                    <TextField
                        id="work-description"
                        label={t('studentWorks.description')}
                        value={work.description}
                        fullWidth
                        multiline
                        rows={4}
                        style={estiloTextField}
                        InputProps={{ readOnly: true }}
                        InputLabelProps={{ htmlFor: "work-description", style: { color: 'black' } }}
                    />
                </Grid>
                {work.mark !== "" ? (
                    <Grid item xs={12} sm={12} md={12}>
                        <div className='mark-comment-div'>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={12}>
                                    <h3>{t('studentWorks.mark')}</h3>
                                </Grid>
                                {work.comment !== "" ? (
                                    <>
                                        <Grid item xs={12} sm={12}>
                                            <h3>{work.mark}</h3>
                                        </Grid>
                                        <Grid item xs={12} sm={12}>
                                            <TextField
                                                id="work-comment"
                                                label={t('studentWorks.comment')}
                                                value={work.comment}
                                                fullWidth
                                                multiline
                                                rows={4}
                                                style={estiloTextField}
                                                InputProps={{ readOnly: true }}
                                                InputLabelProps={{ htmlFor: "work-comment", style: { color: 'black' } }}
                                            />
                                        </Grid>
                                    </>
                                ) : (
                                    <Grid item xs={12} sm={12}>
                                        <h3>{work.mark}</h3>
                                    </Grid>
                                )}
                            </Grid>
                        </div>
                    </Grid>
                ) : (
                    <Grid item xs={12} sm={12} md={12}>
                        <div className='mark-comment-div'>
                            <Grid item xs={12} sm={12}>
                                <h3>{t('studentWorks.withoutMark')}</h3>
                            </Grid>
                        </div>
                    </Grid>
                )}
            </Grid>
        </div>
    );
}

export default WorkView;
