import * as React from 'react';
import { useState, useEffect} from 'react';
import {useTranslation} from "react-i18next";

import studentsData from "../students.json";
import SelectableList from "./SelectableList.js";
import {calculateWidth} from "../../../../functions/genericFunctions.js";
import {createIssue} from "../../../../functions/gitHubFunctions.js";

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import {toast} from "react-toastify";


import './MakeIssue.css';
import CreateIssueModal from './CreateIssueModal.js';

function MakeIssue() {

  const [students, setStudents] = useState( );
  const [t] = useTranslation();
  const [availableStudents, setAvailableStudents] = useState([
    { id: 1, name: 'Estudiante 1' },
    { id: 2, name: 'Estudiante 2' },
    { id: 3, name: 'Estudiante 3' },
    { id: 4, name: 'Estudiante 4' },
    { id: 5, name: 'Estudiante 5' },
    { id: 6, name: 'Estudiante 6' },
    { id: 7, name: 'Estudiante 7' },
    { id: 8, name: 'Estudiante 8' },
    { id: 9, name: 'Estudiante 9' },
  ]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    // const fetchInfo = async () => {
    //     const id = await getTeacherId(setTeacherID,userData.html_url);
    //     getLabWorks(setLabWorks,id);
    //     getStudents(setStudents,id);
    // };

    // fetchInfo();
  }, []);

  const getStudents= () =>{
    let options = [];
    if(students != undefined){
      students.map((student,index) => {
      
        options[index] = student.name;

      });
    }     

    return options;

  }

  function getIssueForm(){
    setModalOpen(true)
  }

  const saveIssue = () => {
    createIssue('AaronOF27','prueba',title,description,"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").then((res) =>{
      if(res.response){
        setModalOpen(false);
        toast.info("Issue creada con éxito");
      }else{
        toast.error("Hubo un error");
      }
    });
  };



return (
  <div className='make-issue-container'>
    <Grid container spacing={2}>
      <Grid item xs={1}>
      </Grid>
      <Grid item xs={4}>
          <div className="filterSubject">
              <Autocomplete
                  disablePortal
                  id="subject-combo-box"
                  options={getStudents()}
                  renderInput={(params) => <TextField {...params} label={t('mark.labWork')} />}
                  //onChange={handleWorkChange}
              />
          </div>
      </Grid>
      <Grid item xs={1}>
      </Grid>
      <Grid item xs={5}>
          <div className="filterLabGroup">
              <Autocomplete
                  disablePortal
                  id="group-combo-box"
                  options={getStudents()}
                  renderInput={(params) => <TextField {...params} label={t('mark.students')} />}
                  //onChange={handleStudentChange}
              />
          </div>
      </Grid>
      <Grid item xs={1}>
      </Grid>
    </Grid>
    <SelectableList
      availableStudents={availableStudents}
      setAvailableStudents={setAvailableStudents}
      selectedStudents={selectedStudents}
      setSelectedStudents={setSelectedStudents}
    ></SelectableList>
    <Button variant="contained" onClick={getIssueForm}>
            Rellenar datos
    </Button>
    {modalOpen && (
      <CreateIssueModal
        closeModal={() => {
          setModalOpen(false);
        }}
        onSubmit={saveIssue}
        setTitle={setTitle}
        title={title}
        setDescription={setDescription}
        description={description}
      />
    )}
  </div>
  
);
}


export default MakeIssue;
