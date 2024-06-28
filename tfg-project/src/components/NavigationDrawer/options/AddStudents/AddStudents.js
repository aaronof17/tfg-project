import * as React from 'react';
import { useState, useEffect} from 'react';
import {useTranslation} from "react-i18next";
import {getTeacherId} from "../../../../services/teacherService.js";
import {getTeacherLabGroups,getSubjectsFromGroup} from "../../../../services/labGroupService.js";
import {saveStudent, getIdByEmail, getIdByUser} from "../../../../services/studentService.js";
import {saveEnrolled} from "../../../../services/enrolledService.js";
import {extractDuplicateEntry} from "../../../../functions/genericFunctions.js";
import {toast} from "react-toastify";

import StudentInfo from './StudentInfo.js';
import StudentGroup from './StudentGroup.js';
import CsvModal from './CsvModal.js';
import RewriteModal from '../../../Modal/RewriteModal.js';
import EnrollModal from './EnrollModal.js';

import Grid from '@mui/material/Grid';
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
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
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
        await saveStudentInfo(element.name, element.email, element.githubuser, element.repo, element.group, false);
      } catch (error) {
        toast.error(t('addStudents.errorSavingStudent'));
        return;
      }
    }
    toast.info(t('addStudents.studentsSaved'));
  };

  const enrollStudent = async (studentToEnroll,groupEnroll,repositoryForStudent) => {
    saveEnrolled(studentToEnroll, groupEnroll, repositoryForStudent).then((res)=>{
      if(res.response){
          toast.info(t('addStudents.studentEnrolled'));
      }else{
        if(res.code === strings.errors.dupentry){
          toast.error(t('addStudents.errorStudentAlreadyEnrolled'));
        }else{
          toast.error(t('addStudents.errorSavingEnroled'));
        }
      }
    });
  }


  function checkData(studentName, studentEmail, studentUser, 
    studentRepository, studentGroup){
    if(studentName.trim() === "" || studentEmail.trim() === "" ||studentUser.trim() === ""
    || studentRepository.trim() === "" || studentGroup === ""){
      if(studentName.trim() === ""){
        toast.error(t('addStudents.errorWithStudent')+t('addStudents.dataBlank'));
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

  function openEnrollModal(){
    setEnrollModalOpen(true);
  }

  function addEnrolled(){
    saveEnrolled(studentId, group.label, repository.trim()).then((res)=>{
        if(res.response){
            toast.info(t('addStudents.studentEnrolled'));
            setName("");
            setEmail("");
            setUser("");
            setRepository("");
            setSubject("");
            setGroup("");
        }else{
          if(res.code === strings.errors.dupentry){
            toast.error(t('addStudents.errorStudentAlreadyEnrolled'));
          }else{
            toast.error(t('addStudents.errorSavingEnroled'));
          }
        }
    });
  }

  async function existsEmail(actualEmail){
    try {
        const res = await getIdByEmail(actualEmail.trim());
        if (res.response) {
            if(!isNaN(res.data)){
              setStudentId(res.data);
              return true;
            }else{
              return false;
            }
        }
    } catch (error) {
        return false;
    }
  }

  async function existsUser(actualUser){
    try {
        const res = await getIdByUser(actualUser.trim());
        if (res.response) {
            if(!isNaN(res.data)){
              setStudentId(res.data);
              return true;
            }else{
              return false;
            }
        }
    } catch (error) {
        return false;
    }
  }

  async function saveStudentInfo(studentName, studentEmail, studentUser, studentRepository, studentGroup, onlyOne=true){
      if(checkData(studentName, studentEmail, studentUser, studentRepository, studentGroup)){
        try {
          const emailExists = await existsEmail(studentEmail);
          if(emailExists && onlyOne){
            setRewriteModalOpen(true);
          }else{
            const res = await saveStudent(studentName.trim(), studentEmail.trim(), studentUser.trim(), studentRepository.trim(), studentGroup.label);
            if (res.response) {
              if(onlyOne){
                toast.info(t('addStudents.studentSaved'));
                setName("");
                setEmail("");
                setUser("");
                setRepository("");
                setSubject("");
                setGroup("");
                getTeacherLabGroups(setLabGroups,teacherID);
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
        <StudentInfo name={name} setName={setName} email={email} setEmail={setEmail} user={user} setUser={setUser} repository={repository} setRepository={setRepository}></StudentInfo>
        <StudentGroup group={group} labGroups={labGroups} setLabGroups={setLabGroups} subjects={subjects} 
            subject={subject} setSubject={setSubject} setGroup={setGroup} teacherID={teacherID}>
        </StudentGroup>
        <div className='students-add-buttons'>
            <Grid container spacing={2}>
                <Grid item xs={3}>
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
                <Grid item xs={12} sm={2}>
                    <Button variant="contained" onClick={openEnrollModal} >
                      {t('addStudents.enrollStudent')}
                    </Button>
                </Grid>
                <Grid item xs={3}>
                </Grid>
            </Grid>
        </div>
        {modalOpen && (
          <CsvModal
            closeModal={() => {
              setModalOpen(false);
            }}
            onSubmit={handleSaveCsv}
            labgroups={getTeacherLabGroups(setLabGroups,teacherID)}
            existsEmail={existsEmail}
            existsUser={existsUser}
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
        {enrollModalOpen && (
                <EnrollModal
                closeModal={() => {
                  setEnrollModalOpen(false);
                }}
                onSubmit={enrollStudent}
                teacherID={teacherID}
                />
        )}
    </div>
  );
}


export default AddStudents;
