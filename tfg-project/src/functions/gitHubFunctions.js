

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
    const apiUrl = 'http://localhost:4000/downloadRepo?code='; // Reemplaza con la URL de tu servidor

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization" : "Bearer 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" ,
    }})

        if (!response.ok) {
            throw new Error(`Error al llamar a la API: ${response.statusText}`);
        }

        const json = await response.json();
        console.log(json);
        // Continúa con el procesamiento de la respuesta según sea necesario
    } catch (error) {
        console.error(error);
        // Maneja errores aquí
    }
}
