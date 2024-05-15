import React, { useState } from "react";

import {extractId} from "../../../../functions/genericFunctions.js";
import Button from '@mui/material/Button';
import {toast} from "react-toastify";
import { useTranslation } from "react-i18next";

import "./EditModal.css";

function EditModal ({ closeModal, onSubmit, defaultValue, studentsList}){
  const [formState, setFormState] = useState(
    defaultValue || {
      name: "",
      email: "",
      gituser: "",
      repository: ""
    }
  );
  const [t] = useTranslation();

  const validateForm = () => {
    if(formState.name === "" || formState.email === "" ||
      formState.githubuser === "" || formState.repository === ""){
      toast.error(t('studentList.blankInfo'));
      return false;    
    }else if(studentsList.filter(student => student.studentsID !== extractId(formState.id)).some(student => student.email === formState.email)){
      toast.error(t('studentList.emailExists'));
      return false;
    }else if(studentsList.filter(student => student.studentsID !== extractId(formState.id)).some(student => student.githubuser === formState.githubuser)){
      toast.error(t('studentList.userExists'));
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

  return (
    <div
      className="edit-modal-container"
      onClick={(e) => {
        if (e.target.className === "edit-modal-container") closeModal();
      }}
    >
      <div className="modal">
        <form>
          <div className="form-group">
            <label htmlFor="name">{t('studentList.name')}</label>
            <input 
                name="name" 
                onChange={handleChange} 
                value={formState.name}
                maxLength={45}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">{t('studentList.email')}</label>
            <input 
                name="email" 
                onChange={handleChange} 
                value={formState.email}
                maxLength={45}
            />
          </div>
          <div className="form-group">
            <label htmlFor="githubuser">{t('studentList.githubprofile')}</label>
            <input 
                name="githubuser" 
                onChange={handleChange} 
                value={formState.githubuser}
                maxLength={45}
            />
          </div>
          <div className="form-group">
            <label htmlFor="repository">{t('studentList.repository')}</label>
            <input 
                name="repository" 
                onChange={handleChange} 
                value={formState.repository}
                maxLength={200}
            />
          </div> 
          <div className="buttons">
            <Button className="confirm-btn" variant="contained" onClick={handleSubmit}>
                      {t('studentList.confirm')}
            </Button>
            <Button className="cancel-btn" variant="contained" onClick={closeModal}>
                      {t('studentList.cancel')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
