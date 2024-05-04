export async function createIssue(user,repo,title,description,token) {
  const apiUrl = 'http://localhost:4000/createIssue';
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


export async function createCommit(title, message, path, token) {
  

  const apiUrl = 'http://localhost:4000/sendemail';
  try {
      const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
              "Authorization" : "Bearer "+token,
              "Content-Type": "application/json"
          }
      });

      console.log("gucci");

      
  } catch (error) {
      console.error("Error getting last commit information:  ",error);
  }

  // window.fs = new FS("fs");
  // //plugins.set('fs', window.fs);
  // let dir = 'C:/Users/aaron/Desktop/UNI/tfg/rutadeprueba/prueba';

  // await clone({
  //   dir: '/',
  //   corsProxy: 'https://cors.isomorphic-git.org',
  //   url: 'https://github.com/isomorphic-git/isomorphic-git.git',
  //   singleBranch: true,
  //   depth: 1
  // })



  //let fs = new FS('fs', { wipe: true })

  //const dir = '/test-clone'
  // commit({
  //   fs,
  //   dir: '/tutorial',
  //   author: {
  //     name: 'Mr. Test',
  //     email: 'mrtest@example.com',
  //   },
  //   message: 'Added the a.txt file'
  // })
  // .then
  // ((res) => console.log("respuesta ",res));
  
 // clone({ fs, http, dir, url: 'https://github.com/isomorphic-git/lightning-fs', corsProxy: 'https://cors.isomorphic-git.org' }).then(console.log)

  // const apiUrl = 'http://localhost:4000/createCommit';
  // try {
  //     const response = await fetch(apiUrl, {
  //         method: 'POST',
  //         headers: {
  //             "Authorization" : "Bearer "+token,
  //             "Content-Type": "application/json"
  //         },
  //         body:
  //             JSON.stringify({ title: title,
  //                           message: message,
  //                           path: path
  //                         })
  //     });
  //     const data = await response.json(); 
  //     if (!data.success) {
  //       console.log("An error occurred creating commit: ", data.error);
  //       return { response: false, error: data.error};
  //     } else {
  //       console.log(data);
  //       return { response: true, error: ""};
  //     }
  // } catch (error) {
  //     console.error(error);
  //     return { response: false, error: error};
  // }
}

export async function getUserData(callback) {
    try {
        const response = await fetch("http://localhost:4000/getUserData", {
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
  await fetch("http://localhost:4000/getAccessToken?code=" + codeParam, {
    method: "GET"
  }).then((response) => {
    return response.json();
  }).then((data) => {
    console.log("mucha data ",data.data);
    if(data.data.access_token){
      localStorage.setItem("accessToken", data.data.access_token);
      setRerender(!rerender);
    }
  })
}


export async function deleteAppToken(token,rerenderPass){
  const apiUrl = 'http://localhost:4000/deleteAppToken';
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                "Authorization" : "Bearer "+token,
                "Content-Type": "application/json"
            }
        });

        const data = await response.json(); 
        console.log("DELTE DATA ",data);
        localStorage.removeItem("accessToken"); 
        rerenderPass();
    } catch (error) {
        console.error("Error getting last commit information:  ",error);
    }
}

export async function getLastCommitInfo(token, repositoryURL, githubUser) {
  const apiUrl = 'http://localhost:4000/getFinalCommitInfo';
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
          console.log("datation ",data);
          return { response: true, data: data.data,error: ""};
        }
    } catch (error) {
        console.error("Error getting last commit information:  ",error);
    }
}


export async function downloadRepo(token, repositoryURL, githubUser) {
  const apiUrl = 'http://localhost:4000/downloadRepo';
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


// async function downloadFileFromLink(url) {
//   try {
//       const response = await fetch(url);
//       const blob = await response.blob();
//       saveAs(blob, 'downloaded_file.zip'); // Set a filename
//   } catch (error) {
//       console.error('Download error:', error);
//       // Handle the error
//   }
// }


// // async function descargarArchivod(url) {
// //   try {
// //     const respuesta = await fetch(urls);
// //     const blob = await respuesta.blob();
// //     const nombreArchivo = obtenerNombreArchivoDesdeURL(url);
// //     descargarBlobComoArchivo(blob, nombreArchivo);
// //   } catch (error) {
// //     console.error(`Error al descargar el archivo ${url}:`, error);
// //   }
// // }

// function obtenerNombreArchivoDesdeURL(url) {
//   // Lógica para extraer el nombre del archivo de la URL, por ejemplo:
//   const partesURL = url.split('/');
//   return partesURL[partesURL.length - 1];
// }

// // Función para descargar un blob como archivo
// function descargarBlobComoArchivo(blob, nombreArchivo) {
//   const url = window.URL.createObjectURL(new Blob([blob]));
//   const enlace = document.createElement('a');
//   enlace.href = url;
//   enlace.setAttribute('download', nombreArchivo);
//   document.body.appendChild(enlace);
//   enlace.click();
//   document.body.removeChild(enlace);
// }
