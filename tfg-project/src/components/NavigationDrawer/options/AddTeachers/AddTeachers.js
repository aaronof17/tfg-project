import * as React from 'react';
import { useState, useEffect} from 'react';
import {useTranslation} from "react-i18next";
import {toast} from "react-toastify";
import {saveTeacher} from "../../../../services/teacherService.js";
import { extractDuplicateEntry } from '../../../../functions/genericFunctions.js';

import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import strings from '../../../../assets/files/strings.json';
import './AddTeachers.css';

function AddTeachers() {
  const [t] = useTranslation();
  const [teacherName, setTeacherName] = useState("");
  const [teacherEmail, setTeacherEmail] = useState("");
  const [teacherGitUser, setTeacherGitUser] = useState("");

  const handleTeacherNameChange = (e) => {
    setTeacherName(e.target.value);
  };

  const handleTeacherEmailChange = (e) => {
    setTeacherEmail(e.target.value);
  };

  const handleTeacherUserChange = (e) => {
    setTeacherGitUser(e.target.value);
  };

  function checkData(){
    if(teacherName.trim() === "" || teacherEmail.trim() === "" ||teacherGitUser.trim() === ""){
      toast.error(t('addTeachers.dataBlank'));
      return false;
    }else{
      return true;
    }
  }

  async function saveTeacherInfo(){
    if(checkData()){
      try {
        const res = await saveTeacher(teacherName.trim(), teacherEmail.trim(), teacherGitUser.trim());
        if (res.response) {
          toast.info(t('addTeachers.teacherSaved'));
          setTeacherName("");
          setTeacherEmail("");
          setTeacherGitUser("");
        } else {
          if(res.code === strings.errors.dupentry){
            toast.error(extractDuplicateEntry(res.error)+t('addTeachers.errorExist'));
          }else{
            toast.error(t('addTeachers.errorSavingTeacher'));
          }
        }
      } catch (error) {
        toast.error(t('addTeachers.errorSavingTeacher'));
      }
    }
  }

  return (
    <div className='teachers-add-div'>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12}>
            <TextField
                id="outlined-required"
                className="teacherName"
                label={t('addTeachers.name')}
                type="text"
                value={teacherName}
                inputProps={{ maxLength: 100 }}
                onChange={handleTeacherNameChange}
                sx={{ width: '100%' }}
            />
        </Grid>
        <Grid item xs={12} sm={6}>
            <TextField
                id="outlined-required"
                className="teacherEmail"
                label={t('addTeachers.email')}
                type="email"
                value={teacherEmail}
                inputProps={{ maxLength: 70 }}
                onChange={handleTeacherEmailChange}
                sx={{ width: '100%' }}
            />
        </Grid>
        <Grid item xs={12} sm={6}>
            <TextField
                id="outlined-required"
                className="teacherGitHubUser"
                label={t('addTeachers.user')}
                type="text"
                value={teacherGitUser}
                inputProps={{ maxLength: 70 }}
                onChange={handleTeacherUserChange}
                sx={{ width: '100%' }}
            />
        </Grid>
      </Grid>
      <div className='teachers-add-buttons'>
        <Button variant="contained" onClick={saveTeacherInfo} >
          {t('addTeachers.add')}
        </Button>
      </div>
    </div>
  );
}


export default AddTeachers;
