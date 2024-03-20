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
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [percentage, setPercentage] = useState("");
    const [labWorkDetails, setLabWorkDetails] = useState([]);
    const [t] = useTranslation();
    const animatedComponents = makeAnimated();

    useEffect(() => {
        const fetchGroups = async () => {
           // getLabGroups(setLabGroups);
           // getSubjectsFromGroup(setSubjects);
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

      const updateLabWorkDetails = (groupName, initialDate, finalDate) => {
        setLabWorkDetails(current => {
            const index = current.findIndex(detail => detail.name === groupName);
            if (index > -1) {
                let updated = [...current];
                updated[index] = { ...updated[index], initialDate, finalDate };
                return updated;
            } else {
                return [...current, { name: groupName, initialDate, finalDate }];
            }
        });
    };

      function getLabGroupsOption(){
        let options = [];
        if(actualGroups !== undefined){
            for( var i = 0; i < actualGroups.length; i++){
                console.log("pruebina", actualGroups[i].name);
                options[i] = { value: actualGroups[i], label: actualGroups[i]}
            }
        }     
        return options;
      }

      function saveLabWorks(){
        var days = labWorkDetails.map((group) =>
            group.initialDate.getFullYear()
         );
        console.log(days);
      }



      const handleGroupsChange = (e, selectedOption) => {
        if (selectedOption) {
            const fetchFilterGroups = async () => {
                //setActualSubject(selectedOption);
                //getLabGroupsBySubject(selectedOption, 1, setActualGroups);
            };
            fetchFilterGroups();
            
        }
      }

      const handleGroupsSelector = async (selectedOptions) => {
        if (selectedOptions) {
            const selectedGroups = selectedOptions.map(option => option.value);
            setActualGroups(selectedGroups);
        }
    }
    

      const groupsPrueba = [
        { value: "ASL_L1", label: "ASL_L1" },
        { value: "ASL_L2", label: "ASL_L2" },
        { value: "ASL_L3", label: "ASL_L3" },
        { value: "DPPI_L1", label: "DPPI_L1" },
        { value: "DPPI_L2", label: "DPPI_L2" },
        { value: "SEW_L1", label: "SEW_L1" },
        { value: "SEW_L2", label: "SEW_L2" },
        { value: "SEW_L3", label: "SEW_L3" },
        { value: "SEW_L4", label: "SEW_L4" },
        { value: "SEW_L5", label: "SEW_L5" },
        { value: "SEW_L6", label: "SEW_L6" },
        { value: "SEW_L7", label: "SEW_L7" },
        { value: "SEW_L8", label: "SEW_L8" },
        { value: "SEW_L9", label: "SEW_L9" },
        { value: "SEW_L10", label: "SEW_L10" },
        { value: "SEW_L11", label: "SEW_L11" },
        { value: "SEW_L12", label: "SEW_L12" },
        { value: "SEW_L13", label: "SEW_L13" },
        { value: "SEW_L14", label: "SEW_L14" }
      ];


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
                onChange={handleGroupsChange}
            />
            </div>
        </Grid>
        <Grid item xs={9}>
            <div className="filterGroup">
              <Select options={groupsPrueba} components={animatedComponents} onChange={handleGroupsSelector} isMulti/>
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
            <GroupTable setDates={updateLabWorkDetails} labGroups={actualGroups}></GroupTable>
        </div>
        <div className="infoWork">
          <InfoWork setTitle={setTitle} setDescription={setDescription} setPercentage={setPercentage}></InfoWork>
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
