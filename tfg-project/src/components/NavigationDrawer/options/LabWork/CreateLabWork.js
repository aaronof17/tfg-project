import * as React from 'react';
import './CreateLabWork.css';

import { useState, useEffect} from 'react';
import {useTranslation} from "react-i18next";
import {getLabGroups,getSubjectsFromGroup,getLabGroupsBySubject} from "../../../../repositories/labGroupRepository.js";
import GroupTable from "./GroupTable.js";
import InfoWork from "./InfoWork.js";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

import Select from "react-select";
import makeAnimated from 'react-select/animated';
import {calculateWidth} from "../../../../functions/genericFunctions.js";

function CreateLabWork() {
    const [labGroups, setLabGroups] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [actualSubject, setActualSubject] = useState("");
    const [actualGroups, setActualGroups] = useState([]);
    const [t] = useTranslation();
    const animatedComponents = makeAnimated();

    useEffect(() => {
        const fetchGroups = async () => {
           getLabGroups(setLabGroups);
           getSubjectsFromGroup(setSubjects);
        };
    
        fetchGroups();
      }, []);

      const getSubjects= () =>{
        let options = [];
        if(subjects != undefined){
            subjects.map((subject,index) => {
                options[index] = subject.subject;
          });
        }     
        return options;
      }


      function saveLabWorks(){

      }



      const handleSubjectChange = (e, selectedOption) => {
        if (selectedOption) {
            const fetchFilterGroups = async () => {
                setActualSubject(selectedOption);
                getLabGroupsBySubject(selectedOption, 1, setLabGroups);
            };
            fetchFilterGroups();
        }else{
          const fetchAllGroups = async () => {
            setActualSubject("");
            getLabGroups(setLabGroups);
          };
          fetchAllGroups();
        }
      }

      const handleGroupsSelector = async (selectedOptions) => {
        if (selectedOptions) {
            const selectedGroups = selectedOptions.map(option => option.value);
            setActualGroups(selectedGroups);
        }
    }
    



  return (
    <div className='createLabWorkDiv'>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <div className="filterSubject">
            <Autocomplete
                disablePortal
                id="subject-combo-box"
                options={getSubjects()}
                renderInput={(params) => <TextField {...params} label={t('createLabWork.subjectFilter')} />}
                onChange={handleSubjectChange}
            />
            </div>
        </Grid>
        <Grid item xs={9}>
            <div className="filterGroup">
              <Select options={labGroups} components={animatedComponents} onChange={handleGroupsSelector} isMulti/>
            </div>
        </Grid>
      </Grid>
{/* 
        <div className="filters-container">
            <div className="filterSubject">
                <Autocomplete
                    disablePortal
                    id="subject-combo-box"
                    options={getSubjects()}
                    renderInput={(params) => <TextField {...params} label={t('createLabWork.subjectFilter')} />}
                    onChange={handleGroupsChange}
                />
            </div>
            <div className="filterGroup">
                <Select options={groupsPrueba} components={animatedComponents} onChange={handleGroupsSelector} isMulti/>
            </div>
        </div> */}


        <div className="labGroups">
            <GroupTable labGroups={actualGroups}></GroupTable>
        </div>
        <div className="infoWork">
          <InfoWork></InfoWork>
        </div>
        <div className="saveLabWorks" >
            <Button variant="contained" onClick={saveLabWorks}>
              Save Works
            </Button>
          </div>
    </div>
  );
}


export default CreateLabWork;
