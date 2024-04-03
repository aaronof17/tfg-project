var express = require('express');
var cors = require('cors');
const fetch = (...args) =>
import('node-fetch').then(({default: fetch}) => fetch(...args));
var bodyParser = require('body-parser');
var connection = require('./databaseInfo');

const CLIENT_ID = "b771595a6c15c6653d02";
const CLIENT_SECRET = "534c078c5dcaa7afc22d912c6aceb4bda2038b99";

var app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

//BD---------------------------------------------------------------------------------------------------------------------------------------------------------

app.get('/teachers', (req, res) => {
    const sql = "SELECT * FROM teachers";
    connection.query(sql, (err, data) =>{
        if(err){
            console.log(err);
            return res.status(500).json({ success: false, error: 'Error getting teachers: '+ err.sqlMessage});
        } else {
            return res.status(200).json({ success: true, data: data });
        }
    })
}
)

app.post('/teachers/token', (req, res) => {
    const sql = 'update teachers set githubToken=? where githubProfile=?';
    const params = [req.body.token, req.body.profileName];
    connection.query(sql, params ,(err, data) =>{
        if(err){
            console.log(err);
            return res.status(500).json({ success: false, error: 'Error saving token: '+ err.sqlMessage});
        } else {
            return res.status(200).json({ success: true, data: data });
        }
    })
}
)


app.post('/teachers/id', (req, res) => {
    const sql = 'select teacherID from teachers where githubProfile=?';
    const params = [req.body.profileURL];
    connection.query(sql, params,(err, data) =>{
        if(err){
            console.log(err);
            return res.status(500).json({ success: false, error: 'Error getting teacherID: '+ err.sqlMessage});
        } else {
            return res.status(200).json({ success: true, data: data });
        }
    })
}
)


app.post('/students/teacher', (req, res) => {
    const sql = "SELECT DISTINCT s.studentsID, s.name, "+
                "s.email, s.githubuser, e.repositoryURL " +
                "FROM students s " +
                "JOIN enrolled e ON s.studentsID = e.studentFK "+
                "JOIN labgroups g ON e.labgroupFK = g.idlabgroup "+
                "JOIN teachers t ON g.teacherIDFK = t.teacherID "+
                "WHERE t.teacherID = ?";
    const params = [req.body.teacherID];
    connection.query(sql, params,(err, data) =>{
        if(err){
            console.log(err);
            return res.status(500).json({ success: false, error: 'Error getting students for teacher: '+ err.sqlMessage});
        } else {
            return res.status(200).json({ success: true, data: data });
        }
    })
}
)

app.post('/students/work', (req, res) => {
    const sql = "SELECT DISTINCT s.studentsID, s.name, "+
                "s.email, s.githubProfile, s.repositoryURL " +
                "FROM students s " +
                "JOIN enrolled e ON s.studentsID = e.studentFK "+
                "JOIN labgroups g ON e.labgroupFK = g.idlabgroup "+
                "JOIN teachers t ON g.teacherIDFK = t.teacherID "+
                "WHERE t.teacherID = ? and g.name = ?";
    const params = [req.body.teacherID, req.body.actualWork];
    connection.query(sql, params,(err, data) =>{
        if(err){
            console.log(err);
            return res.status(500).json({ success: false, error: 'Error getting students for work: '+ err.sqlMessage});
        } else {
            return res.status(200).json({ success: true, data: data });
        }
    })
}
)

app.post('/students/save', (req, res) => {
    const sql = 'INSERT INTO students (name, email, githubuser) VALUES (?,?,?)';
    const params = [req.body.name, req.body.email, req.body.user];
    connection.query(sql, params,(err, data) =>{
        if(err){
            console.log(err);
            return res.status(500).json({ success: false, error: 'Error saving student: '+ err.sqlMessage});
        } else {
            return res.status(200).json({ success: true, data: data });
        }
    })
}
)


app.post('/works/save', (req, res) => {
    const sql = 'INSERT INTO worklabs (title, description, initialdate, finaldate, percentage, labgroupNameFK, teacherIDFK) VALUES (?,?,?,?,?,?,?)';
    const params = [req.body.title, req.body.description, req.body.initialDate,
        req.body.finalDate, req.body.percentage, req.body.name,  req.body.teacherID];
    connection.query(sql, params,(err, data) =>{
        if(err){
            console.log(err);
            return res.status(500).json({ success: false, error: 'Error saving works: '+ err.sqlMessage});
        } else {
            return res.status(200).json({ success: true, data: data });
        }
    })
}
)

