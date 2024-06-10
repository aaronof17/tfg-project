import * as React from 'react';
import { useState, useEffect} from 'react';
import { useTranslation } from "react-i18next";
import {getActiveLabWorks,getWorksByStudent } from "../../../../services/labWorkService.js";
import {getStudentsWithoutRepo,getStudentsByWork} from "../../../../services/studentService.js";
import {getTeacherId} from "../../../../services/teacherService.js";
import {saveMark,getMarkByWorkAndStudent,editMark } from "../../../../services/markService.js";
import {getInfoFromFilterMark, extractDuplicateEntry} from "../../../../functions/genericFunctions.js";
import { sendEmail } from '../../../../functions/sendEmail.js';
import {toast} from "react-toastify";

import 'react-toastify/dist/ReactToastify.css';
import './Mark.css';
import strings from '../../../../assets/files/strings.json';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import InfoMark from './InfoMark.js';
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
            const id = await getTeacherId(setTeacherID,userData.login);
            getActiveLabWorks(setLabWorks,id);
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
                    value: work.worklabID,
                    worktitle: work.title
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
                    value: student.studentsID,
                    email: student.email
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
            getActiveLabWorks(setLabWorks,teacherID);
        };
        setActualStudent("");
        fetchAllWorks();
    }
    }

    function rewriteMark(){
        editMark(actualWork.value, actualStudent.value, comment, markNumber).then((res)=>{
            if(res.response){
                    toast.info(t('mark.markSaved'));
                    setActualStudent("");
                    setActualWork("");
                    setMarkNumber("");
                    setComment("");
                    setMarkNumber(0);
                    sendEmailMessage();
                    const fetchInfo = async () => {
                        getActiveLabWorks(setLabWorks,teacherID);
                        getStudentsWithoutRepo(setStudents,teacherID);
                    };
                
                    fetchInfo();
                }else{
                    if(res.code === strings.errors.dupentry){
                        toast.error(extractDuplicateEntry(res.error)+t('mark.errorExist'));
                    }else{
                        toast.error(t('mark.errorEditingMark'));
                    }
                }
        });
      }

      async function existsMark(actualWorkValue, actualStudentValue){
        try {
            const res = await getMarkByWorkAndStudent(actualWorkValue, actualStudentValue);
            if (res.response) {
                return res.data !== 0;
            }
        } catch (error) {
            console.error('Error checking mark existence:', error);
            return false;
        }
    }

    async function saveMarkButton(){
        if(comment.trim() === "" || markNumber === "" || isNaN(markNumber)){
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
                            setActualStudent("");
                            setActualWork("");
                            setMarkNumber("");
                            setComment("");
                            sendEmailMessage();
                            const fetchInfo = async () => {
                                getActiveLabWorks(setLabWorks,teacherID);
                                getStudentsWithoutRepo(setStudents,teacherID);
                            };
                        
                            fetchInfo();
                        }else{
                            if(res.code === strings.errors.dupentry){
                                toast.error(extractDuplicateEntry(res.error)+t('mark.errorExist'));
                            }else{
                                toast.error(t('mark.errorSavingMark'));
                            }
                        }
                    });
                }
               
            }
        }
    }

    async function sendEmailMessage(){
        if(actualWork.worktitle === "" || actualStudent.email === ""){
            toast.error(t('mark.cantsendemail'));
        }else{
            sendEmail(markNumber, comment, actualWork.worktitle, actualStudent.email).then((res) => {
                if(res.response){
                    toast.info(t('mark.emailSended')+actualStudent.email);        
                }else{
                    toast.error(t('mark.errorsendingemail')+actualStudent.email); 
                }
            });
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
                            value={actualWork}
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
                            value={actualStudent}
                        />
                    </div>
                </Grid>
                <Grid item xs={1}>
                </Grid>
            </Grid>
            <div className='infoMark'>
                <InfoMark comment={comment} setComment={setComment} mark={markNumber} setMarkNumber={setMarkNumber}></InfoMark>
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
        </div>
    );
}

export default Mark;
