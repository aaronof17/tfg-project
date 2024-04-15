const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const databaseRequests = require('./databaseRequests');
const githubRequests = require('./githubRequests.js');
const fetch = (...args) =>
import('node-fetch').then(({default: fetch}) => fetch(...args));



const app = express();
const CLIENT_ID = "b771595a6c15c6653d02";
const CLIENT_SECRET = "534c078c5dcaa7afc22d912c6aceb4bda2038b99";

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

const path = require('path');
const fs = require('fs');
//BD---------------------------------------------------------------------------------------------------------------------------------------------------------

app.get('/teachers',  async function (req, res) {
    const result = await databaseRequests.getTeachers(req,res);
    return result;
});


app.post('/teachers/token',  async function (req, res) {
    const result = await databaseRequests.updateTeacherToken(req,res);
    return result;
});

app.post('/teachers/token/id',  async function (req, res) {
    const result = await databaseRequests.getTeacherToken(req,res);
    return result;
});


app.post('/teachers/id', async function (req, res) {
    const result = await databaseRequests.getTeacherId(req,res);
    return result;
});



app.post('/students/teacher', async function (req, res) {
    const result = await databaseRequests.getStudentsByTeacher(req,res);
    return result;
});

app.post('/students/teacher/subject', async function (req, res) {
    const result = await databaseRequests.getStudentsBySubject(req,res);
    return result;
});

app.post('/students/teacher/repo', async function (req, res) {
    const result = await databaseRequests.getStudentsByTeacherWithoutRepo(req,res);
    return result;
});

app.post('/students/work', async function (req, res) {
    const result = await databaseRequests.getStudentsByGroup(req,res);
    return result;
});

app.post('/students/save', async function (req, res) {
    const result = await databaseRequests.insertStudent(req,res);
    return result;
});

app.post('/students/delete', async function (req, res) {
    const result = await databaseRequests.deleteStudent(req,res);
    return result;
});

app.post('/students/email', async function (req, res) {
    const result = await databaseRequests.getIdByEmail(req,res);
    return result;
});

app.post('/works/save',  async function (req, res) {
    const result = await databaseRequests.insertWork(req,res);
    return result;
});


app.post('/works/edit', async function (req, res) {
    const result = await databaseRequests.editWork(req,res);
    return result;
});


app.post('/works/delete', async function (req, res) {
    const result = await databaseRequests.deleteWork(req,res);
    return result;
});


app.post('/works', async function (req, res) {
    const result = await databaseRequests.getWorksByTeacherId(req,res);
    return result;
});


app.post('/works/student', async function (req, res) {
    const result = await databaseRequests.getWorkByStudent(req,res);
    return result;
});

app.post('/marks/save', async function (req, res) {
    const result = await databaseRequests.insertMark(req,res);
    return result;
});

app.post('/marks/edit', async function (req, res) {
    const result = await databaseRequests.editMark(req,res);
    return result;
});

app.post('/marks/work/student', async function (req, res) {
    const result = await databaseRequests.getMarkByWorkAndStudent(req,res);
    return result;
});

app.post('/groups/subject', async function (req, res) {
    const result = await databaseRequests.getGroupsBySubject(req,res);
    return result;
});

app.post('/groups/name', async function (req, res) {
    const result = await databaseRequests.getIdFromGroupsByName(req,res);
    return result;
});

app.post('/labGroups', async function (req, res) {
    const result = await databaseRequests.getGroupsByTeacherId(req,res);
    return result;
});


app.post('/subjects', async function (req, res) {
    const result = await databaseRequests.getSubjectsByTeacherId(req,res);
    return result;
});


app.post('/enrolled/save', async function (req, res) {
    const result = await databaseRequests.insertEnrolled(req,res);
    return result;
});



//---------------------------------------------------------------------------------------------------------------------------------------------------------

app.get('/getAccessToken', async function (req,res){
    
    const params = "?client_id="+ CLIENT_ID + "&client_secret="+ CLIENT_SECRET + "&code=" + req.query.code;
    await fetch("https://github.com/login/oauth/access_token" + params, {
        method: "POST",
        headers: {
            "Accept" : "application/json"
        }
    }).then((response) => {
        return response.json();
    }).then((data) => {
        console.log(data);
        res.json(data);
    }) 
}); 


app.post('/createIssue', async function  (req, res){
    try {
        const result = await githubRequests.createIssue(req, res);
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        if(error.message === 'Error: Unauthorized'){
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }
        return res.status(500).json({ success: false, error: error });
    }
});

