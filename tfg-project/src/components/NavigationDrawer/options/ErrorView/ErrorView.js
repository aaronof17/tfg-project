import * as React from 'react';
import {useTranslation} from "react-i18next";

import strings from '../../../../assets/files/strings.json';
import './ErrorView.css';

function ErrorView() {
  const [t] = useTranslation();

  return (
    <div className='error-view-div'>
        <h3>{t('errorView.message')}</h3>
        <h2>{t('errorView.email')+strings.emails.admin}</h2>
    </div>
  );
}


export default ErrorView;
