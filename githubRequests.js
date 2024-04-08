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

async function createIssue(repoName, userName, accessToken, issues) {
    // Lógica para crear problemas en GitHub
}

async function getUserData(accessToken) {
    // Lógica para obtener datos del usuario de GitHub
}

async function downloadRepo(req, res) {
    try {
        const user = 'AaronOF27';
        const repo = 'prueba';
        console.log("va a hacer la petición");

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
        res.status(500).json({ error: 'Error en el servidor' });
    }
}


async function createCommit(user, repo, accessToken) {
    // Lógica para descargar un repositorio de GitHub
}

module.exports = { getAccessToken, createIssue, getUserData, downloadRepo, createCommit};