app.post('/works/edit', (req, res) => {
    const sql = 'update worklabs set title=?, description=?, percentage=?, '+
                'initialdate=?, finaldate=? where worklabID=?';
    const params = [req.body.title, req.body.description, req.body.percentage,
                    req.body.initialdate, req.body.finaldate, req.body.worklabID];
    connection.query(sql, params ,(err, data) =>{
        if(err){
            console.log(err);
            return res.status(500).json({ success: false, error: 'Error editing work: '+ err.sqlMessage});
        } else {
            return res.status(200).json({ success: true, data: data });
        }
    })
}
)

app.post('/works/delete', (req, res) => {
    const sql = 'delete from worklabs where worklabID = ?';
    const params = [req.body.worklabID];
    connection.query(sql, params ,(err, data) =>{
        if(err){
            console.log(err);
            return res.status(500).json({ success: false, error: 'Error deleting work: '+ err.sqlMessage});
        } else {
            return res.status(200).json({ success: true, data: data });
        }
    })
}
)


app.post('/works', (req, res) => {
    const sql = 'select worklabID, title, labgroupNameFK, description, percentage, initialdate, finaldate from worklabs where teacheridfk=?';
    const params = [req.body.teacherID];
    connection.query(sql, params,(err, data) =>{
        if(err){
            console.log(err);
            return res.status(500).json({ success: false, error: 'Error getting works: '+ err.sqlMessage});
        } else {
            return res.status(200).json({ success: true, data: data });
        }
    })
}
)


app.post('/works/student', (req, res) => {
    const sql = "SELECT DISTINCT w.worklabID, w.title, w.labgroupNameFK "+
                "FROM worklabs w " +
                "JOIN labgroups g ON w.labgroupnameFK = g.name "+
                "JOIN enrolled e ON g.idlabgroup = e.labgroupfk "+
                "JOIN students s ON e.studentfk = s.studentsID "+
                "WHERE g.teacherIDFK = ? and s.email = ?";
    const params = [req.body.teacherID, req.body.studentEmail];
    connection.query(sql, params,(err, data) =>{
        if(err){
            console.log(err);
            return res.status(500).json({ success: false, error: 'Error getting work for student: '+ err.sqlMessage});
        } else {
            return res.status(200).json({ success: true, data: data });
        }
    })
}
)


app.post('/marks/save', (req, res) => {
    const sql = 'INSERT INTO marks (mark, comment, studentIDFK, worklabIDFK) VALUES (?,?,?,?)';
    const params = [req.body.mark, req.body.comment, req.body.student,
        req.body.work];
    connection.query(sql, params,(err, data) =>{
        if(err){
            console.log(err);
            return res.status(500).json({ success: false, error: 'Error saving mark at data base: '+ err.sqlMessage});
        } else {
            return res.status(200).json({ success: true, data: data });
        }
    })
}
)


app.post('/groups/subject', (req, res) => {
    const sql = 'select name from labgroups where subject=? and teacheridfk=?';
    const params = [req.body.actualSubject, req.body.teacherID];
    connection.query(sql, params,(err, data) =>{
        if(err){
            console.log(err);
            return res.status(500).json({ success: false, error: 'Error getting labgroups for subject: '+ err.sqlMessage});
        } else {
            return res.status(200).json({ success: true, data: data });
        }
    })
}
)

app.post('/labGroups', (req, res) => {
    const sql = "SELECT name,idlabGroup FROM labgroups where teacherIDFK=?";
    const params = [req.body.teacherID];
    connection.query(sql, params, (err, data) =>{
        if(err){
            console.log(err);
            return res.status(500).json({ success: false, error: 'Error getting labgroups: '+ err.sqlMessage});
        } else {
            return res.status(200).json({ success: true, data: data });
        }
    })
    }
)


app.post('/subjects', (req, res) => {
    const sql = "SELECT DISTINCT subject FROM labgroups where teacherIDFK=? ";
    const params = [req.body.teacherID];
    connection.query(sql, params,(err, data) =>{
        if(err){
            console.log(err);
            return res.status(500).json({ success: false, error: 'Error getting subjects: '+ err.sqlMessage});
        } else {
            return res.status(200).json({ success: true, data: data });
        }
    })
}
)


app.post('/enrolled/save', (req, res) => {
    const sql = 'INSERT INTO enrolled (studentFK, labgroupFK, repositoryURL) VALUES (?,?,?)';
    const params = [req.body.studentId, req.body.groupId, req.body.repository];
    connection.query(sql, params,(err, data) =>{
        if(err){
            console.log(err);
            return res.status(500).json({ success: false, error: 'Error saving enrolled: '+ err.sqlMessage});
        } else {
            return res.status(200).json({ success: true, data: data });
        }
    })
}
)


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
    connection.connect(function(err){
        if(err) throw err;
        console.log("Database Connected");
    }
    );
});