import * as React from 'react';
import { useState, useEffect} from 'react';
import {useTranslation} from "react-i18next";
import {getStundentId} from "../../../../services/studentService.js";
import {getWorksByStudentId, getWorksBySubjectAndStudent} from "../../../../services/labWorkService.js";
import {getSubjectsForStudent} from "../../../../services/labGroupService.js";

import WorkView from './WorkView.js';
import './StudentWorks.css';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

function StudentWorks({userData}) {
    const [t] = useTranslation();
    const [works, setWorks] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [studentID, setStudentId] = useState("");
   

  useEffect(() => {
      const fetchInfo = async () => {
        const id = await getStundentId(setStudentId,userData.login);
        getWorksByStudentId(setWorks,id);
        getSubjectsForStudent(setSubjects,id);
      };
  
      fetchInfo();
    }, []);


  const handleSubjectChange = (e, selectedOption) => {
    if (selectedOption) {
      const fetchFilterWorks = async () => {
        getWorksBySubjectAndStudent(selectedOption, setWorks, studentID);
      };
      fetchFilterWorks();
    }else{
      const fetchAllWorks = async () => {
        getWorksByStudentId(setWorks,studentID);
      };
      fetchAllWorks();
    }
  }

  return (
    <div className='student-works-container'>
      {subjects.length !== 0 ? 
        (
          <div className='student-works-filter-container'>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3}>
              </Grid>
              <Grid item xs={12} sm={6}>
                  <Autocomplete
                  disablePortal
                  id="labgroup-combo-box"
                  options={subjects.map((s) => s.subject)}
                  renderInput={(params) => <TextField {...params} label={t('studentWorks.subject')} />}
                  onChange={handleSubjectChange}
                  />
              </Grid>
              <Grid item xs={12} sm={3}>
              </Grid>
            </Grid>
          </div>
        )
        :
        (
          <></>
        )
        }
        {works.length !== 0 ? 
        works.map((work) => {
          return <WorkView key={work.id} work={work}></WorkView>
        })
        :
        <div className='student-works-empty-container'>
          <h3>{t('studentWorks.worksBlank')}</h3>
        </div>
        }
    </div>
  );
}


export default StudentWorks;
