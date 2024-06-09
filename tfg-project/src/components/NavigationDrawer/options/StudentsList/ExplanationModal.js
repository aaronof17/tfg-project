import React, { useState } from "react";

import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

import { useTranslation } from "react-i18next";
import {toast} from "react-toastify";

import "./ExplanationModal.css";

function ExplanationModal ({closeModal, onSubmit}){
    const [t] = useTranslation(); 
    const [file, setFile] = useState(null);
    const [commitTitle, setCommitTitle] = useState("");

    const handleFileUpload = (e) => {
        const files = e.target.files;
        validateFiles(files);
    };

    const handleCommitTitleChange = (e) => {
      setCommitTitle(e.target.value.trim());
    };

    function validateFiles(files){
      if(files.length != 1){
        toast.error(t('studentList.errorNumberFiles'));
      }else{
        const fileFromExplanation = files[0]
        if(!fileFromExplanation.name.endsWith('.pdf')){ 
          toast.error(t('studentList.errorFormatFile'));
        }else{
          setFile(fileFromExplanation);
        }
      }
    }

    const handleSaveExplanation = (e) => {
      if(file){
        if(commitTitle != ""){
          onSubmit(file,commitTitle);
          closeModal();
        }else{
          toast.error(t('studentList.commitTitleBlank'));
        }
      }else{
        toast.error(t('studentList.errorSomethingWentWrong'));
      }
    };

    const cancelOption = (e) => {
      setFile(null);
      setCommitTitle("");
    };


    const handleDrop = (event) => {
      event.preventDefault();
      const files = event.dataTransfer.files;
      validateFiles(files);
    };

    const handleDragOver = (event) => {
      event.preventDefault();
    };


    if(file) return(
      <div
        className="explanation-modal-container"
      >
        <div className="explanation-modal">
          <Grid container spacing={2}>
              <Grid item xs={12}>
                <h4>{t('studentList.informationCharged')}</h4>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="outlined-required"
                  className="commitTitle"
                  label={t('studentList.commitTitle')}
                  type="text"
                  inputProps={{ maxLength: 100 }}
                  onChange={handleCommitTitleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" onClick={handleSaveExplanation} >
                  {t('studentList.sendExplanation')}
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button className="cancel-btn" variant="contained" onClick={cancelOption} >
                  {t('studentList.cancel')}
                </Button>
              </Grid>
          </Grid>
        </div>
      </div>
    )
    
    return (
      <div
        className="explanation-modal-container"
      >
          <div className="explanation-modal">
            <div 
              className="dropzone"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <h3> {t('studentList.dragFile')}</h3>
                    </Grid>
                    <Grid item xs={12}>
                      <input type="file" accept=".pdf" onChange={handleFileUpload} ></input>
                    </Grid>
                </Grid>
              </div>
            <Button className="cancel-btn" variant="contained" onClick={()=>closeModal()} >
              {t('studentList.cancel')}
            </Button>
          </div>
      </div>
  );
};


export default ExplanationModal;
