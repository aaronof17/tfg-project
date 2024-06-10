import React from 'react';
import {useTranslation} from "react-i18next";

import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';

export default function PopupInfo() {
    const [t] = useTranslation();

    return (
      <Popup 
        trigger={
          <IconButton aria-label="info">
            <InfoIcon />
          </IconButton>
        }
        position="right center">
            <p>
              {t('userProfile.tokenInfo')}
            </p>
            <a href="https://docs.github.com/es/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens">
              {t('userProfile.generateToken')}   
            </a>
      </Popup>
    )
};