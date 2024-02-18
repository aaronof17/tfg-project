import { useEffect, useState } from 'react';
import {getJSON} from '../functions/functions.js';


function ProfileView({rerenderPass}){

    // const [rerender, setRerender] = useState(false);
     const [userData, setUserData] = useState({});

    
  async function getUserData() {
    console.log(localStorage.getItem("accessToken"));
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

  function mostrarRepos(){
    let repos_json = JSON.parse(getJSON(userData.repos_url));
    // console.log(repos_json);
    //  let repos_url = [];
    //  for(let i in repos_json){
    //    repos_url[i] = repos_json[i].html_url; 
    //  }
    //  return repos_url;
    return(
      <ul>
        {repos_json.map((repo, index) => (
        <li key={index}>
          <a href={repo.html_url} style={{ color: "white" }}>
            {repo.name}
          </a>
        </li>
      ))}
      </ul>
    );
  }

  
  async function createIssue() {
    const file = require('../TestIssues.json');
    const user = 'aaronof17';
    const repo = 'demo1';
    console.log(localStorage.getItem("accessToken"));
    file.forEach(issue => {
      fetch(`https://api.github.com/repos/${user}/${repo}/issues`, {
          method: 'post',
          body:    JSON.stringify(issue),
          headers: {'Authorization': "Bearer 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"}
      })
      .then((res) =>{
        console.log(res)
        return res.json;
      })
      .then(json => {
        console.log(json)
          console.log(`Issue created at ${json.url}`)
      })
  })
}
    
    return(
        <div className="ProfileView">
            <h1> We have the access token</h1>
            <button onClick={() => {
                localStorage.removeItem("accessToken"); 
                rerenderPass()
            }}>
            Log out
            </button>
            <button onClick={createIssue}>
            Create Issue
            </button>
            <h3>Get User Data from GitHub API</h3>
            <button onClick={getUserData}>
            Get Data
            </button>
            {Object.keys(userData).length !== 0 ?
            <>
            <h4>Hey there {userData.login}</h4>
            <img src={userData.avatar_url}></img>
            <a href={userData.html_url} style={{"color":"white"}}>
                Link to my github profile
            </a>
            {
                mostrarRepos()
            }
            </>
            :
            <>
            </>
            }
        </div>
    );

}

export default ProfileView;