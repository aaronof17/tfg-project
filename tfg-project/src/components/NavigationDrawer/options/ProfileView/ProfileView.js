import * as React from 'react';
import { useState } from 'react';
import {useTranslation} from "react-i18next";
import { extractDuplicateEntry } from '../../../../functions/genericFunctions.js';
import {saveTeacherToken} from "../../../../services/teacherService.js";
import {toast} from "react-toastify";

import './ProfileView.css';
import "react-toastify/dist/ReactToastify.css";
import 'reactjs-popup/dist/index.css';
import strings from '../../../../assets/files/strings.json';
import user_default from '../../../../assets/images/user-default.jpg';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import PopupInfo from './PopUpInfo.js';
import Button from '@mui/material/Button';
import SaveIcon from '@mui/icons-material/Save';


function ProfileView({userData}) {
  const [token, setToken] = useState("");
  const [t] = useTranslation();

    
  const estiloTextField = {
    pointerEvents: 'none',
  };

  const handleTokenChange = (e) => {
    setToken(e.target.value);
  }


  function saveToken(){
    if(token.trim() === ""){
      toast.error(t('userProfile.tokenError'));
    }else{
      saveTeacherToken(token,userData.login).then((res) =>{
        if(res.response){
          toast.info(t('userProfile.tokenSaved'));
        }else{
          if(res.code === strings.errors.dupentry){
            toast.error(extractDuplicateEntry(res.error)+t('userProfile.errorExist'));
          }else{
              toast.error(t('userProfile.errorSavingToken'));
          }
        }
      });
    }
  }


  function getImage(){
    if(userData && userData.avatar_url){
      return (<img src={userData.avatar_url} alt="Avatar" />);
    }else{
      return (<img src={user_default} alt="Avatar" />);
    }
  }


  function getName(){
    if(userData && userData.name){
      return userData.name;
    }else{
      return t('userProfile.name');
    }
  }

  function getRoleByGitHubUser(){
    if(userData && userData.login){
      return userData.login;
    }else{
      return t('userProfile.githubuser');
    }
  }

  
  function getGitHubProfile(){
    if(userData && userData.html_url){
      return (
        <Link className="profileLink" href={userData.html_url} target="_blank" rel="noopener noreferrer">
          {t('userProfile.githubprofile')}
        </Link>
      );
    }else{
      return t('userProfile.githubprofile');
    }
  }

  return (
    <div className='profileViewerDiv'>
      <div className='avatar'>
        <div className='avatar-wrapper'>
          {
            getImage()
          }
        </div>
        {
          getGitHubProfile()
        }
      </div>
      <div className="body">
        <div className="textField">
          <TextField
            id="outlined-required"
            className="profileName"
            label={t('userProfile.nameLabel')}
            value={getName()}
            style={estiloTextField}
            InputLabelProps={{ style: { color: 'black' } }}
            
          />
        </div>
        <div className="textField">
          <TextField
            id="outlined-required"
            className="githubuser"
            label={t('userProfile.githubuser')}
            value={getRoleByGitHubUser()}
            style={estiloTextField}
            InputLabelProps={{ style: { color: 'black' } }}

          />
        </div>
        <div className="textField" style={{"display": "flex"}}>
          <div className="textPopup">
            <TextField
              id="outlined-required"
              className="gitHubToken"
              label={t('userProfile.token')}
              type="password"
              onChange={handleTokenChange} 
              InputLabelProps={{ style: { color: 'black' } }}

            />
            <PopupInfo></PopupInfo>
          </div>
          <div className="saveToken" >
            <Button variant="contained" startIcon={<SaveIcon />} onClick={saveToken}>
              {t('userProfile.saveToken')}
            </Button>
          </div>
        </div>
      </div>
      
    </div>
    
  );
}


export default ProfileView;
