import * as React from 'react';
import { useState, useEffect} from 'react';
import { useTranslation } from "react-i18next";

import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import {toast} from "react-toastify";
import {getSubjectsFromGroup} from "../../../../services/labGroupService.js";
import {getLabWorks, editWork, deleteWork, getWorksByGroup, getWorksBySubject} from "../../../../services/labWorkService.js";
import {getTeacherId} from "../../../../services/teacherService.js";
import {formatDate, getSubjectsForComboBox, extractDuplicateEntry} from '../../../../functions/genericFunctions.js';
import { getTeacherLabGroups} from '../../../../services/labGroupService.js';

import strings from '../../../../assets/files/strings.json';
import './WorkList.css';
import Modal from "./Modal.js";
import ConfirmModal from "./ConfirmModal.js";
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

function WorksList({userData}){
    const [teacherID, setTeacherID] = useState("");
    const [t] = useTranslation();
    const [labworks, setLabWorks] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [rowToEdit, setRowToEdit] = useState(null);
    const [rowToDelete, setRowToDelete] = useState(null);
    const [workToDelete, setWorkToDelete] = useState(null);
    const [actualGroupName, setActualGroupName] = useState("");
    const [actualSubject, setSubject] = useState("");
    const [labgroups, setLabGroups] = useState([]);
    const [subjects, setSubjects] = useState([]);

    useEffect(() => {
        const fetchInfo = async () => {
            const id = await getTeacherId(setTeacherID,userData.login);
            getLabWorks(setLabWorks,id);
            getTeacherLabGroups(setLabGroups,id);
            getSubjectsFromGroup(setSubjects,id);
        };
        fetchInfo();
      }, []);

  
    function deleteRow(){
      if(rowToDelete != null && workToDelete != null){
        deleteWork(workToDelete).then((res) =>{
          if(res.response){
            setLabWorks(labworks.filter((_, idx) => idx !== rowToDelete));
            toast.info(t('worksList.workDeleted'));
          }else{
            toast.error(t('worksList.errorDeletingWork')); 
          }
        });
      }else{
        toast.error(t('worksList.errorOccurred'));
      }
    }

      function editRow(idx,id){
        setRowToEdit(idx);
        setModalOpen(true);
    }

    function confirmDelete(idx,id){
      setRowToDelete(idx);
      setWorkToDelete(id);
      setConfirmModalOpen(true);
    }


    const handleEdit = (newRow) => {
      if(rowToEdit != null){

        editWork(newRow).then((res) =>{
          if(res.response){
            setLabWorks(
              labworks.map((currRow, idx) => {
                  if (idx !== rowToEdit) return currRow;
                  return newRow;
                })
              );
            toast.info(t('worksList.workEdited'));
          }else{
            if(res.code === strings.errors.dupentry){
              toast.error(extractDuplicateEntry(res.error)+t('worksList.errorExist'));
            }else{
              toast.error(t('worksList.errorEditingWork'));
            }
          }
        });
      }else{
        toast.error(t('worksList.errorOccurred'));
      }
    };

    const handleSubjectChange = (e, selectedOption) => {
      if (selectedOption) {
        const fetchFilterWorks = async () => {
          getWorksBySubject(selectedOption, setLabWorks, teacherID);
        };
        fetchFilterWorks();
      }else{
        const fetchAllWorks = async () => {
          getLabWorks(setLabWorks,teacherID);
        };
        fetchAllWorks();
      }
    }


    const handleGroupNameChange = (e, selectedOption) => {
      if (selectedOption) {
        const fetchFilterWorks = async () => {
          getWorksByGroup(selectedOption, setLabWorks, teacherID);
        };
        fetchFilterWorks();
      }else{
        const fetchAllWorks = async () => {
          getLabWorks(setLabWorks,teacherID);
        };
        fetchAllWorks();
      }
    }

    return (
      <div className="work-list">
        <div className="work-list-filters">
          <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                  <Autocomplete
                  disablePortal
                  id="labgroup-combo-box"
                  options={labgroups.map((l) => l.label)}
                  renderInput={(params) => <TextField {...params} label={t('worksList.labgroup')} />}
                  onChange={handleGroupNameChange}
                  />
              </Grid>
              <Grid item xs={12} sm={6}>
                  <Autocomplete
                  disablePortal
                  id="subject-combo-box"
                  options={getSubjectsForComboBox(subjects)}
                  renderInput={(params) => <TextField {...params} label={t('worksList.subject')} />}
                  onChange={handleSubjectChange}
                  />
              </Grid>
          </Grid>
        </div>
        {labworks.length !== 0 ? (
        <div className="table-wrapperWork">
          <table className="tableWork">
            <thead  style={{position:"sticky", top:0, zIndex: 1}}>
              <tr>
                <th>{t('worksList.labGroup')}</th>
                <th>{t('worksList.title')}</th>
                <th>{t('worksList.description')}</th>
                <th>{t('worksList.percentage')}</th>
                <th>{t('worksList.initialDate')}</th>
                <th>{t('worksList.finalDate')}</th>
                <th>{t('worksList.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {labworks.map((row, idx) => {
                return ( 
                  <tr key={idx}>
                    <td style={{ backgroundColor: row.active === 1 ? "#837e7e" : "#bebebe" }} >
                        {row.labgroupNameFK}
                    </td>
                    <td style={{ backgroundColor: row.active === 1 ? "#837e7e" : "#bebebe" }} >
                        {row.title}
                    </td>
                    <td style={{ backgroundColor: row.active === 1 ? "#837e7e" : "#bebebe" }}  className="description">
                        {row.description}
                    </td>
                    <td style={{ backgroundColor: row.active === 1 ? "#837e7e" : "#bebebe" }} >
                        {row.percentage}
                    </td>
                    <td style={{ backgroundColor: row.active === 1 ? "#837e7e" : "#bebebe" }} >
                        {formatDate(row.initialdate)}
                    </td>
                    <td style={{ backgroundColor: row.active === 1 ? "#837e7e" : "#bebebe" }} >
                        {formatDate(row.finaldate)}
                    </td>
                    <td style={{ backgroundColor: row.active === 1 ? "#837e7e" : "#bebebe" }}  className="fit">
                      <span className="actions">

                        <IconButton 
                            aria-label="delete" 
                            className="delete-btn"
                            onClick={() => confirmDelete(idx, row.worklabID)}
                        >
                            <DeleteIcon />
                        </IconButton>

                        <IconButton 
                            aria-label="edit" 
                            className="edit-btn"
                            onClick={() => editRow(idx, row.worklabID)}
                        >
                            <EditIcon />
                        </IconButton>
                
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        ) : (
          <h3>{t('worksList.worksEmpty')}</h3>
    )}
    {modalOpen && (
      <Modal
        closeModal={() => {
          setModalOpen(false);
          setRowToEdit(null);
        }}
        onSubmit={handleEdit}
        defaultValue={rowToEdit !== null && labworks[rowToEdit]}
      />
    )}
    {confirmModalOpen && (
      <ConfirmModal
        closeConfirmModal={() => {
          setConfirmModalOpen(false);
          setRowToDelete(null);
          setWorkToDelete(null);
        }}
        deleteRow={deleteRow}
        titleText={t('worksList.confirmDialogTitle')}
        text={t('worksList.confirmDialogText')}
      />
    )}
  </div>
)

}

export default WorksList;
