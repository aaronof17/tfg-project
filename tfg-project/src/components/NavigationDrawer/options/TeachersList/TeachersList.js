import  React, {useState, useEffect} from "react";
import { DataGrid } from '@mui/x-data-grid';
import {useTranslation} from "react-i18next";
import {toast} from "react-toastify";
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';

import {calculateWidth, getRepositoryName, extractId, formatDate} from "../../../../functions/genericFunctions.js";
import {downloadRepo, getLastCommitInfo, createCommit} from "../../../../functions/gitHubFunctions.js";
import {getStudents,deleteStudent, editStudent} from "../../../../services/studentService.js";
import {getTeachers,deleteTeacher} from "../../../../services/teacherService.js";
import {getWorksByStudentAndGroup } from "../../../../services/labWorkService.js";

import RewriteModal from '../../../Modal/RewriteModal.js';
import EditTeacherModal from './EditTeacherModal.js';
import './TeachersList.css';

function TeachersList({userData}) {
    const [teachersList, setTeachersList] = useState([]);
    const [selectedTeachers, setSelectedTeachers] = useState([]);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [rowToDelete, setRowToDelete] = useState("");
    const [rowToEdit, setRowToEdit] = useState("");
    const [t] = useTranslation();

    useEffect(() => {
      const fetchInfo = async () => {
        const teachers = await getTeachers();
        setTeachersList(teachers);
      };

      fetchInfo();
    }, []);


    const getColumns = () =>{
      let columns = [];
      if(teachersList != undefined){
        columns = [ 
          { field: 'name', headerName: t('teachersList.name'), width: calculateWidth([...teachersList.map((teacher) => teacher.name), t('teachersList.name')]) },
          { field: 'email', headerName: t('teachersList.email'), width: calculateWidth([...teachersList.map((teacher) => teacher.email), t('teachersList.email')]) },
          { field: 'githubProfile', headerName: t('teachersList.githubprofile'), width: calculateWidth([...teachersList.map((teacher) => teacher.githubProfile), t('teachersList.githubprofile')],true) },
          {
            field: 'actions',
            headerName: t('teachersList.actions'),
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
        ];
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
      if(teachersList !== undefined){
        teachersList.map((teacher,index) => {
            rows[index] =  { id: teacher.email, name: teacher.name, email: teacher.email, githubProfile: teacher.githubProfile};
        });
      }
      return rows;
    }

    const validateData = () =>{
     
    }

    const handleSelectionChange = (ids) => {
      const selectedIDs = new Set(ids);
      const selectedRows = getRows().filter((row) =>
        selectedIDs.has(row.id),
      );
      console.log(selectedRows);
      setSelectedTeachers(selectedRows);
    };


    function deleteTeacherMethod(){
      if(rowToDelete != ""){
        deleteTeacher(rowToDelete).then((res)=>{
          if(res.response){
            getTeachers().then((teacherGetted)=>{
              setTeachersList(teacherGetted);
              toast.info(t('teachersList.teacherDeleted'));
              setRowToDelete("");
            })
          }else{
            toast.error('teachersList.errorDeletingTeacher',res.error); 
          }
        });
        
      }else{
        toast.error('teachersList.errorDeletingTeacher');
      }
      
    }


    const handleEditRow = (newRow) => {
      // if(rowToEdit != null){

      //   editStudent(newRow).then((res) =>{
      //     if(res.response){
      //       getStudents(setStudentsList,teacherId).then(()=>{
      //         toast.info(t('studentList.studentEdited'));
      //         setRowToEdit("");
      //       })
            
      //     }else{
      //       toast.error(res.error); 
      //     }
      //   });
      // }else{
      //   toast.error(t('studentList.errorOccurred'));
      // }
    };


  if(teachersList.length !== 0)
  return (
  <div className="teachers-wrapper">
    <div className="teachers-wrapper-container">
      <DataGrid
        className="teachers-table"
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
      {deleteModalOpen && (
        <RewriteModal
          closeRewriteModal={() => {
          setDeleteModalOpen(false);
          setRowToDelete("");
          }}
          genericFunction={deleteTeacherMethod}
          text1={t('teachersList.deleteTeacher')}
          text2={t('teachersList.teacherInfo')}
        />
      )}
      {editModalOpen && (
          <EditTeacherModal
            closeModal={() => {
              setEditModalOpen(false);
              setRowToEdit("");
            }}
            onSubmit={handleEditRow}
            defaultValue={rowToEdit}
            teachersList={teachersList}
          />
        )} 
    </div>
    </div>
  );

  return (
    <div className="teachers-wrapper">
      <h3>{t('teachersList.teachersListEmpty')}</h3>
    </div>
  );
}


export default TeachersList;
