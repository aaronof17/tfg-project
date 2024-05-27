import * as React from 'react';
import { useState, useEffect} from 'react';
import {useTranslation} from "react-i18next";
import {toast} from "react-toastify";
import {getTeachers} from "../../../../services/teacherService.js";
import { extractDuplicateEntry } from '../../../../functions/genericFunctions.js';
import {saveLabGroup} from "../../../../services/labGroupService.js";

import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';

import strings from '../../../../assets/files/strings.json';
import './AddLabGroup.css';

function AddLabGroup({userData}) {
  const [t] = useTranslation();
  const [groupName, setGroupName] = useState("");
  const [subject, setSubject] = useState("");
  const [teacherAssigned, setTeacherAssigned] = useState("");
  const [teachersList, setTeachersList] = useState([]);

  useEffect(() => {
    const fetchInfo = async () => {
      const teachers = await getTeachers();
      console.log(teachers);
      setTeachersList(teachers);
      
    };

    fetchInfo();
  }, []);

  const handleGroupNameChange = (e) => {
    setGroupName(e.target.value);
  };

  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
  };

  const handleTeacherAssignedChange = (e, selectedOption) => {
    if (selectedOption) {
        setTeacherAssigned(selectedOption);
    }else{
      setTeacherAssigned("");
    }
  }

  const getTeachersOptions= () =>{
    let options = [];
    if(teachersList != undefined){
      teachersList.map((teacher,index) => {
        options[index] = {
            label: `${teacher.name}`,
            value: teacher.TeacherID
        };
      });
    }     

    return options;
  }

  function checkData(){
    if(groupName.trim() === "" || subject.trim() === "" ||teacherAssigned === "" ){
      toast.error(t('addLabGroups.dataBlank'));
      return false;
    }else{
      return true;
    }
  }

  async function saveTeacherInfo(){
    if(checkData()){
      try {
        const res = await saveLabGroup(groupName.trim(), subject.trim(), teacherAssigned.value);
        if (res.response) {
          toast.info(t('addLabGroups.groupSaved'));
          setGroupName("");
          setTeacherAssigned("");
          setSubject("");
        } else {
          if(res.code === strings.errors.dupentry){
            toast.error(extractDuplicateEntry(res.error)+t('addLabGroups.errorExist'));
          }else{
            toast.error(t('addLabGroups.errorSavingGroup'));
          }
        }
      } catch (error) {
        toast.error(t('addLabGroups.errorSavingGroup'));
      }
    }
  }

  return (
    <div className='groups-add-div'>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
            <TextField
              id="outlined-required"
              className="groupName"
              label={t('addLabGroups.name')}
              type="text"
              value={groupName}
              inputProps={{ maxLength: 45 }}
              onChange={handleGroupNameChange}
              sx={{ width: '100%' }}
            />
        </Grid>
        <Grid item xs={12} sm={6}>
            <TextField
              id="outlined-required"
              className="subject"
              label={t('addLabGroups.subject')}
              type="text"
              value={subject}
              inputProps={{ maxLength: 45 }}
              onChange={handleSubjectChange}
              sx={{ width: '100%' }}
            />
        </Grid>
        <Grid item xs={12} sm={3}>
        </Grid>
        <Grid item xs={12} sm={6}>
            <Autocomplete
              disablePortal
              id="teacher-combo-box"
              options={getTeachersOptions()}
              renderInput={(params) => <TextField {...params} label={t('addLabGroups.assignedTeacher')} />}
              onChange={handleTeacherAssignedChange}
              value={teacherAssigned}
            />
        </Grid>
      </Grid>
      <div className='groups-add-buttons'>
        <Button variant="contained" onClick={saveTeacherInfo} >
          {t('addLabGroups.add')}
        </Button>
      </div>
    </div>
  );
}


export default AddLabGroup;
