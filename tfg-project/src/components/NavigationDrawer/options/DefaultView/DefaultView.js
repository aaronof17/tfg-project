import * as React from 'react';
import { useState, useEffect} from 'react';
import {useTranslation} from "react-i18next";
import {toast} from "react-toastify";
import {getTeachers} from "../../../../services/teacherService.js";
import { extractDuplicateEntry } from '../../../../functions/genericFunctions.js';
import {saveLabGroup} from "../../../../services/labGroupService.js";


import strings from '../../../../assets/files/strings.json';
import './DefaultView.css';

function DefaultView({userData}) {
  const [t] = useTranslation();


  return (
    <div className='default-view-div'>
        <h3>{t('defaultView.message')}</h3>
        <h2>{t('defaultView.email')+strings.emails.admin}</h2>
    </div>
  );
}


export default DefaultView;
