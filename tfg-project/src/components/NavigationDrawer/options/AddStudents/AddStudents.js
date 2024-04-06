import * as React from 'react';
import { useState, useEffect} from 'react';
import {useTranslation} from "react-i18next";
import {getTeacherId} from "../../../../repositories/teacherRepository.js";
import {getLabGroups,getSubjectsFromGroup} from "../../../../repositories/labGroupRepository.js";
import {saveStudent, getIdByEmail} from "../../../../repositories/studentRepository.js";
import {saveEnrolled} from "../../../../repositories/enrolledRepository.js";
import {toast} from "react-toastify";

import StudentInfo from './StudentInfo.js';
import StudentGroup from './StudentGroup.js';
import CsvModal from './CsvModal.js';
import RewriteModal from '../../../Modal/RewriteModal.js';

import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import './AddStudents.css';

function AddStudents({userData}) {
    const [t] = useTranslation();
    const [teacherID, setTeacherID] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [user, setUser] = useState("");
    const [repository, setRepository] = useState("");
    const [subject, setSubject] = useState("");
    const [group, setGroup] = useState("");
    const [labGroups, setLabGroups] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [rewriteModalOpen, setRewriteModalOpen] = useState(false);
    const [studentId, setStudentId] = useState(null);


    useEffect(() => {
        const fetchInfo = async () => {
            const id = await getTeacherId(setTeacherID,userData.html_url);
            getLabGroups(setLabGroups,id);
            getSubjectsFromGroup(setSubjects,id);
        };
    
        fetchInfo();
      }, []);

    const handleSaveCsv = async (data) => {
      for (let element of data) {
        try {
          await saveStudentInfo(element.name, element.email, element.githubuser, element.repo, element.group);
        } catch (error) {
          sendError(t('addStudents.errorSavingStudent')+error);
        }
      }
    };
  
    const sendError = (message) => {
      toast.error(message);
    }
  

    function checkData(studentName, studentEmail, studentUser, 
      studentRepository, studentGroup){
      if(studentName === "" || studentEmail === "" ||studentUser === ""
      || studentRepository === "" || studentGroup === ""){
        sendError('Error with student '+studentName+':'+t('addStudents.dataBlank'));
        return false;
      }else{
        return true;
      }
    } 

    function saveCsv(){
        setModalOpen(true);
    }

    function addEnrolled(){
      saveEnrolled(studentId, group, repository).then((res)=>{
          if(res.response){
              toast.info(t('addStudents.studentEnrolled'));
          }else{
              toast.error(res.error); 
          }
      });
    }

    async function existsEmail(actualEmail){
      try {
          const res = await getIdByEmail(actualEmail);
          if (res.response) {
              if(!isNaN(res.data)){
                setStudentId(res.data);
                return true;
              }else{
                return false;
              }
          } else {
              toast.error(res.error);
              return false;
          }
      } catch (error) {
          console.error('Error checking email count:', error);
          return false;
      }
    }


  async function saveStudentInfo(studentName, studentEmail, studentUser, studentRepository, studentGroup){
      if(checkData(studentName, studentEmail, studentUser, studentRepository, studentGroup)){
        try {
          const emailExists = await existsEmail(studentEmail);
          if(emailExists){
            setRewriteModalOpen(true);
          }else{
            const res = await saveStudent(studentName, studentEmail, studentUser, studentRepository, studentGroup);
            if (res.response) {
              toast.info(t('addStudents.studentSaved'));
            } else {
              sendError(res.error);
            }
          }
        } catch (error) {
          sendError(t('addStudents.errorSavingStudent')+error);
        }
      }
    }


  return (
    <div className='students-add-div'>
        <StudentInfo setName={setName} setEmail={setEmail} setUser={setUser} setRepository={setRepository}></StudentInfo>
        <StudentGroup labGroups={labGroups} setLabGroups={setLabGroups} subjects={subjects} 
            setSubject={setSubject} setGroup={setGroup} teacherID={teacherID}>
        </StudentGroup>
        <div className='students-add-buttons'>
            <Grid container spacing={2}>
                <Grid item xs={4}>
                </Grid>
                <Grid item xs={12} sm={2}>
                    <Button variant="contained" onClick={() => saveStudentInfo(name, email, user,repository, group)}>
                      {t('addStudents.saveStudent')}
                    </Button>
                </Grid>
                <Grid item xs={12} sm={2}>
                    <Button variant="contained" onClick={saveCsv} >
                      {t('addStudents.loadCsv')}
                    </Button>
                </Grid>
                <Grid item xs={4}>
                </Grid>
            </Grid>
        </div>
        {modalOpen && (
          <CsvModal
            closeModal={() => {
              setModalOpen(false);
            }}
            onSubmit={handleSaveCsv}
            sendError={sendError}
            labgroups={labGroups}
            existsEmail={existsEmail}
          />
        )}
        {rewriteModalOpen && (
                <RewriteModal
                    closeRewriteModal={() => {
                    setRewriteModalOpen(false);
                    }}
                    genericFunction={addEnrolled}
                    text1={t('addStudents.studentExist')+email}
                    text2={t('addStudents.addEnrolled')}
                />
            )}
    </div>
  );
}


export default AddStudents;
