import  React, {useState, useEffect} from "react";
import axios from "axios";
import { DataGrid } from '@mui/x-data-grid';
import {useTranslation} from "react-i18next";
import {toast} from "react-toastify";
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';

import {calculateWidth, getRepositoryName, extractId} from "../../../../functions/genericFunctions.js";
import {downloadRepo, getLastCommitInfo} from "../../../../functions/gitHubFunctions.js";
import {getStudents,deleteStudent, editStudent} from "../../../../services/studentService.js";
import {getTeacherId, getTeacherToken} from "../../../../services/teacherService.js";
import {getWorksByStudentAndGroup } from "../../../../services/labWorkService.js";

import RewriteModal from '../../../Modal/RewriteModal.js';
import EditModal from './EditModal.js';
import './StudentsList.css';
import { getWorkByStudent } from "../../../../../../databaseRequests.js";

function StudentsList({userData}) {
    const [studentsList, setStudentsList] = useState([]);
    const [teacherId, setTeacherId] = useState("");
    const [teacherToken, setTeacherToken] = useState("");
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [rowToDelete, setRowToDelete] = useState("");
    const [rowToEdit, setRowToEdit] = useState("");
    const [outOfTimeCommits, setOutOfTimeCommits] = useState([]);
    const [t] = useTranslation();

    useEffect(() => {
      const fetchInfo = async () => {
        const id = await getTeacherId(setTeacherId,userData.login);
        getTeacherToken(setTeacherToken,id);
        getStudents(setStudentsList,id);
        
      };

      fetchInfo();
    }, []);

    


    const getColumns = () =>{
      let columns = [];
      if(studentsList != undefined){
        columns = [ 
          { field: 'name', headerName: t('studentList.name'), width: calculateWidth([...studentsList.map((student) => student.name), t('studentList.name')]) },
          { field: 'email', headerName: t('studentList.email'), width: calculateWidth([...studentsList.map((student) => student.email), t('studentList.email')]) },
          { field: 'githubuser', headerName: t('studentList.githubprofile'), width: calculateWidth([...studentsList.map((student) => student.githubuser), t('studentList.githubprofile')]) },
          { field: 'group', headerName: t('studentList.group'), width: calculateWidth([...studentsList.map((student) => student.labgroup), t('studentList.group')],true) },
          {
            field: 'repository',
            headerName: t('studentList.githubprofile'),
            width: calculateWidth(studentsList.map((student)=>student.repositoryURL),false,true) ,
            renderCell: (params) => {
                return (
                    <a href={params.value} target="_blank" rel="noopener noreferrer">
                        {params.value}
                    </a>
                );
          }},
          {
            field: 'actions',
            headerName: t('studentList.actions'),
            width: 150,
            renderCell: (params) => {
              return (
                <div>
                  <IconButton 
                            aria-label="delete" 
                            className="delete-btn"
                            onClick={() => handleDelete(params.row)}
                        >
                            <DeleteIcon />
                        </IconButton>

                        <IconButton 
                            aria-label="edit" 
                            className="edit-btn"
                            onClick={() => handleEdit(params.row)}
                        >
                            <EditIcon />
                        </IconButton>
                </div>
              );
            }
          }
        ,];
      }
      return columns;

    }

    const handleEdit = (row) =>{
      setRowToEdit(row);
      setEditModalOpen(true);
    }

    const handleDelete = (rowToDelete) =>{
      setRowToDelete(rowToDelete);
      setDeleteModalOpen(true);
    }

    const getRows = () =>{
      let rows = [];
      if(studentsList !== undefined){
        studentsList.map((student,index) => {
            rows[index] =  { id: student.studentsID+student.labgroup, name: student.name, email: student.email, githubuser: student.githubuser, group: student.labgroup,
               repository: student.repositoryURL, localPath: student.localPath};
        });
      }
      return rows;
    }

    const validateData = () =>{
      if(selectedStudents.length != 0){
        if(teacherToken === ""){
          toast.error(t('studentList.tokenEmpty'));
          return false;
        }else{
          return true; 
        }
      }else{
        toast.error(t('studentList.studentsBlank'));
        return false;
      }
    }

    async function downloadStudentsRepositories(){
      for (let student of selectedStudents) {
        try { 
          await downloadRepo(teacherToken, getRepositoryName(student.repository), student.githubuser).then((res) =>{
            if(!res.response){
              if(res.error === 'Unauthorized'){
                toast.error(t('studentList.tokenError'));
              }else{
                toast.error(t('studentList.issueErrorSendStudent'));
              }
            }
          });
        } catch (error) {
          toast.error(t('studentList.downloadError')+error);
        }
      }
    }

    async function downloadRepository(e) {
      e.preventDefault();
      if (validateData()) {
        try {
          await downloadStudentsRepositories();
        } catch (error) {
          toast.error(t('studentList.downloadError') + error);
        }
      }
    }


    async function checkDatesFromWorks(){
      for (let student of selectedStudents) {

        try { 
          await getLastCommitInfo(teacherToken, getRepositoryName(student.repository), student.githubuser).then((res) =>{
            if(!res.response){
              if(res.error === 'Unauthorized'){
                toast.error(t('studentList.tokenError'));
              }else{
                toast.error(t('studentList.commitErrorForStudent')+student.name);
              }
            }else{
              let commitsInfo = res.data;
              await getWorksByStudentAndGroup();
            }
          });
        } catch (error) {
          toast.error(t('studentList.checkingDateError')+error);
        }
      }
    }


    async function checkDatesMethod(e) {
      e.preventDefault();
      if(validateData()){
        try {
          await checkDatesFromWorks();
        } catch (error) {
          toast.error(t('studentList.checkingDateError') + error);
        }
      }
    }


  
    const handleSelectionChange = (ids) => {
      const selectedIDs = new Set(ids);
      const selectedRows = getRows().filter((row) =>
        selectedIDs.has(row.id),
      );
      console.log(selectedRows);
      setSelectedStudents(selectedRows);
    };


    function deleteStudentMethod(){
      if(rowToDelete != ""){
        deleteStudent(rowToDelete).then((res)=>{
          if(res.response){
            getStudents(setStudentsList,teacherId).then(()=>{
              toast.info(t('studentList.studentDeleted'));
              setRowToDelete("");
            })
          }else{
            toast.error('studentList.errorDeletingStudent',res.error); 
          }
        });
        
      }else{
        toast.error('studentList.errorDeletingStudent');
      }
      
    }


    const handleEditRow = (newRow) => {
      if(rowToEdit != null){

        editStudent(newRow).then((res) =>{
          if(res.response){
            getStudents(setStudentsList,teacherId).then(()=>{
              toast.info(t('studentList.studentEdited'));
              setRowToEdit("");
            })
            
          }else{
            toast.error(res.error); 
          }
        });
      }else{
        toast.error(t('studentList.errorOccurred'));
      }
    };


  if(studentsList.length !== 0)
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
        pageSize={5}
        checkboxSelection
        onRowSelectionModelChange ={handleSelectionChange}
      />
      <div className="buttons" >
        <Button className="downloadRepo" variant="contained" onClick={downloadRepository}>
          {t('studentList.downloadRepo')}
        </Button>
        <Button className="checkWorksDates" variant="contained" onClick={checkDatesMethod}>
          {t('studentList.checkWorksDates')}
        </Button>
      </div>
      {deleteModalOpen && (
          <RewriteModal
          closeRewriteModal={() => {
          setDeleteModalOpen(false);
          setRowToDelete("");
          }}
          genericFunction={deleteStudentMethod}
          text1={t('studentList.deleteStudent')}
          text2={t('studentList.studentInfo')}
        />
      )}
      {editModalOpen && (
          <EditModal
            closeModal={() => {
              setEditModalOpen(false);
              setRowToEdit("");
            }}
            onSubmit={handleEditRow}
            defaultValue={rowToEdit}
            studentsList={studentsList}
          />
        )}
    </div>
  );

  return (
    <div className="students-wrapper">
      <h3>{t('studentList.studentsListEmpty')}</h3>
    </div>
  );
}


export default StudentsList;
