import * as React from 'react';
import { useState, useEffect} from 'react';
import { useTranslation } from "react-i18next";

import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import {ToastContainer, toast} from "react-toastify";
import {getLabWorks, editWork, deleteWork} from "../../../../services/labWorkService.js";
import {getTeacherId} from "../../../../services/teacherService.js";
import { formatDate } from '../../../../functions/genericFunctions.js';

import './WorkList.css';
import Modal from "./Modal.js";
import ConfirmModal from "./ConfirmModal.js";


function WorksList({userData}){
    const [teacherID, setTeacherID] = useState("");
    const [t] = useTranslation();
    const [labworks, setLabWorks] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [rowToEdit, setRowToEdit] = useState(null);
    const [rowToDelete, setRowToDelete] = useState(null);
    const [workToDelete, setWorkToDelete] = useState(null);

    useEffect(() => {
        const fetchInfo = async () => {
            const id = await getTeacherId(setTeacherID,userData.html_url);
            getLabWorks(setLabWorks,id);
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
            toast.error(res.error); 
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
            toast.error(res.error); 
          }
        });
      }else{
        toast.error(t('worksList.errorOccurred'));
      }
    };

    const errorMessage = (message) => {
      toast.error(message);
    }


    
  if(labworks.length !== 0)
    return (
      <div className="work-list">
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
                    <td>
                        {row.labgroupNameFK}
                    </td>
                    <td>
                        {row.title}
                    </td>
                    <td className="description">
                        {row.description}
                    </td>
                    <td>
                        {row.percentage}
                    </td>
                    <td>
                        {formatDate(row.initialdate)}
                    </td>
                    <td>
                        {formatDate(row.finaldate)}
                    </td>
                    <td className="fit">
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
        {modalOpen && (
          <Modal
            closeModal={() => {
              setModalOpen(false);
              setRowToEdit(null);
            }}
            onSubmit={handleEdit}
            defaultValue={rowToEdit !== null && labworks[rowToEdit]}
            errorMessage={errorMessage}
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
        <ToastContainer className="custom-toast-container"/>
      </div>
    );

    return(
      <div className="work-list">
        <h3>{t('worksList.worksEmpty')}</h3>
      </div>
    );
}

export default WorksList;
