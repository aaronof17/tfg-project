import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import Login from './components/Login/LoginForm.js';
import ResponsiveDrawer from './components/NavigationDrawer/NavigationDrawer.js';
import { getAccessToken } from './services/gitHubFunctions.js';
import i18n from './i18n';

function App() {

  const [rerender, setRerender] = useState(false);
  
  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const codeParam = urlParams.get("code");

    if(codeParam && (localStorage.getItem("accessToken") === null)){
      getAccessToken(setRerender,rerender, codeParam);
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
