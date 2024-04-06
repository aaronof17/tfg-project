import React, { useState } from "react";

import Button from '@mui/material/Button';

import { useTranslation } from "react-i18next";

import "./RewriteModal.css";

function RewriteModal ({closeRewriteModal, genericFunction, text1, text2}){
    const [t] = useTranslation();

    const handleEdit = (e) => {
        genericFunction();
        closeRewriteModal();
      };


    return (
    <div
      className="rewrite-modal-container"
      onClick={(e) => {
        if (e.target.className === "rewrite-modal-container") closeRewriteModal();
      }}
    >
        <div className="rewrite-modal">
            <h4>{text1}</h4>
            <p>{text2}</p>
            <div className="buttons">
                <Button className="rewrite-btn" variant="contained" onClick={handleEdit}>
                    {t('mark.confirm')}
                </Button>
                <Button className="cancel-btn" variant="contained" onClick={closeRewriteModal}>
                    {t('mark.cancel')}
                </Button>
            </div>
        </div>
    </div>
  );
};

export default RewriteModal;
