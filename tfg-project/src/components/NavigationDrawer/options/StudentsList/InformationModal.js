import React, { useState } from "react";

import Button from '@mui/material/Button';

import { useTranslation } from "react-i18next";

import "./InformationModal.css";

function InformationModal ({closeModal, outOfTimeCommits}){
    const [t] = useTranslation(); 

    const downloadJSON = () => {
      const json = JSON.stringify(outOfTimeCommits);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = t('studentList.commitInfoArchive')+".json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
  };
    
    return (
      <div
        className="info-modal-container"
        onClick={(e) => {
          if (e.target.className === "info-modal-container") closeModal();
        }}
      >
        <div className="info-modal">
          <Button onClick={downloadJSON} variant="contained" color="primary"> {t('studentList.download')}</Button>
          {outOfTimeCommits.map((commitInfo)=>{
            if(commitInfo.messageType == 'commit'){
              return(
                <div className="commit-container">
                  <p>
                    {t('studentList.messageForOOTCommitStudent')}<strong>{commitInfo.studentName}</strong>{t('studentList.messageForOOTCommitmessage1')}
                    <strong>{commitInfo.work.title}</strong>{t('studentList.messageForOOTCommitmessage2')}<strong>{commitInfo.work.finaldate}</strong>
                    {t('studentList.messageForOOTCommitmessage3')}<strong>{commitInfo.labgroup}</strong>{t('studentList.messageForOOTCommitmessage4')}
                    <strong><a href={commitInfo.repo}>{commitInfo.repo}</a></strong>
                  </p>

                  <div className="commit-info">
                    <h2>{t('studentList.messageForOOTCommitCommitInfo')}</h2>
                    <p>{t('studentList.messageForOOTCommitCommitMessage')}<strong>{commitInfo.commit.message}</strong></p>
                    <p>{t('studentList.messageForOOTCommitCommitDate')}<strong>{commitInfo.commit.date}</strong></p>
                  </div>
                </div>
              );

            }else if(commitInfo.messageType == 'withoutWorks'){
              return(
                <div className="commit-container">
                  <p>
                    {t('studentList.messageForOOTCommitStudent')}<strong>{commitInfo.studentName}</strong>{t('studentList.messageForOOTCommitWithoutWorks')}
                    <strong>{commitInfo.labgroup}</strong>
                  </p>
                </div>
              );
            }else if(commitInfo.messageType == 'withoutCommit'){
              return(
                <div className="commit-container">
                  <p>
                    {t('studentList.messageForOOTCommitStudent')}<strong>{commitInfo.studentName}</strong>{t('studentList.messageForOOTCommitWithoutCommits')}
                  </p>
                </div>
              );
            }
          })}
        </div>
      </div>
  );
};


export default InformationModal;
