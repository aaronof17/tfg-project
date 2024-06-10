import * as React from 'react';
import {useTranslation} from "react-i18next";

import strings from '../../../../assets/files/strings.json';
import './DefaultView.css';

function DefaultView() {
  const [t] = useTranslation();

  return (
    <div className='default-view-div'>
        <h3>{t('defaultView.message')}</h3>
        <h2>{t('defaultView.email')+strings.emails.admin}</h2>
    </div>
  );
}


export default DefaultView;
