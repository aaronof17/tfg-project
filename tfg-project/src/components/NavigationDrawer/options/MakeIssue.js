import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useState, useEffect} from 'react';
import {useTranslation} from "react-i18next";
import studentsData from "./students.json";

function MakeIssue() {

  const [students, setStudents] = useState( );
    const [t,i18n] = useTranslation();

    useEffect(function() {
        setStudents(studentsData.students);
    });

    const getStudents= () =>{
      let options = [];
      if(students != undefined){
        students.map((student,index) => {
        
          options[index] = student.name;

        });
      }     

      return options;

    }

    const calculateMenuWidth = () => {
      const longestOption = Math.max(...getStudents().map(option => option.length));
      const approximateCharWidth = 8; 
      return longestOption * approximateCharWidth;
    };
   
  return (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={getStudents()}
      sx={{ width: calculateMenuWidth()}}
      renderInput={(params) => <TextField {...params} label="Alumnos" />}
    
  />
  );
}


export default MakeIssue;
