import  React, {useState, useEffect} from "react";
import axios from "axios";
import studentsData from "./students.json";

import { DataGrid } from '@mui/x-data-grid';
import {useTranslation} from "react-i18next";


function StudentsList(props) {
    const [students, setStudents] = useState( );
    const [t,i18n] = useTranslation();

    useEffect(function() {
        setStudents(studentsData.students);
    });

    const handleChangeLanguage = (lang) => {
      i18n.changeLanguage(lang);
    }

    
    const calculateWidth = (list) => {
      const longestOption = Math.max(...list.map(option => option.length));
      console.log("lista ->",longestOption);

      const approximateCharWidth = 10; 
      return longestOption * approximateCharWidth;
    };

    const getColumns = () =>{
      let columns = [];
      if(students != undefined){
  
        columns = [ 
          { field: 'id', headerName: 'ID', width: calculateWidth(students.map((student)=>student.id)) },
          { field: 'name', headerName: t('studentList.name'), width: calculateWidth(students.map((student)=>student.name)) },
          { field: 'username', headerName: t('studentList.username'), width: calculateWidth(students.map((student)=>student.username)) },
          { field: 'email', headerName: t('studentList.email'), width: calculateWidth(students.map((student)=>student.email)) },
          {
            field: 'githubprofile',
            headerName: t('studentList.githubprofile'),
            width: calculateWidth(students.map((student)=>student.githubprofile)) ,
            renderCell: (params) => {
                return (
                    <a href={params.value} target="_blank" rel="noopener noreferrer">
                        {params.value}
                    </a>
                );
            }
        },
        ];
      }
     

      return columns;

    }



      const getRows = () =>{
        let rows = [];
        if(students != undefined){
          students.map((student,index) => {
          
              rows[index] = student;
 
          });
        }
       
  
        return rows;

      }


     
      
  return (
    <div style={{ height: '100%', width: '100%' }}>
    <DataGrid
      rows={getRows()}
      columns={getColumns()}
      initialState={{
        pagination: {
          paginationModel: { page: 0, pageSize: 5 },
        },
      }}
      pageSizeOptions={[5, 10]}
      checkboxSelection
     
      
    />
  </div>
  );
}


export default StudentsList;
