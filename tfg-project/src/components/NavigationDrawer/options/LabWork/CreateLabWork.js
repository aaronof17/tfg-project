import * as React from 'react';
import { useState, useEffect} from 'react';
import {useTranslation} from "react-i18next";
import {getLabGroups,getSubjectsFromGroup} from "../../../../repositories/labGroupRepository.js";
import './CreateLabWork.css';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

import Select from "react-select";
import makeAnimated from 'react-select/animated';
import {calculateWidth} from "../../../../functions/genericFunctions.js";

function CreateLabWork() {
    const [labGroups, setLabGroups] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [t,i18n] = useTranslation();
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
        console.log("options ", options);
        return options;
  

      }
      const colourOptions = [
        { value: "ocean1", label: "Ocean" },
        { value: "blue", label: "Blue" },
        { value: "purple", label: "Purple" },
        { value: "red", label: "Red" },
        { value: "orange", label: "Orange" },
        { value: "yellow", label: "Yellow" },
        { value: "green", label: "Green" },
        { value: "forest", label: "Forest" },
        { value: "slate", label: "Slate" },
        { value: "silver", label: "Silver" }
      ];

  return (
    <div className='createLabWorkDiv'>
        <div className="filters-container">
            <div className="filterSubject">
                <Autocomplete
                    disablePortal
                    id="subject-combo-box"
                    options={getSubjects()}
                    renderInput={(params) => <TextField {...params} label={t('createLabWork.subjectFilter')} />}
                />
            </div>
            <div className="filterGroup">
                <Select options={colourOptions} components={animatedComponents} isMulti/>
            </div>
            </div>
        <div className="labGroups">
            <p>filtros</p>
        </div>
        <div className="infoWork">
            <p>filtros</p>
        </div>
    </div>
  );
}


export default CreateLabWork;
