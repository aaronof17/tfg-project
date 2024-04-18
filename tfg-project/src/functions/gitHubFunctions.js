import saveAs from 'file-saver';


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


export async function pruebasGitHub() {
  const apiUrl = 'http://localhost:4000/pruebasGit';
  try {
      const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
              "Authorization" : "Bearer ",
              "Content-Type": "application/json"
          }
      });
      const data = await response.json(); 
      if (!data.success) {
        console.log("An error occurred sending issue: ", data.error);
        return { response: false, error: data.error};
      } else {
        console.log(data);
        return { response: true, error: ""};
      }
  } catch (error) {
      console.error(error);
      return { response: false, error: error};
    }
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
        callback(data);
        return data;
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


export async function createCommit() {
  const apiUrl = 'http://localhost:4000/commitRepo';
  try {
      console.log("entra ");
      const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
              "Authorization" : "Bearer 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",
              "Content-Type": "application/json"
          }
      });

      const data = await response.json(); 

      if (!data.success) {
        console.log("An error occurred creating a commit: ", data.error);
        return { response: false, error: data.error};
      } else {
          console.log("Datos recibidos:", data); // Aquí puedes acceder a los datos
          descargarArchivo(data.data);
      }
  } catch (error) {
      console.error(error);
      // Maneja errores aquí
  }
}



export async function descargar() {
  try {
    fetch('http://localhost:4000/download/repo', {
      method: 'POST',
      headers: {
          "Authorization" : "Bearer ",
          "Content-Type": "application/json"
      }
    })
    .then(response => {
        // Verificar si la respuesta es correcta
        if (!response.ok) {
            throw new Error('No se pudo descargar el archivo');
        }
        // Iniciar la descarga del archivo
        return response.blob();
    })
    .then(blob => {
        // Crear un objeto URL para el blob
        const url = window.URL.createObjectURL(blob);
        // Crear un enlace invisible
        const a = document.createElement('a');
        a.href = url;
        a.download = 'nombre_archivo.zip'; // Nombre deseado para el archivo descargado
        // Simular un clic en el enlace
        document.body.appendChild(a);
        a.click();
        // Limpiar el objeto URL y el enlace
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    })
    .catch(error => {
        console.error('Error:', error);
    });
  } catch (error) {
      console.error(error);
      // Maneja errores aquí
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


async function downloadFileFromLink(url) {
  try {
      const response = await fetch(url);
      const blob = await response.blob();
      saveAs(blob, 'downloaded_file.zip'); // Set a filename
  } catch (error) {
      console.error('Download error:', error);
      // Handle the error
  }
}


// async function descargarArchivod(url) {
//   try {
//     const respuesta = await fetch(urls);
//     const blob = await respuesta.blob();
//     const nombreArchivo = obtenerNombreArchivoDesdeURL(url);
//     descargarBlobComoArchivo(blob, nombreArchivo);
//   } catch (error) {
//     console.error(`Error al descargar el archivo ${url}:`, error);
//   }
// }

function obtenerNombreArchivoDesdeURL(url) {
  // Lógica para extraer el nombre del archivo de la URL, por ejemplo:
  const partesURL = url.split('/');
  return partesURL[partesURL.length - 1];
}

// Función para descargar un blob como archivo
function descargarBlobComoArchivo(blob, nombreArchivo) {
  const url = window.URL.createObjectURL(new Blob([blob]));
  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.setAttribute('download', nombreArchivo);
  document.body.appendChild(enlace);
  enlace.click();
  document.body.removeChild(enlace);
}
