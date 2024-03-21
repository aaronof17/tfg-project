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


      function saveLabWorks(){
        var days = labWorkDetails.map((group) =>
            group.initialDate.getFullYear()
         );
        console.log(days);
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
    <Grid container spacing={2} className='createLabWorkDiv' justifyContent="center" alignItems="center">   
     <Grid item xs={12}>
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
                    <Select styles={{
                        menu: (base, state) => ({
                            ...base,
                            zIndex: 15
                        })
                    }}
                        options={labGroups} components={animatedComponents} onChange={handleGroupsSelector} isMulti />
                </div>
            </Grid>
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
    <Grid item xs={12}>
        <div className="labGroups">
            <GroupTable setDates={updateLabWorkDetails} labGroups={actualGroups}></GroupTable>
        </div>
    </Grid>
    <Grid item xs={12}>
        <div className="infoWork">
            <InfoWork setTitle={setTitle} setDescription={setDescription} setPercentage={setPercentage}></InfoWork>
        </div>
    </Grid>
    <Grid item xs={12}>
        <div className="saveLabWorks">
            <Button variant="contained" onClick={saveLabWorks}>
                Save Works
            </Button>
        </div>
    </Grid>
</Grid>
  
  );
}


export default CreateLabWork;
