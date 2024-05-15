import React, { useState } from "react";

import Button from '@mui/material/Button';

import { useTranslation } from "react-i18next";

import "./ConfirmModal.css";

function ConfirmModal ({closeConfirmModal, deleteRow, titleText,text}){
    const [t] = useTranslation();

    const handleDelete = (e) => {
        deleteRow();
        closeConfirmModal();
      };


    return (
    <div
      className="confirm-modal-container"
      onClick={(e) => {
        if (e.target.className === "confirm-modal-container") closeConfirmModal();
      }}
    >
        <div className="confirm-modal">
            <h4>{titleText}</h4>
            <p>{text}</p>
            <div className="buttons">
                <Button className="confirm-btn" variant="contained" onClick={handleDelete}>
                    {t('worksList.confirm')}
                </Button>
                <Button className="cancel-btn" variant="contained" onClick={closeConfirmModal}>
                    {t('worksList.cancel')}
                </Button>
            </div>
        </div>
    </div>
  );
};

export default ConfirmModal;
