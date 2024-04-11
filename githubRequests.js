const fetch = (...args) =>
import('node-fetch').then(({default: fetch}) => fetch(...args));


const CLIENT_ID = "b771595a6c15c6653d02";
const CLIENT_SECRET = "534c078c5dcaa7afc22d912c6aceb4bda2038b99";

async function getAccessToken(code) {
    const params = "?client_id="+ CLIENT_ID + "&client_secret="+ CLIENT_SECRET + "&code=" + code;
    const response = await fetch("https://github.com/login/oauth/access_token" + params, {
        method: "POST",
        headers: {
            "Accept" : "application/json"
        }
    });
    const data = await response.json();
    return data;
}

async function createIssue(req, res) {
    console.log("entra a la creación de issue")

    const userName = req.body.user;
    const repo = req.body.repo;
    const title = req.body.title;
    const description = req.body.description;

    const accessToken = req.get("Authorization");
   // const createIssueUrl = 'https://api.github.com/repos/${userName}/${repoName}/issues';
    try{
        const createIssueUrl = "https://api.github.com/repos/"+userName+"/"+repo+"/issues";

        const response = await fetch(createIssueUrl, {
            method: "POST",
            headers: {
                "Authorization": accessToken,
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                title: title,
                body: description || ''
            })
        });

        if (!response.ok) {
            throw new Error(`Error al crear la issue: ${response.statusText}`);
        }

        return response;
 
    } catch (error) {
        console.error(error);
        throw new Error(`Error al crear la issue: ${error}`);
    }

}

async function getUserData(accessToken) {
    // Lógica para obtener datos del usuario de GitHub
}

async function downloadRepo(req, res) {
    try {
        const user = 'AaronOF27';
        const repo = 'prueba';

        const githubResponse = await fetch(`https://api.github.com/repos/${user}/${repo}/zipball`, {
            method: "GET",
            headers: {
                "Authorization": req.get("Authorization")
            }
        });

        if (!githubResponse.ok) {
            return res.status(500).json({ success: false, error: 'Error downloading github repository' });
        }

        const url = githubResponse.url; // Obtener directamente la URL de descarga del campo 'url'
        console.log("URL de descarga:", url);
   
        return url;

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor al descarga repositorio' });
    }
}


async function createCommit(user, repo, accessToken) {
    // Lógica para descargar un repositorio de GitHub
}

module.exports = { getAccessToken, createIssue, getUserData, downloadRepo, createCommit};