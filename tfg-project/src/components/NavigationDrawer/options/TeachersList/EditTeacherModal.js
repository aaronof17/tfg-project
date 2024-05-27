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
    const trimmedEmail = formState.email.trim();
    const trimmedGithubProfile = formState.githubProfile.trim();

    if(formState.name.trim() === "" || formState.email === "" || formState.githubProfile === ""){
      toast.error(t('teachersList.blankInfo'));
      return false;    
    }else if(teachersList.filter(teacher => teacher.email !== formState.id).some(teacher => teacher.email === trimmedEmail)){
      toast.error(t('teachersList.emailExists'));
      return false;
    }else if(teachersList.filter(teacher => teacher.email !== formState.id).some(teacher => teacher.githubProfile === trimmedGithubProfile)){
      toast.error(t('teachersList.userExists'));
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
        onSubmit({ ...formState, email: formState.email.trim(), githubProfile: formState.githubProfile.trim() });
    closeModal();
  };

  return (
    <div
      className="teacheredit-modal-container"
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
