const fetch = (...args) =>
import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config();
const fs = require('fs');
const crypto = require('crypto');

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

        const url = githubResponse.url;   
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


async function createExplanationCommit(req, res) {
    try {
        const file = req.file;
        const user = req.body.user;
        const repo = req.body.repo;
        const commitMessage = req.body.commitTitle;

        const pdfContent = fs.readFileSync(file.path);

        const newFileHash = crypto.createHash('sha1').update(pdfContent).digest('hex');

        const existingFileInfoResponse = await fetch(`https://api.github.com/repos/${user}/${repo}/contents/${file.originalname}`, {
            headers: {
                "Authorization": req.get("Authorization")
            }
        });

        if (existingFileInfoResponse.ok) {
            const existingFileInfo = await existingFileInfoResponse.json();
            const existingFileSha = existingFileInfo.sha;

            if (existingFileSha === newFileHash) {
                return { message: 'El archivo ya existe y no se ha modificado' };
            }

            // Si los hashes no coinciden, actualiza el archivo
            const commitData = {
                message: commitMessage,
                content: pdfContent.toString('base64'),
                sha: existingFileSha 
            };

            const updateResponse = await fetch(`https://api.github.com/repos/${user}/${repo}/contents/${file.originalname}`, {
                method: "PUT",
                headers: {
                    "Authorization": req.get("Authorization"),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(commitData)
            });

            if (!updateResponse.ok) {
                throw new Error(createResponse.statusText);
            }

            return { message: 'El archivo existente se ha actualizado' };
        }

        const commitData = {
            message: commitMessage,
            content: pdfContent.toString('base64')
        };

        const createResponse = await fetch(`https://api.github.com/repos/${user}/${repo}/contents/${file.originalname}`, {
            method: "PUT",
            headers: {
                "Authorization": req.get("Authorization"),
                "Content-Type": "application/json",
            },
            body: JSON.stringify(commitData)
        });

        if (!createResponse.ok) {
            throw new Error(createResponse.statusText);
        }

        return { message: 'Se ha creado un nuevo archivo' };

    } catch (error) {
        console.error(error);
        throw new Error(`${error}`);
    }
}

module.exports = { getAccessToken, createExplanationCommit, createIssue, getUserData, getFinalCommitInfo, downloadRepo, deleteAppToken};