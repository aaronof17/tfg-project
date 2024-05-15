import React, { useState } from "react";

import {extractId} from "../../../../functions/genericFunctions.js";
import {toast} from "react-toastify";
import { useTranslation } from "react-i18next";

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';

import "./EditLabGroupModal.css";

function EditLabGroupModal ({ closeModal, onSubmit, defaultValue, groupsList, teachersList}){
  const [formState, setFormState] = useState(
    defaultValue || {
      name: "",
      subject: "",
      teacherName: ""
    }
  );
  const [t] = useTranslation();

  const validateForm = () => {
    if(formState.name === "" || formState.subject === "" || formState.teacherName === ""){
      toast.error(t('groupsList.blankInfo'));
      return false;    
    }else if(groupsList.filter(group => group.id !== formState.id).some(group => group.name === formState.name)){
      toast.error(t('groupsList.nameExists'));
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSubmit(formState);
    closeModal();
  };

  const handleTeacherAssignedChange = (e, selectedOption) => {
    if (selectedOption) {
      setFormState({ ...formState, teacherName: selectedOption});
    }else{
      setFormState({ ...formState, teacherName: ""});
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


  return (
    <div
      className="groupedit-modal-container"
      onClick={(e) => {
        if (e.target.className === "groupedit-modal-container") closeModal();
      }}
    >
      <div className="modal">
        <form>
          <div className="form-group">
            <label htmlFor="name">{t('groupsList.name')}</label>
            <input 
                name="name" 
                onChange={handleChange} 
                value={formState.name}
                maxLength={45}
            />
          </div>
          <div className="form-group">
            <label htmlFor="subject">{t('groupsList.subject')}</label>
            <input 
                name="subject" 
                onChange={handleChange} 
                value={formState.subject}
                maxLength={45}
            />
          </div>
          <div className="form-group">
            <label htmlFor="teacherName">{t('groupsList.teacherName')}</label>
            <Autocomplete
              name="teacherName"
              disablePortal
              id="teacher-combo-box"
              options={getTeachersOptions()}
              renderInput={(params) => <TextField {...params} label={t('groupsList.teacherName')} />}
              onChange={handleTeacherAssignedChange}
            />
          </div>
          <div className="buttons">
            <Button className="confirm-btn" variant="contained" onClick={handleSubmit}>
                      {t('groupsList.confirm')}
            </Button>
            <Button className="cancel-btn" variant="contained" onClick={closeModal}>
                      {t('groupsList.cancel')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLabGroupModal;
