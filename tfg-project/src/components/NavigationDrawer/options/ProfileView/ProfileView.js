import * as React from 'react';
import './ProfileView.css';
import { useEffect,useState } from 'react';
import TextField from '@mui/material/TextField';
import {useTranslation} from "react-i18next";
import { getUserData } from '../../../../functions/gitHubFunctions';
import user_default from '../../../../assets/images/user-default.jpg';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

function ProfileView() {
  const [userData, setUserData] = useState({});
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

  function getImage(){
    if(userData && userData.avatar_url){
      return (<img src={userData.avatar_url} alt="Avatar" />);
    }else{
      return (<img src={user_default} alt="Avatar" />);
    }
  }

  function getName(){
    if(userData && userData.name){
      return (
        <Link href={userData.html_url} target="_blank" rel="noopener noreferrer">
          {userData.html_url}
        </Link>
      );
    }else{
      return t('userProfile.name');
    }
  }

  function getGitHubProfile(){
    if(userData && userData.html_url){
      return userData.html_url;
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
      </div>
      <div className="body">
        <div className="textField">
          <TextField
            required
            id="outlined-required"
            className="profileName"
            label={t('userProfile.nameLabel')}
            value={getName()}
            style={estiloTextField}
          />
        </div>
        <div className="textField">
          <TextField
            required
            id="outlined-required"
            className="profileGitHubName"
            label={t('userProfile.githubprofile')}
            value={getGitHubProfile()}
            style={estiloTextField}
          />
        </div>
        <div className="textField">
          <TextField
            required
            id="outlined-required"
            className="profileEmail"
            label={t('userProfile.email')}
            value={"example@email.com"}
            style={estiloTextField}
          />
        </div>
      </div>
      
    </div>
    
  );
}


export default ProfileView;
