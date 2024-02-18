import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import {getJSON} from './functions/functions.js';
import Login from './components/Login.js';
import ProfileView from './components/ProfileView.js';

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



  // async function createIssue() {
  //   const octokit = new Octokit({
  //     auth: 'YOUR-TOKEN'
  //   })

  //   try{
  //     await fetch( "http://localhost:4000/createIssue", {
  //       method: "POST",
  //         headers: {
  //             "Authorization" : "Bearer "+ localStorage.getItem("accessToken"),
  //             "Content-Type": "application/json"
  //           },
  //         body: JSON.stringify({
  //           repoName: "demo1",
  //           userName: "aaronof17"
  //         })
  //     }).then((response) => {       
  //       console.log(response);
  //        return response;
  //     }).then((data) => {
  //         setUserData(data);
  //     })
  //   }catch(err){
  //     console.error("Error creating issue:", err.message);
  //   }
    
  // }

 

  return (
    <div className="App">
      <header className="App-header">

        {localStorage.getItem("accessToken") ? 
        <ProfileView rerenderPass={rerenderPass}/>
        :
        <Login/>
        }
      </header>
    </div>
  );
}

export default App;
