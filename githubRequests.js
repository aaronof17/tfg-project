const fetch = (...args) =>
import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

async function getAccessToken(req, res) {
    const params = "?client_id="+ CLIENT_ID + "&client_secret="+ CLIENT_SECRET + "&code=" + req.query.code;
    const response = await fetch("https://github.com/login/oauth/access_token" + params, {
        method: "POST",
        headers: {
            "Accept" : "application/json"
        }
    });
    const data = await response.json();
    return data;
}


async function deleteAppToken(req, res) {
    const token = req.body.token;
    const response = await fetch("https://api.github.com/applications/"+CLIENT_ID+"/token", {
        method: "DELETE",
        headers: {
            "Accept": "application/json"
        },
        body: JSON.stringify({
            access_token: CLIENT_SECRET
        })
    });
    const data = await response.json();
    return data;
}


async function createIssue(req, res) {
    const userName = req.body.user;
    const repo = req.body.repo;
    const title = req.body.title;
    const description = req.body.description;
    const accessToken = req.get("Authorization");

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
            throw new Error(`${response.statusText}`);
        }

        return response;
 
    } catch (error) {
        console.error(error);
        throw new Error(`${error}`);
    }

}

async function getUserData(req, res) {
    const response = await fetch("https://api.github.com/user", {
        method: "GET",
        headers: {
            "Authorization" : req.get("Authorization")
        }
    });
    const data = await response.json();
    console.log("USER DATA ",data);
    return data;
}

async function downloadRepo(req, res) {
    try {
        const user = req.body.user;
        const repo = req.body.repo;

        const githubResponse = await fetch(`https://api.github.com/repos/${user}/${repo}/zipball`, {
            method: "GET",
            headers: {
                "Authorization": req.get("Authorization")
            }
        });
        
        if (!githubResponse.ok) {
            throw new Error(`${githubResponse.statusText}`);
        }

        const url = githubResponse.url; // Obtener directamente la URL de descarga del campo 'url'
        console.log("URL de descarga:", url);
   
        return url;

    } catch (error) {
        console.error(error);
        throw new Error(`${error}`);
    }
}


async function getFinalCommitInfo(req, res) {
    try {
        const user = req.body.user;
        const repo = req.body.repo;

        const githubResponse = await fetch(`https://api.github.com/repos/${user}/${repo}/commits`, {
            method: "GET",
            headers: {
                "Authorization": req.get("Authorization")
            }
        });
        
        if (!githubResponse.ok) {
            throw new Error(`${githubResponse.statusText}`);
        }
        const commits = await githubResponse.json();   
        return commits;

    } catch (error) {
        console.error(error);
        throw new Error(`${error}`);
    }
}


async function createCommit(user, repo, accessToken) {
    // Lógica para descargar un repositorio de GitHub
}

module.exports = { getAccessToken, createIssue, getUserData, getFinalCommitInfo, downloadRepo, createCommit, deleteAppToken};