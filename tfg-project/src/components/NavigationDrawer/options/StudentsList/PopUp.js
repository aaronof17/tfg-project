import React from 'react';
import {useTranslation} from "react-i18next";

import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';

export default function PopUp({text}) {
    const [t] = useTranslation();

    return (
      <Popup 
        trigger={
          <IconButton aria-label="info">
            <InfoIcon />
          </IconButton>
        }
        position="top center">
            <p>
              {text}
            </p>
      </Popup>
    )
};