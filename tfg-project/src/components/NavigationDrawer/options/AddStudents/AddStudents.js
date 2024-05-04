import * as React from 'react';
import { useState, useEffect} from 'react';
import {useTranslation} from "react-i18next";
import {getTeacherId} from "../../../../services/teacherService.js";
import {getTeacherLabGroups,getSubjectsFromGroup} from "../../../../services/labGroupService.js";
import {saveStudent, getIdByEmail} from "../../../../services/studentService.js";
import {saveEnrolled} from "../../../../services/enrolledService.js";
import {extractDuplicateEntry} from "../../../../functions/genericFunctions.js";
import {toast} from "react-toastify";

import StudentInfo from './StudentInfo.js';
import StudentGroup from './StudentGroup.js';
import CsvModal from './CsvModal.js';
import RewriteModal from '../../../Modal/RewriteModal.js';

import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import strings from '../../../../assets/files/strings.json';
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
            const id = await getTeacherId(setTeacherID,userData.login);
            getTeacherLabGroups(setLabGroups,id);
            getSubjectsFromGroup(setSubjects,id);
        };
    
        fetchInfo();
      }, []);

    const handleSaveCsv = async (data) => {
      for (let element of data) {
        try {
          await saveStudentInfo(element.name, element.email, element.githubuser, element.repo, element.group, element.path, false);
        } catch (error) {
          toast.error(t('addStudents.errorSavingStudent'));
          return;
        }
      }
      toast.info(t('addStudents.studentsSaved'));
    };


    function checkData(studentName, studentEmail, studentUser, 
      studentRepository, studentGroup){
      if(studentName === "" || studentEmail === "" ||studentUser === ""
      || studentRepository === "" || studentGroup === ""){
        if(studentName === ""){
          toast.error(t('addStudents.errorWithStudent')+':'+t('addStudents.dataBlank'));
        }else{
          toast.error(t('addStudents.errorWithStudent')+studentName+':'+t('addStudents.dataBlank'));
        }
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
            if(res.code === strings.errors.dupentry){
              toast.error(extractDuplicateEntry(res.error)+t('addStudents.errorExist'));
            }else{
              toast.error(t('addStudents.errorSavingEnroled'));
            }
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
          }
      } catch (error) {
          console.error('Error checking email count:', error);
          return false;
      }
    }


  async function saveStudentInfo(studentName, studentEmail, studentUser, studentRepository, studentGroup, onlyOne=true){
      if(checkData(studentName, studentEmail, studentUser, studentRepository, studentGroup)){
        try {
          const emailExists = await existsEmail(studentEmail);
          if(emailExists){
            setRewriteModalOpen(true);
          }else{
            const res = await saveStudent(studentName, studentEmail, studentUser, studentRepository, studentGroup);
            if (res.response) {
              if(onlyOne){
                toast.info(t('addStudents.studentSaved'));
              }
            } else {
              if(res.code === strings.errors.dupentry){
                toast.error(extractDuplicateEntry(res.error)+t('worksList.errorExist'));
              }else{
                toast.error(t('addStudents.errorSavingStudent'));
              }
            }
          }
        } catch (error) {
          toast.error(t('addStudents.errorSavingStudent'));
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
