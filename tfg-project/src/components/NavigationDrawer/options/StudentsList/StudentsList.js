import  React, {useState, useEffect} from "react";
import axios from "axios";
import { DataGrid } from '@mui/x-data-grid';
import {useTranslation} from "react-i18next";

import Button from '@mui/material/Button';

import {calculateWidth} from "../../../../functions/genericFunctions.js";
import {downloadRepo} from "../../../../functions/gitHubFunctions.js";
import {getStudents} from "../../../../repositories/studentRepository.js";
import {getTeacherId, getTeacherToken} from "../../../../repositories/teacherRepository.js";

import './StudentsList.css';

function StudentsList({userData}) {
    const [studentsList, setStudentsList] = useState([]);
    const [teacherId, setTeacherId] = useState("");
    const [teacherToken, setTeacherToken] = useState("");
    const [t] = useTranslation();

    useEffect(() => {
      const fetchInfo = async () => {
        //const id = await getTeacherId(setTeacherId,userData.html_url);
        //getTeacherToken(setTeacherToken,id);
        //getStudents(setStudentsList,id);
      };

      fetchInfo();
    }, []);

    


    const getColumns = () =>{
      let columns = [];
      console.log(studentsList);
      if(studentsList != undefined){
  
        columns = [ 
          { field: 'id', headerName: 'ID', width: calculateWidth(studentsList.map((student)=>student.studentsID)) },
          { field: 'name', headerName: t('studentList.name'), width: calculateWidth(studentsList.map((student)=>student.name)) },
          { field: 'email', headerName: t('studentList.email'), width: calculateWidth(studentsList.map((student)=>student.email)) },
          { field: 'githubuser', headerName: t('studentList.email'), width: calculateWidth(studentsList.map((student)=>student.githubuser)) },
          {
            field: 'repository',
            headerName: t('studentList.githubprofile'),
            width: calculateWidth(studentsList.map((student)=>student.repositoryURL)) ,
            renderCell: (params) => {
                return (
                    <a href={params.value} target="_blank" rel="noopener noreferrer">
                        {params.value}
                    </a>
                );
      }},];
      }
      return columns;

    }

    const getRows = () =>{
      let rows = [];
      if(studentsList !== undefined){
        studentsList.map((student,index) => {
            rows[index] =  { id: student.studentsID, name: student.name, email: student.email, githubuser: student.githubuser, repository: student.repositoryURL};
        });
      }
      

      return rows;

    }

    async function downloadRepository(){
      downloadRepo();
    }


     
      
  return (
    <div className="students-wrapper">
      <DataGrid
        className="students-table"
        rows={getRows()}
        columns={getColumns()}
        initialState={{
          pagination: { 
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
      />
      <div className="saveLabWorks" >
        <Button variant="contained" onClick={downloadRepository}>
            Descargar repositorios
        </Button>
      </div>
    </div>
  );
}


export default StudentsList;
