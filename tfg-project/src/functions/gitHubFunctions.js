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
      console.log("data ",data);
      if (!data.success) {
        console.log("An error occurred sending issue: ", data.error);
        return { response: false, error: data.error};
      } else {
        console.log("gucci");
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
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
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



export async function downloadRepo() {
  const apiUrl = 'http://localhost:4000/descargar';
  try {
    fetch('http://localhost:4000/descargar')
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

// export async function downloadRepo() {
//   const apiUrl = 'http://localhost:4000/downloadRepo';
//   try {
//       console.log("entra ");
//       const response = await fetch(apiUrl, {
//           method: 'POST',
//           headers: {
//               "Authorization" : "Bearer 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",
//               "Content-Type": "application/json"
//           }
//       });

//       const data = await response.json(); 
//       if (!data.success) {
//         console.log("An error occurred downloading repository: ", data.error);
//         return { response: false, error: data.error};
//       } else {
//           console.log("Datos recibidos:", data); // Aquí puedes acceder a los datos
//           descargarArchivo(data.data);
//       }
//   } catch (error) {
//       console.error(error);
//       // Maneja errores aquí
//   }
// }



function descargarArchivo(url) {
  var nombreArchivo = "nuevo_nombre_archivo.zip"; // El nuevo nombre de archivo que deseas
  
  var enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = nombreArchivo;

  // Simular clic en el enlace
  enlace.click();
}