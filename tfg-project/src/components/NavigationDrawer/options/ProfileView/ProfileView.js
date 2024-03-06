import * as React from 'react';
import './ProfileView.css';
import { useEffect,useState } from 'react';

import TextField from '@mui/material/TextField';

function ProfileView() {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    getUserData();
    }, []);

    async function getUserData() {
      await fetch( "http://localhost:4000/getUserData", {
        method: "GET",
          headers: {
              "Authorization" : "Bearer "+ localStorage.getItem("accessToken")
          }
      }).then((response) => {       
         return response.json();
      }).then((data) => {
        console.log(data);
          setUserData(data);
      })
    }
    
    const estiloTextField = {
      pointerEvents: 'none',
    };

  return (
    <div className='profileViewerDiv'>
      <img src={userData.avatar_url} alt="esbutton" />
      <TextField
          required
          id="outlined-required"
          label="Nombre"
          value="hola"
          style={estiloTextField}
          />
    </div>
    
  );
}


export default ProfileView;
