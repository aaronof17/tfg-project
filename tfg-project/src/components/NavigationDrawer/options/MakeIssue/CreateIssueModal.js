import React from "react";
import { useTranslation } from "react-i18next";
import {toast} from "react-toastify";

import Button from '@mui/material/Button';
import "./CreateIssueModal.css";

function CreateIssueModal ({ closeModal, onSubmit, title, setTitle, description, setDescription}){
  const [t] = useTranslation();

  const handleChangeTitle = (e) => {
    setTitle(e.target.value);
  };

  const handleChangeDescription = (e) => {
    setDescription(e.target.value);
  };

  const validateForm = () => {
    if(title.trim() === "" || description.trim() === ""){
       toast.error(t('makeIssue.dataBlank'));
       return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    if(validateForm()){
        onSubmit();
    }

  };


  const handleCancel = (e) => {
    setTitle("");
    setDescription("");
    closeModal();
  };

  return (
    <div className="create-issue-modal-container"
    >
        <div className="modal">
        <form>
          <div className="form-group">
            <label htmlFor="title">{t('makeIssue.title')}</label>
            <input 
                name="title" 
                onChange={handleChangeTitle} 
                maxLength={50}
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">{t('makeIssue.description')}</label>
            <textarea
              name="description"
              onChange={handleChangeDescription}
              maxLength={1000}
            />
          </div>
          
          <Button className="confirm-btn" variant="contained" onClick={handleSubmit}>
                    {t('makeIssue.sendIssue')}
          </Button>
          <Button className="cancel-btn" variant="contained" onClick={handleCancel}>
                    {t('addStudents.cancel')}
          </Button>
        </form>
        </div>
    </div>
  );
};

export default CreateIssueModal;
