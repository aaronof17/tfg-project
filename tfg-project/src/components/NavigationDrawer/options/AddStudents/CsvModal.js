import React, { useState } from "react";

import Papa from 'papaparse';
import Button from '@mui/material/Button';

import { useTranslation } from "react-i18next";

import "./CsvModal.css";

function CsvModal ({closeModal, deleteRow, titleText,text}){
    const [t] = useTranslation(); 
    const [data, setData] = useState([]);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        Papa.parse(file, {
        header: true,
        complete: (results) => {
            setData(results.data);
        },
        });
        console.log("data ",data);
    };

    return (
    <div
      className="csv-modal-container"
      onClick={(e) => {
        if (e.target.className === "csv-modal-container") closeModal();
      }}
    >
        <div className="csv-modal">
            <h3>Arrastre el archivo a la zona</h3>
           <input type="file" accept=".csv" onChange={handleFileUpload} ></input>
        </div>
    </div>
  );
};

export default CsvModal;
