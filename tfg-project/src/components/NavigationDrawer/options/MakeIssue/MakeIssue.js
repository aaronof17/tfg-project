import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import { useState, useEffect} from 'react';
import {useTranslation} from "react-i18next";

import studentsData from "../students.json";
import {calculateWidth} from "../../../../functions/genericFunctions.js";
   


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


  return (
    <Box
      
      my={4}
      display="flex"
      alignItems="center"
      gap={4}
      p={2}
      sx={{ border: '2px solid grey' }}
    >
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={getStudents()}
        sx={{ width: calculateWidth(getStudents())}}
        renderInput={(params) => <TextField {...params} label="Alumnos" />}
      />
      <p>hola</p>
    </Box>
    
  );
}


export default MakeIssue;
