var express = require('express');
var cors = require('cors');
const fetch = (...args) =>
import('node-fetch').then(({default: fetch}) => fetch(...args));
var bodyParser = require('body-parser');

const CLIENT_ID = "b771595a6c15c6653d02";
const CLIENT_SECRET = "534c078c5dcaa7afc22d912c6aceb4bda2038b99";

var app = express();

app.use(cors());
app.use(bodyParser.json());

//code being passed from the fronted
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

app.post('/createIssue', async function (req,res){
    console.log("hola")

    const { repoName, userName} = req.body;
    const accessToken = req.get("Authorization");
   // const createIssueUrl = 'https://api.github.com/repos/${userName}/${repoName}/issues';
    try{
        const issuesData = await fs.readFile('./TestIssues.json', 'utf8');
        const issues = JSON.parse(issuesData); 
        // Crear cada issue en el repositorio
        const createIssuePromises = issues.map(async (issue) => {
            const createIssueUrl = "https://api.github.com/repos/"+userName+"/"+repoName+"/issues";

            // Crear la issue
            const response = await fetch(createIssueUrl, {
                method: "POST",
                headers: {
                    "Authorization": accessToken,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    title: issue.title,
                    body: issue.body || '', // Puedes ajustar según tu necesidad
                    labels: issue.labels || [] // Puedes ajustar según tu necesidad
                })
            });

            if (!response.ok) {
                throw new Error(`Error al crear la issue: ${response.statusText}`);
            }

            return response.json();
        });

        // Esperar a que se completen todas las promesas de creación de issue
        const createdIssues = await Promise.all(createIssuePromises);

        console.log(createdIssues);
        res.json(createdIssues);
    } catch (error) {
        console.error("Error TOCHO",error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }

})


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


app.get('/downloadRepo', async function  (req, res){
    console.log("hola");
    req.get("Authorization");
    const user = 'aaronof17';
    const repo = 'demo1';

    await fetch(`https://api.github.com/repos/${user}/${repo}/zipball`, {
        method: "GET",
        headers: {
            "Authorization" : req.get("Authorization")
            
        }
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




app.listen(4000, function() {
    console.log("CORS server running on port 4000");
});