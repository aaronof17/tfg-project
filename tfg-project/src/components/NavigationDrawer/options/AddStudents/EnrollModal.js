import React, { useState,useEffect } from "react";

import { getAllStudents } from "../../../../services/studentService.js";
import {toast} from "react-toastify";
import { useTranslation } from "react-i18next";

import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

import "./EnrollModal.css";

function EnrollModal ({ closeModal, onSubmit, labGroups}){
  const [t] = useTranslation();
  const [studentToEnroll, setStudentToEnroll] = useState("");
  const [groupEnroll, setGroupEnroll] = useState("");
  const [repository, setRepository] = useState("");
  const [allStudents, setAllStudents] = useState([]);

  useEffect(() => {
    const fetchInfo = async () => {
      getAllStudents(setAllStudents);
    };

    fetchInfo();
  }, []);

  const handleGroupChange = (e, selectedOption) => {
    if (selectedOption) {
      setGroupEnroll(selectedOption.value);
    }else{
      setGroupEnroll("");
    }
  }

  const handleStudentChange = (e, selectedOption) => {
    if (selectedOption) {
      setStudentToEnroll(selectedOption.value);
    }else{
      setStudentToEnroll("");
    }
  }

  const handleRepositoryChange = (e) => {
    setRepository(e.target.value);
  }

  const getGroupsOptions= () =>{
    let options = [];
    if(labGroups != undefined){
      labGroups.map((group,index) => {
        options[index] = {
            label: group.label,
            value: group.value
        };
      });
    }     
    return options;
  }

  const getStudentsOptions= () =>{
    let options = [];
    if(allStudents != undefined){
      allStudents.map((student,index) => {
        options[index] = {
          label: student.name+" - "+student.email,
          value: student.studentsID
        };
      });
    }     
    return options;
  }

  const validateForm = () => {
    if(studentToEnroll === "" || groupEnroll === "" || repository === ""){
      toast.error(t('addStudents.dataBlank'));
      return false;    
    }
    return true;
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSubmit(studentToEnroll,groupEnroll,repository);
    closeModal();
  };

  const closeModalMethod = ()=>{
    setAllStudents("");
    setGroupEnroll("");
    setStudentToEnroll("");
    closeModal();
  }

  return (
    <div
      className="enroll-modal-container"
    >
     <div className="modal">
        <form>
         <div className="form-group">
            <label htmlFor="student">{t('addStudents.student')}</label>
            <Autocomplete
              name="student"
              disablePortal
              id="student-combo-box"
              options={getStudentsOptions()}
              renderInput={(params) => <TextField {...params} label={t('addStudents.student')} />}
              onChange={handleStudentChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="labgroup">{t('addStudents.labgroup')}</label>
            <Autocomplete
              name="labgroup"
              disablePortal
              id="group-combo-box"
              options={getGroupsOptions()}
              renderInput={(params) => <TextField {...params} label={t('addStudents.labgroup')} />}
              onChange={handleGroupChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="repository">{t('addStudents.repository')}</label>
            <input 
                name="repository" 
                onChange={handleRepositoryChange} 
                value={repository}
                maxLength={200}
            />
          </div>
          <div className="buttons">
            <Button className="confirm-btn" variant="contained" onClick={handleSubmit}>
                      {t('addStudents.enrollStudent')}
            </Button>
            <Button className="cancel-btn" variant="contained" onClick={closeModal}>
                      {t('addStudents.cancel')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnrollModal;
