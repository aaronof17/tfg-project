import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import {getJSON} from './functions/genericFunctions.js';
import Login from './components/Login/LoginForm.js';
import ProfileView from './components/ProfileView.js';
import ResponsiveDrawer from './components/NavigationDrawer/NavigationDrawer.js';
import i18n from './i18n';

const CLIENT_ID = "b771595a6c15c6653d02";

function App() {

  const [rerender, setRerender] = useState(false);
  const [userData, setUserData] = useState({}); 
  
  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const codeParam = urlParams.get("code");
    console.log(codeParam)

    if(codeParam && (localStorage.getItem("accessToken") === null)){
      async function getAccessToken(){
        await fetch("http://localhost:4000/getAccessToken?code=" + codeParam, {
          method: "GET"
        }).then((response) => {
          return response.json();
        }).then((data) => {
          console.log(data);
          if(data.access_token){
            localStorage.setItem("accessToken", data.access_token);
            setRerender(!rerender);
          }
        })
      }
      getAccessToken();
    }

  }, []);

  const rerenderPass = () => {
    setRerender(!rerender);
  }
 

  return (
    <div className="App">
      <header className="App-header">

        {localStorage.getItem("accessToken") ? 
        <ResponsiveDrawer rerenderPass={rerenderPass}></ResponsiveDrawer>
        :
        <Login/>
        }
      </header>
    </div>
  );
}

export default App;
