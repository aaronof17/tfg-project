import * as React from 'react';
import {useTranslation} from "react-i18next";
import {getTeacherLabGroups, getLabGroupsBySubject} from "../../../../services/labGroupService.js";

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';

import './StudentGroup.css';

function StudentGroup({group, labGroups, setLabGroups, subjects, subject, setSubject, setGroup, teacherID}) {

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

    const getGroupsOptions= () =>{
        let options = [];
        if(labGroups != undefined){
            labGroups.map((l,index) => {
            options[index] = {
                label: `${l.label}`,
                value: l.value
            };
          });
        }     
    
        return options;
      }

    const handleGroupChange = (e, selectedOption) => {
        if (selectedOption) {
            setGroup(selectedOption);
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
            getTeacherLabGroups(setLabGroups, teacherID);
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
                        value={subject}
                    />
                </Grid>
                <Grid item xs={2}>
                </Grid>  
                <Grid item xs={12} sm={3}>
                    <Autocomplete
                        disablePortal
                        id="group-combo-box"
                        options={getGroupsOptions()}
                        renderInput={(params) => <TextField {...params} label={t('addStudents.groups')} />}
                        onChange={handleGroupChange}
                        value={group}
                    />
                </Grid>
                <Grid item xs={2}>
                </Grid>
            </Grid>
        </div>
    );
}

export default StudentGroup;
