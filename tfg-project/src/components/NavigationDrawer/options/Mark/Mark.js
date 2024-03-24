import * as React from 'react';
import { useState, useEffect} from 'react';
import { useTranslation } from "react-i18next";

import {getLabWorks,getWorksByStudent } from "../../../../repositories/labWorkRepository.js";
import {getStudents,getStudentsByWork} from "../../../../repositories/studentRepository.js";
import {getTeacherId} from "../../../../repositories/teacherRepository.js";
import {getInfoFromFilterMark} from "../../../../functions/genericFunctions.js";

import './Mark.css';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';


function Mark({userData}){
    const [teacherID, setTeacherID] = useState("");
    const [t] = useTranslation();
    const [labworks, setLabWorks] = useState([]);
    const [students, setStudents] = useState([]);

    useEffect(() => {
        const fetchInfo = async () => {
            const id = await getTeacherId(setTeacherID,userData.html_url);
           getLabWorks(setLabWorks,id);
           getStudents(setStudents,id);
        };
    
        fetchInfo();
      }, []);


    const getWorks= () =>{
        let options = [];
        if(labworks != undefined){
            labworks.map((work,index) => {
                options[index] = work.title+" - "+work.labgroupNameFK;
          });
        }     
        return options;
    }

    const getStudentsOptions= () =>{
        let options = [];
        if(students != undefined){
            students.map((student,index) => {
                options[index] = student.name+" - "+student.email;
          });
        }     
        return options;
    }

    const handleWorkChange = (e, selectedOption) => {
        if (selectedOption) {
            const fetchFilterStudents = async () => {
                getStudentsByWork(getInfoFromFilterMark(selectedOption), setStudents, teacherID);
            };
            fetchFilterStudents();
        }else{
          const fetchAllStudents = async () => {
            getStudents(setStudents,teacherID);
          };
          fetchAllStudents();
        }
      }

    const handleStudentChange = (e, selectedOption) => {
    if (selectedOption) {
        const fetchFilterWorks = async () => {
            getWorksByStudent(getInfoFromFilterMark(selectedOption), setLabWorks, teacherID);
        };
        fetchFilterWorks();
    }else{
        const fetchAllWorks = async () => {
            getLabWorks(setLabWorks,teacherID);
        };
        fetchAllWorks();
    }
    }


    return (
        <div className='filtersDiv'>
            <Grid container spacing={2}>
                <Grid item xs={1}>
                </Grid>
                <Grid item xs={3}>
                    <div className="filterWork">
                        <Autocomplete
                            disablePortal
                            id="work-combo-box"
                            options={getWorks()}
                            renderInput={(params) => <TextField {...params} label={t('mark.labWork')} />}
                            onChange={handleWorkChange}
                        />
                    </div>
                </Grid>
                <Grid item xs={4}>
                </Grid>
                <Grid item xs={3}>
                    <div className="filterStudent">
                        <Autocomplete
                            disablePortal
                            id="student-combo-box"
                            options={getStudentsOptions()}
                            renderInput={(params) => <TextField {...params} label={t('mark.students')} />}
                            onChange={handleStudentChange}
                        />
                    </div>
                </Grid>
                <Grid item xs={1}>
                </Grid>
            </Grid>
            

        </div>
    );
}

export default Mark;
