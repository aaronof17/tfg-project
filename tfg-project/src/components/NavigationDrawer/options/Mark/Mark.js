import * as React from 'react';
import { useState, useEffect} from 'react';
import { useTranslation } from "react-i18next";

import {getLabWorks,getWorksByStudent } from "../../../../repositories/labWorkRepository.js";
import {getStudents,getStudentsByWork} from "../../../../repositories/studentRepository.js";
import {getTeacherId} from "../../../../repositories/teacherRepository.js";
import {saveMark} from "../../../../repositories/markRepository.js";
import {getInfoFromFilterMark} from "../../../../functions/genericFunctions.js";

import './Mark.css';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import InfoMark from './InfoMark.js';
import {ToastContainer, toast} from "react-toastify";
import Button from '@mui/material/Button';


function Mark({userData}){
    const [teacherID, setTeacherID] = useState("");
    const [t] = useTranslation();
    const [labworks, setLabWorks] = useState([]);
    const [students, setStudents] = useState([]);
    const [comment, setComment] = useState("");
    const [markNumber, setMarkNumber] = useState("");
    const [actualStudent, setActualStudent] = useState("");
    const [actualWork, setActualWork] = useState("");


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
                options[index] = {
                    label: `${work.title} - ${work.labgroupNameFK}`,
                    value: work.worklabID
                };
          });
        }     
        return options;
    }

    const getStudentsOptions= () =>{
        let options = [];
        if(students != undefined){
            students.map((student,index) => {
                options[index] = {
                    label: `${student.name} - ${student.email}`,
                    value: student.studentsID
                };
          });
        }     

        return options;
    }

    const handleWorkChange = (e, selectedOption) => {
        if (selectedOption) {
            const fetchFilterStudents = async () => {
                getStudentsByWork(getInfoFromFilterMark(selectedOption.label), setStudents, teacherID);
            };
            setActualWork(selectedOption);
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
            getWorksByStudent(getInfoFromFilterMark(selectedOption.label), setLabWorks, teacherID);
        };
        setActualStudent(selectedOption);
        fetchFilterWorks();
    }else{
        const fetchAllWorks = async () => {
            getLabWorks(setLabWorks,teacherID);
        };
        fetchAllWorks();
    }
    }

    function saveMarkButton(){
        if(comment === "" || markNumber === ""){
            toast.error(t('mark.dataBlankError'));
        }else{
            if(actualStudent === "" || actualWork=== ""){
                toast.error(t('mark.infoBlankError'));
            }else{
                saveMark(actualWork.value, actualStudent.value, comment, markNumber).then((res)=>{
                    if(res.response){
                        toast.info(t('mark.markSaved'));
                      }else{
                        toast.error(res.error); 
                      }
                });
            }
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
            <div className='infoMark'>
                <InfoMark setComment={setComment} setMarkNumber={setMarkNumber}></InfoMark>
            </div>
            <div className="saveLabWorks" >
                <Button variant="contained" onClick={saveMarkButton}>
                    {t('mark.saveMark')}
                </Button>
            </div>
            <ToastContainer className="custom-toast-container"/>
        </div>
    );
}

export default Mark;
