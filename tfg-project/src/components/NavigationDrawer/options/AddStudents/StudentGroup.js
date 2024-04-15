import * as React from 'react';

import { useState, useEffect} from 'react';
import {useTranslation} from "react-i18next";
import {getLabGroups, getLabGroupsBySubject} from "../../../../services/labGroupService.js";

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';

import './StudentGroup.css';


function StudentGroup({labGroups, setLabGroups, subjects, setSubject, setGroup, teacherID}) {

    const [t] = useTranslation();

    const getSubjects= () =>{
        let options = [];
        if(subjects != undefined){
            subjects.map((subject,index) => {
                options[index] = subject.subject;
          });
        }     
        return options;
    }

    const handleGroupChange = (e, selectedOption) => {
        if (selectedOption) {
            setGroup(selectedOption.value);
        }else{
            setGroup("");
        }
    }


    const handleSubjectChange = (e, selectedOption) => {
        if (selectedOption) {
            const fetchFilterGroups = async () => {
                getLabGroupsBySubject(selectedOption, teacherID, setLabGroups);
            };
            setSubject(selectedOption);
            fetchFilterGroups();
        }else{
            setSubject("");
            getLabGroups(setLabGroups, teacherID);
        }
    }

            

    return (
        <div className="student-info-group-wrapper">
            <Grid container spacing={2}>
                <Grid item xs={2}>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Autocomplete
                        disablePortal
                        id="subject-combo-box"
                        options={getSubjects()}
                        renderInput={(params) => <TextField {...params} label={t('addStudents.subject')} />}
                        onChange={handleSubjectChange}
                    />
                </Grid>
                <Grid item xs={2}>
                </Grid>  
                <Grid item xs={12} sm={3}>
                    <Autocomplete
                        disablePortal
                        id="group-combo-box"
                        options={labGroups}
                        renderInput={(params) => <TextField {...params} label={t('addStudents.groups')} />}
                        onChange={handleGroupChange}
                    />
                </Grid>
                <Grid item xs={2}>
                </Grid>
            </Grid>
        </div>
    );
}

export default StudentGroup;
