import React, { useState } from "react";

import {extractId} from "../../../../functions/genericFunctions.js";
import Button from '@mui/material/Button';
import {toast} from "react-toastify";
import { useTranslation } from "react-i18next";

import "./EditTeacherModal.css";

function EditTeacherModal ({ closeModal, onSubmit, defaultValue, teachersList}){
  const [formState, setFormState] = useState(
    defaultValue || {
      name: "",
      email: "",
      githubProfile: ""
    }
  );
  const [t] = useTranslation();

  const validateForm = () => {

    if(formState.name === "" || formState.email === "" || formState.githubProfile === ""){
      toast.error(t('teachersList.blankInfo'));
      return false;    
    }else if(teachersList.filter(teacher => teacher.email !== formState.id).some(teacher => teacher.email === formState.email)){
      toast.error(t('teachersList.emailExists'));
      return false;
    }else if(teachersList.filter(teacher => teacher.email !== formState.id).some(teacher => teacher.githubProfile === formState.githubProfile)){
      toast.error(t('teachersList.userExists'));
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
      className="teacheredit-modal-container"
      onClick={(e) => {
        if (e.target.className === "teacheredit-modal-container") closeModal();
      }}
    >
      <div className="modal">
        <form>
          <div className="form-group">
            <label htmlFor="name">{t('teachersList.name')}</label>
            <input 
                name="name" 
                onChange={handleChange} 
                value={formState.name}
                maxLength={100}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">{t('teachersList.email')}</label>
            <input 
                name="email" 
                onChange={handleChange} 
                value={formState.email}
                maxLength={70}
            />
          </div>
          <div className="form-group">
            <label htmlFor="githubProfile">{t('teachersList.githubprofile')}</label>
            <input 
                name="githubProfile" 
                onChange={handleChange} 
                value={formState.githubProfile}
                maxLength={70}
            />
          </div>
          <div className="buttons">
            <Button className="confirm-btn" variant="contained" onClick={handleSubmit}>
                      {t('teachersList.confirm')}
            </Button>
            <Button className="cancel-btn" variant="contained" onClick={closeModal}>
                      {t('teachersList.cancel')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTeacherModal;
