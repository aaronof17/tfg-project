import * as React from 'react';
import './ProfileView.css';
import "react-toastify/dist/ReactToastify.css";
import 'reactjs-popup/dist/index.css';
import { useEffect,useState } from 'react';
import {useTranslation} from "react-i18next";
import { getUserData } from '../../../../functions/gitHubFunctions';
import {ToastContainer, toast} from "react-toastify";
import user_default from '../../../../assets/images/user-default.jpg';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import PopupInfo from './PopUpInfo.js';
import Button from '@mui/material/Button';
import SaveIcon from '@mui/icons-material/Save';
import {saveTeacherToken} from "../../../../repositories/teacherRepository.js";

/**
 * Component for the Profile View 
 * for logged user
 */
function ProfileView() {
  const [userData, setUserData] = useState({});
  const [token, setToken] = useState("");
  const [t] = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      getUserData(setUserData);
    };

    fetchData();
  }, []);

    
  const estiloTextField = {
    pointerEvents: 'none',
  };

  const handleTokenChange = (e) => {
    setToken(e.target.value);
  }


  /**
   * Save token in database
   */
  function saveToken(){
    if(token === ""){
      toast.error(t('userProfile.tokenError'));
    }else{
      saveTeacherToken(token,userData.html_url).then((res) =>{
        if(res.response){
          toast.info(t('userProfile.tokenSaved'));
        }else{
          toast.error(res.error); 
        }
      });
    }
  }


  /**
   * This method returns the avatar url
   * of GitHob profile or the default image
   */
  function getImage(){
    if(userData && userData.avatar_url){
      return (<img src={userData.avatar_url} alt="Avatar" />);
    }else{
      return (<img src={user_default} alt="Avatar" />);
    }
  }

  /***
   * This method returns de name of logged user
   * or default message
   */
  function getName(){
    if(userData && userData.name){
      return userData.name;
    }else{
      return t('userProfile.name');
    }
  }


  /**
   * This method returns the url profile or
   * default message
   */
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
          />
        </div>
        <div className="textField">
          <TextField
            id="outlined-required"
            className="profileEmail"
            label={t('userProfile.email')}
            value={"example@email.com"}
            style={estiloTextField}
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
            />
            <PopupInfo></PopupInfo>
          </div>
          <div className="saveToken" >
            <Button variant="contained" startIcon={<SaveIcon />} onClick={saveToken}>
              {t('userProfile.saveToken')}
            </Button>
          </div>
        </div>
        <ToastContainer className="custom-toast-container"/>
      </div>
      
    </div>
    
  );
}


export default ProfileView;
