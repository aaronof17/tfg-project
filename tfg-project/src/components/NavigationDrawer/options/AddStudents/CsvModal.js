import React, { useState } from "react";

import Papa from 'papaparse';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

import { useTranslation } from "react-i18next";

import "./CsvModal.css";

function CsvModal ({closeModal, onSubmit}){
    const [t] = useTranslation(); 
    const [data, setData] = useState([]);
    const [file, setFile] = useState(null);
    //const [dataChargedMessage, setDataChargedMessage] = useState(false);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        setFile(file)
        Papa.parse(file, {
        header: true,
        complete: (results) => {
            setData(results.data);
        },
        });
        
    };

    function saveCsvInfo(){
   
    }

    const handleDrop = (event) => {
      event.preventDefault();
      setFile(event.dataTransfer.files)
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
                <h4>¡La información se ha cargado con éxito!</h4>
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" onClick={saveCsvInfo} >
                  {"Guardar alumnos"}
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" onClick={() => setFile(null)} >
                  {"Cancelar"}
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
                      <h3>Arrastre el archivo a la zona</h3>
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
