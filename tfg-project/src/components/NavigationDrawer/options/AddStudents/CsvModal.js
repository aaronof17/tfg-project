import React, { useState } from "react";

import Papa from 'papaparse';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

import { useTranslation } from "react-i18next";

import "./CsvModal.css";

function CsvModal ({closeModal, onSubmit, sendError, labgroups, existsEmail}){
    const [t] = useTranslation(); 
    const [data, setData] = useState([]);
    const [file, setFile] = useState(null);

    const handleFileUpload = (e) => {
        const files = e.target.files;
        validateFiles(files);
    };

    function parseCSV(fileParameter){
      Papa.parse(fileParameter, {
        header: true,
        complete: (results) => {
          console.log("Información del archivo CSV cargado:", results.data);
          checkCSVData(results.data,fileParameter)
        },
        error: (error) => {
          console.error("Error al analizar el archivo CSV:", error);
          sendError(t('addStudents.errorAnalizingCSV'));
        }
      });
    }

    async function checkCSVData(csvData,fileParameter){
      for (let i = 0; i < csvData.length; i++) {
        const row = csvData[i];
        if (!row.name || !row.group || !row.email || !row.repo || !row.githubuser) {
          sendError(t('addStudents.errorCSVdataBlank'));
          return false; 
        }

        let groupExists = labgroups.some(group => group.label === row.group);
        if (!groupExists) {
            sendError(t('addStudents.errorGroupNotFound') + row.group);
            return false;
        }

        let emailResponse = await existsEmail(row.email);
        if(emailResponse){
          sendError(t('addStudents.studentExist') + row.email);
          return false;
        }
      }
      setData(csvData);
      setFile(fileParameter);
      console.log("Todos los campos están completos en todas las filas.");
      return true;
    }

    function validateFiles(files){
      if(files.length != 1){
        sendError(t('addStudents.errorNumberFiles'));
      }else{
        const fileFromCsv = files[0]
        if(!fileFromCsv.name.endsWith('.csv')){ 
          sendError(t('addStudents.errorFormatFile'));
        }else{
          parseCSV(fileFromCsv);
        }
      }
    }

    const handlesaveCsvInfo = (e) => {
      if(data){
        onSubmit(data);
        closeModal();
      }else{
        sendError(t('addStudents.errorSomethingWentWrong'));
      }
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
        className="csv-modal-container"
        onClick={(e) => {
          if (e.target.className === "csv-modal-container") closeModal();
        }}
      >
        <div className="csv-modal">
          <Grid container spacing={2}>
              <Grid item xs={12}>
                <h4>{t('addStudents.informationCharged')}</h4>
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" onClick={handlesaveCsvInfo} >
                  {t('addStudents.saveStudents')}
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" onClick={() => setFile(null)} >
                  {t('addStudents.cancel')}
                </Button>
              </Grid>
          </Grid>
        </div>
      </div>
    )
    
    return (
      <div
        className="csv-modal-container"
        onClick={(e) => {
          if (e.target.className === "csv-modal-container") closeModal();
        }}
      >
          <div className="csv-modal">
            <div 
              className="dropzone"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <h3> {t('addStudents.dragFile')}</h3>
                    </Grid>
                    <Grid item xs={12}>
                      <input type="file" accept=".csv" onChange={handleFileUpload} ></input>
                    </Grid>
                </Grid>
              </div>
          </div>
      </div>
  );
};


export default CsvModal;
