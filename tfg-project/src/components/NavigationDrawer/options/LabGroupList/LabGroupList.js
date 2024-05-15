import  React, {useState, useEffect} from "react";
import { DataGrid } from '@mui/x-data-grid';
import {useTranslation} from "react-i18next";
import {toast} from "react-toastify";
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';

import {calculateWidth, extractDuplicateEntry} from "../../../../functions/genericFunctions.js";
import {getLabGroups, deleteLabGroup, editLabGroup} from "../../../../services/labGroupService.js";
import {getTeachers} from "../../../../services/teacherService.js";

import RewriteModal from '../../../Modal/RewriteModal.js';
import EditLabGroupModal from './EditLabGroupModal.js';
import './LabGroupList.css';
import strings from '../../../../assets/files/strings.json';


function LabGroupList({userData}) {
    const [groupsList, setGroupsList] = useState([]);
    const [teachersList, setTeachersList] = useState([]);
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [rowToDelete, setRowToDelete] = useState("");
    const [rowToEdit, setRowToEdit] = useState("");
    const [t] = useTranslation();

    useEffect(() => {
      const fetchInfo = async () => {
        const labgroups = await getLabGroups();
        console.log(labgroups);
        setGroupsList(labgroups);
        const teachers = await getTeachers();
        console.log(teachers);
        setTeachersList(teachers);
      };

      fetchInfo();
    }, []);
    


    const getColumns = () =>{
      let columns = [];
      if(groupsList != undefined){
        columns = [ 
          { field: 'name', headerName: t('groupsList.name'), width: calculateWidth([...groupsList.map((group) => group.name), t('groupsList.name')], true) },
          { field: 'subject', headerName: t('groupsList.subject'), width: calculateWidth([...groupsList.map((group) => group.subject), t('groupsList.subject')], true) },
          { field: 'teacherName', headerName: t('groupsList.teacherName'), width: calculateWidth([...groupsList.map((group) => group.teacherName), t('groupsList.teacherName')]) },
          {
            field: 'actions',
            headerName: t('groupsList.actions'),
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
      const editedRow = { ...row };
      editedRow.teacherName = "";
      setRowToEdit(editedRow);
      setEditModalOpen(true);
    }

    const handleDelete = (rowToDelete) =>{
      setRowToDelete(rowToDelete);
      setDeleteModalOpen(true);
    }

    const getRows = () =>{
      let rows = [];
      if(groupsList !== undefined){
        groupsList.map((group,index) => {
            rows[index] =  { id: group.id, name: group.name, subject: group.subject, teacherName: group.teacherName};
        });
      }
      return rows;
    }



    const handleSelectionChange = (ids) => {
      const selectedIDs = new Set(ids);
      const selectedRows = getRows().filter((row) =>
        selectedIDs.has(row.id),
      );
      setSelectedGroups(selectedRows);
    };


    function deleteTeacherMethod(){
      if(rowToDelete != ""){
        deleteLabGroup(rowToDelete).then((res)=>{
          if(res.response){
            getLabGroups().then((groupsGetted)=>{
              setGroupsList(groupsGetted);
              toast.info(t('groupsList.groupDeleted'));
              setRowToDelete("");
            })
          }else{
            toast.error('groupsList.errorDeletingGroup'); 
          }
        });
        
      }else{
        toast.error('groupsList.errorDeletingGroup');
      }
      
    }


    const handleEditRow = (newRow) => {
      if(rowToEdit != null){
        editLabGroup(newRow).then((res) =>{
          if(res.response){
            getLabGroups().then((groupsGetted)=>{
              setGroupsList(groupsGetted);
              toast.info(t('groupsList.groupEdited'));
              setRowToEdit("");
            })
            
          }else{
            if(res.code === strings.errors.dupentry){
              toast.error(extractDuplicateEntry(res.error)+t('groupsList.errorExist'));
            }else{
              toast.error(t('groupsList.errorEditingGroup'));
            }
          }
        });
      }else{
        toast.error(t('groupsList.errorOccurred'));
      }
    };


  if(groupsList.length !== 0)
  return (
  <div className="groups-wrapper">
    <div className="groups-wrapper-container">
      <DataGrid
        className="groups-table"
        rows={getRows()}
        columns={getColumns()}
        initialState={{
          pagination: { 
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSize={5}
        onRowSelectionModelChange ={handleSelectionChange}
      />
      {deleteModalOpen && (
        <RewriteModal
          closeRewriteModal={() => {
          setDeleteModalOpen(false);
          setRowToDelete("");
          }}
          genericFunction={deleteTeacherMethod}
          text1={t('groupsList.deleteGroup')}
          text2={t('groupsList.groupInfo')}
        />
      )}
      {editModalOpen && (
          <EditLabGroupModal
            closeModal={() => {
              setEditModalOpen(false);
              setRowToEdit("");
            }}
            onSubmit={handleEditRow}
            defaultValue={rowToEdit}
            groupsList={groupsList}
            teachersList={teachersList}
          />
        )} 
    </div>
    </div>
  );

  return (
    <div className="groups-wrapper">
      <h3>{t('groupsList.groupsListEmpty')}</h3>
    </div>
  );
}


export default LabGroupList;
