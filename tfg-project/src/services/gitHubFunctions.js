import strings from '../assets/files/strings.json';

export async function createIssue(user,repo,title,description,token) {
  const apiUrl = strings.strings.host+'createIssue';
  try {
      const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
              "Authorization" : "Bearer "+token,
              "Content-Type": "application/json"
          },
          body:
              JSON.stringify({ user: user,
                              repo: repo,
                              title: title,
                              description: description
                          })
      });
      const data = await response.json(); 
      if (!data.success) {
        console.log("An error occurred sending issue: ", data.error);
        return { response: false, error: data.error};
      } else {
        return { response: true, error: ""};
      }
  } catch (error) {
      console.error(error);
      return { response: false, error: error};
    }
}

export async function loginWithGitHub(){
  try {
    const response = await fetch(strings.strings.host+"login", {
      method: "GET"
    });

  const data = await response.json();

  return data.redirectUrl;
} catch (error) {
  console.error('Error fetching with the login:', error);
}
}



export async function commitExplanation(token, repositoryURL, githubUser, file, commitTitle) {
  const apiUrl = strings.strings.host+'commitExplanation';
  try {
      const formData = new FormData();
      formData.append('repo', repositoryURL);
      formData.append('user', githubUser);
      formData.append('commitTitle', commitTitle);
      formData.append('file', file);

      const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
              "Authorization" : "Bearer "+token
          },
          body: formData
      });

      const data = await response.json(); 
      if (!data.success) {
        console.log("An error occurred creating commit for explanation: ", data.error);
        return { response: false, error: data.error};
      } else {
        return { response: true, error: ""};
      }
  } catch (error) {
      console.error("Error creating commit for explanation ",error);
  }
}



export async function getUserData(callback) {
    try {
        const response = await fetch(strings.strings.host+"getUserData", {
          method: "GET",
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("accessToken")
          }
        });
    
      const data = await response.json();

      if (data.success) {
        callback(data.data);
        return data.data;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
}

export async function getAccessToken(setRerender,rerender, codeParam){
  await fetch(strings.strings.host+"getAccessToken?code=" + codeParam, {
    method: "GET"
  }).then((response) => {
    return response.json();
  }).then((data) => {
    if(data.data.access_token){
      localStorage.setItem("accessToken", data.data.access_token);
      setRerender(!rerender);
    }
  })
}


export async function deleteAppToken(token,rerenderPass){
  const apiUrl = strings.strings.host + 'deleteAppToken';
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ token })
    });

    if (response.ok) {
      localStorage.removeItem("accessToken");
      rerenderPass();
    } else {
      console.error("Error deleting token: ", response.statusText);
    }
  } catch (error) {
    console.error("Error deleting token: ", error);
  }
}

export async function getLastCommitInfo(token, repositoryURL, githubUser) {
  const apiUrl = strings.strings.host+'getFinalCommitInfo';
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                "Authorization" : "Bearer "+token,
                "Content-Type": "application/json"
            },
            body:
                JSON.stringify({repo: repositoryURL,
                                user: githubUser
                              })
        });

        const data = await response.json(); 
        if (!data.success) {
          console.log("An error occurred getting last commit information: ", data.error);
          return { response: false, error: data.error};
        } else {
          return { response: true, data: data.data,error: ""};
        }
    } catch (error) {
        console.error("Error getting last commit information:  ",error);
    }
}


export async function downloadRepo(token, repositoryURL, githubUser) {
  const apiUrl = strings.strings.host+'downloadRepo';
  let intento = 0;
  let maximoIntento = 3;
  while(intento < maximoIntento){
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                "Authorization" : "Bearer "+token,
                "Content-Type": "application/json"
            },
            body:
                JSON.stringify({repo: repositoryURL,
                                user: githubUser
                              })
        });

        const data = await response.json(); 
        if (!data.success) {
          console.log("An error occurred downloading repository: ", data.error);
          return { response: false, error: data.error};
        } else {
          await descargarArchivo(data.data);
          return { response: true, error: ""};
        }
    } catch (error) {
        console.error("Error downloading ",error);
        intento++;
    }
  }
}


async function descargarArchivo(url) {
  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.click();
}