app.get('/download/repo', (req, res) => {
    const archivo = 'https://codeload.github.com/AaronOF27/prueba/legacy.zip/refs/heads/main?token=AYMUKH7IDTJFFK5IOMWUQSTGC7EC6'; // Ruta del archivo que deseas descargar
    const nombreArchivo = 'nombre_archivo.zip'; // Nombre deseado para el archivo descargado
    res.download(archivo, nombreArchivo);
});



app.get('/getUserData', async function  (req, res){
    req.get("Authorization");
    await fetch("https://api.github.com/user", {
        method: "GET",
        headers: {
            "Authorization" : req.get("Authorization")
        }
    }).then((response) => {
        console.log(response);
        return response.json();
    }).then((data) => {
        console.log(data);
        res.json(data);
    })
})


app.post('/downloadRepo', async function  (req, res){
    try {
        const result = await githubRequests.downloadRepo(req, res);
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        if(error.message === 'Error: Unauthorized'){
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }
        return res.status(500).json({ success: false, error: error });
    }
});


app.post('/commit', async function(req, res) {
    try {
        const user = 'AaronOF27';
        const repo = 'prueba';
        const filePath = 'archivo.txt';
        const commitMessage = 'Commit desde la API de GitHub';

        // Datos del commit
        const commitData = {
            message: commitMessage,
            content: Buffer.from('Contenido del archivo').toString('base64') // Contenido del archivo codificado en base64
        };

        // Realizar la solicitud de commit
        const commitResponse = await fetch(`https://api.github.com/repos/${user}/${repo}/contents/${filePath}`, {
            method: "PUT",
            headers: {
                "Authorization": req.get("Authorization"),
                "Content-Type": "application/json",
            },
            body: JSON.stringify(commitData)
        });

        if (!commitResponse.ok) {
            throw new Error(`Error al realizar el commit: ${commitResponse.statusText}`);
        }

        const commitJson = await commitResponse.json();
        console.log("Datos del commit:", commitJson);

        // Envía la respuesta al cliente
        res.json({ message: 'Commit exitoso' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});


// app.post('/commitRepo', async function(req, res) {
//     try {
//         console.log("sipsip");
//         const user = 'AaronOF27';
//         const repo = 'prueba';
//         const branch = 'main'; // Cambia esto por el nombre de la rama en la que deseas hacer el commit
//         const commitMessage = 'Mensaje de commit';

//         // Autenticación
//         //const accessToken = req.get("Authorization"); // Debes proporcionar un token de acceso válido con permisos de escritura en el repositorio

//         // Contenido del archivo que deseas modificar
//         const fileContent = 'Contenido del archivo a modificar';

//         // Obtener el árbol actual de la rama
//         const getTreeResponse = await fetch(`https://api.github.com/repos/${user}/${repo}/git/trees/${branch}`, {
//             method: 'GET',
//             headers: {
//                 'Authorization': req.get("Authorization")
//             }
//         });
//         const treeData = await getTreeResponse.json();
//         const treeSha = treeData.sha;

//         console.log("treSha ",treeData);


//         // Crear un nuevo árbol con los cambios
//         const newTree = [{
//             path: 'archivo.txt', // Cambia esto por el nombre y la ruta del archivo que deseas modificar
//             mode: '100644', // Modo de archivo (normalmente 100644 para archivos regulares)
//             type: 'blob',
//             content: fileContent
//         }];

//         const createTreeResponse = await fetch(`https://api.github.com/repos/${user}/${repo}/git/trees`, {
//             method: 'POST',
//             headers: {
//                 'Authorization': req.get("Authorization"),
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 base_tree: treeSha,
//                 tree: newTree
//             })
//         });
//         const newTreeData = await createTreeResponse.json();
//         const newTreeSha = newTreeData.sha;

//         console.log("NEWtreSha ",newTreeSha);


//         // Crear un nuevo commit
//         const createCommitResponse = await fetch(`https://api.github.com/repos/${user}/${repo}/git/commits`, {
//             method: 'POST',
//             headers: {
//                 'Authorization': req.get("Authorization"),
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 message: commitMessage,
//                 tree: newTreeSha,
//                 parents: [treeSha]
//             })
//         });
//         const newCommitData = await createCommitResponse.json();
//         const newCommitSha = newCommitData.sha;

//         console.log("token ",accessToken);

//         // Actualizar la referencia de la rama
//         const updateRefResponse = await fetch(`https://api.github.com/repos/${user}/${repo}/git/refs/heads/${branch}`, {
//             method: 'PATCH',
//             headers: {
//                 'Authorization': req.get("Authorization"),
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 sha: newCommitSha
//             })
//         });

//         if (!updateRefResponse.ok) {
//             throw new Error(`Error al actualizar la referencia de la rama: ${updateRefResponse.statusText}`);
//         }

//         // Respuesta exitosa
//         res.json({ message: 'Commit exitoso' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Error en el servidor' });
//     }
// });

async function hacerCommitEnRepositorio(req, cambios) {
    try {
        const user = 'AaronOF27';
        const repo = 'prueba';
        const branch = 'main'; // Cambia esto por el nombre de la rama en la que deseas hacer el commit
        const mensajeCommit = 'Mensaje de commit nuevo 2';

        // Obtener el último commit de la rama
        const ultimoCommitResponse = await fetch(`https://api.github.com/repos/${user}/${repo}/git/ref/heads/${branch}`, {
            method: 'GET',
            headers: {
                'Authorization': req.get("Authorization"),
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        const ultimoCommitData = await ultimoCommitResponse.json();
        const ultimoCommitSha = ultimoCommitData.object.sha;

        // Crear un nuevo árbol con los cambios
        const nuevoArbolResponse = await fetch(`https://api.github.com/repos/${user}/${repo}/git/trees`, {
            method: 'POST',
            headers: {
                'Authorization': req.get("Authorization"),
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                base_tree: ultimoCommitSha,
                tree: cambios.map(cambio => ({
                    path: cambio.path,
                    mode: '100644',
                    type: 'blob',
                    content: cambio.content
                }))
            })
        });
        const nuevoArbolData = await nuevoArbolResponse.json();
        const nuevoArbolSha = nuevoArbolData.sha;

        // Crear un nuevo commit
        const nuevoCommitResponse = await fetch(`https://api.github.com/repos/${user}/${repo}/git/commits`, {
            method: 'POST',
            headers: {
                'Authorization': req.get("Authorization"),
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: mensajeCommit,
                tree: nuevoArbolSha,
                parents: [ultimoCommitSha]
            })
        });
        const nuevoCommitData = await nuevoCommitResponse.json();
        const nuevoCommitSha = nuevoCommitData.sha;

        // Actualizar la referencia de la rama
        const actualizarRamaResponse = await fetch(`https://api.github.com/repos/${user}/${repo}/git/refs/heads/${branch}`, {
            method: 'PATCH',
            headers: {
                'Authorization': req.get("Authorization"),
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sha: nuevoCommitSha
            })
        });

        if (!actualizarRamaResponse.ok) {
            throw new Error(`Error al actualizar la referencia de la rama: ${actualizarRamaResponse.statusText}`);
        }

        console.log('Commit exitoso.');
    } catch (error) {
        console.error('Error:', error);
    }
};

app.post('/commitRepo', async function(req, res) {

    const directorioRepo = 'C:/Users/aorozco/Desktop/Aaron/Estudio/Proyecto/pruebas/AaronOF27-prueba-713b657d8946e741fb2753f3caf103b3b82c7183/AaronOF27-prueba-713b657d8946e741fb2753f3caf103b3b82c7183/';

    leerDirectorioRecursivo(directorioRepo,directorioRepo)
    .then(cambios => {
        hacerCommitEnRepositorio(req, cambios);
    })
    .catch(error => console.error('Error:', error));
});



async function leerDirectorioRecursivo(directorioRepo,directorio) {
    let cambios = [];

    // Leer el contenido del directorio
    const archivos = await fs.promises.readdir(directorio);

    // Recorrer todos los archivos y subdirectorios
    for (const archivo of archivos) {
        const rutaArchivo = path.join(directorio, archivo);
        const estadisticas = await fs.promises.stat(rutaArchivo);

        if (estadisticas.isFile()) {
            // Si es un archivo, leer su contenido
            const contenido = await fs.promises.readFile(rutaArchivo, 'utf8');
            const rutaRelativa = rutaArchivo.replace(/\\/g, '/').replace(directorioRepo, '');
            cambios.push({
                path: rutaRelativa, // Reemplazar las barras invertidas con barras inclinadas
                content: contenido
            });
        } else if (estadisticas.isDirectory()) {
            // Si es un directorio, leer su contenido recursivamente
            const cambiosDirectorio = await leerDirectorioRecursivo(directorioRepo, rutaArchivo);
            cambios = cambios.concat(cambiosDirectorio);
        }
    }

   return cambios;
}


app.listen(4000, function() {
    console.log("CORS server running on port 4000");
    // databaseRequests.connection.connect(function(err){
    //     if(err) throw err;
    //     console.log("Database Connected");
    // }
    // );
});