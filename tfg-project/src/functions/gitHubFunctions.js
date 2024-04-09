
export async function createIssue() {
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






// export async function downloadRepo() {


//     // const user = 'aaronof17';
//     // const repo = 'demo1';
//     // console.log(localStorage.getItem("accessToken"));

//     // fetch(`https://api.github.com/repos/${user}/${repo}/zipball`, {
//     //     method: "GET",
//     //     headers: {
//     //         "Authorization" : "Bearer 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"
//     //     }
//     // })
//     // .then((res) =>{
//     // console.log(res)
//     // return res.json;
//     // })
//     // .then(json => {
//     // console.log(json)
//     //     console.log(`Issue created at ${json.url}`)
//     // })
// }

export async function downloadRepo() {
  const apiUrl = 'http://localhost:4000/downloadRepo';
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
        console.log("An error occurred downloading repository: ", data.error);
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



function descargarArchivo(url) {
  var nombreArchivo = "nuevo_nombre_archivo.zip"; // El nuevo nombre de archivo que deseas
  
  fetch(url)
  .then(response => response.blob())
  .then(blob => {
      // Crear un objeto Blob con el contenido y tipo MIME del archivo
      var newBlob = new Blob([blob], { type: 'application/zip' });

      // Crear un enlace para el archivo
      var a = document.createElement('a');
      var url = window.URL.createObjectURL(newBlob);
      a.href = url;
      a.download = nombreArchivo; // Establecer el nombre de archivo
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
  })
  .catch(error => {
      console.error('Hubo un error al descargar el archivo:', error);
  });
}