import * as React from 'react';
import { useState, useEffect} from 'react';
import { useTranslation } from "react-i18next";

import {getLabWorks,getWorksByStudent } from "../../../../services/labWorkService.js";
import {getStudentsWithoutRepo,getStudentsByWork} from "../../../../services/studentService.js";
import {getTeacherId} from "../../../../services/teacherService.js";
import {saveMark,getMarkByWorkAndStudent,editMark } from "../../../../services/markService.js";
import {getInfoFromFilterMark} from "../../../../functions/genericFunctions.js";

import './Mark.css';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import InfoMark from './InfoMark.js';
import {ToastContainer, toast} from "react-toastify";
import Button from '@mui/material/Button';
import RewriteModal from '../../../Modal/RewriteModal.js';


function Mark({userData}){
    const [teacherID, setTeacherID] = useState("");
    const [t] = useTranslation();
    const [labworks, setLabWorks] = useState([]);
    const [students, setStudents] = useState([]);
    const [comment, setComment] = useState("");
    const [markNumber, setMarkNumber] = useState("");
    const [actualStudent, setActualStudent] = useState("");
    const [actualWork, setActualWork] = useState("");
    const [modalOpen, setModalOpen] = useState(false);


    useEffect(() => {
        const fetchInfo = async () => {
            const id = await getTeacherId(setTeacherID,userData.html_url);
            getLabWorks(setLabWorks,id);
            getStudentsWithoutRepo(setStudents,id);
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
            getStudentsWithoutRepo(setStudents,teacherID);
          };
          setActualWork("");
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
        setActualStudent("");
        fetchAllWorks();
    }
    }

    function rewriteMark(){
        editMark(actualWork.value, actualStudent.value, comment, markNumber).then((res)=>{
            if(res.response){
                    toast.info(t('mark.markSaved'));
                }else{
                    toast.error(res.error); 
                }
        });
      }

      async function existsMark(actualWorkValue, actualStudentValue){
        try {
            const res = await getMarkByWorkAndStudent(actualWorkValue, actualStudentValue);
            if (res.response) {
                return res.data !== 0;
            } else {
                toast.error(res.error);
                return false;
            }
        } catch (error) {
            console.error('Error checking mark existence:', error);
            return false;
        }
    }

    async function saveMarkButton(){
        if(comment === "" || markNumber === "" || isNaN(markNumber)){
            toast.error(t('mark.dataBlankError'));
        }else{
            if(actualStudent === "" || actualWork=== ""){
                toast.error(t('mark.infoBlankError'));
            }else{
                const markExists = await existsMark(actualWork.value, actualStudent.value);

                if(markExists){
                    setModalOpen(true);
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
    }


    return (
        <div className='filtersDiv'>
            <Grid container spacing={2}>
                <Grid item xs={1}>
                </Grid>
                <Grid item xs={4}>
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
                <Grid item xs={1}>
                </Grid>
                <Grid item xs={5}>
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
            {modalOpen && (
                <RewriteModal
                    closeRewriteModal={() => {
                    setModalOpen(false);
                    }}
                    genericFunction={rewriteMark}
                    text1={t('mark.studentHasmark')}
                    text2={t('mark.rewrite')}
                />
            )}
            <ToastContainer className="custom-toast-container"/>
        </div>
    );
}

export default Mark;
