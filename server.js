const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const databaseRequests = require('./databaseInfo.js');
const markRequests = require('./databaseRequests/MarkRequests.js');
const studentRequests = require('./databaseRequests/StudentRequests.js');
const workRequests = require('./databaseRequests/WorkRequests.js');
const groupRequests = require('./databaseRequests/LabGroupRequests.js');
const teacherRequests = require('./databaseRequests/TeacherRequests.js');
const enrrolledRequests = require('./databaseRequests/EnrolledRequests.js');
const githubRequests = require('./githubRequests.js');
const nodemailer = require('nodemailer');
const upload = multer({ dest: 'uploads/' });

const app = express();
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, 
    port: process.env.SMTP_PORT, 
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
});

const corsOptions = {
origin: '*', //http://156.35.98.77:3001
methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-Content-Type-Options',
    'Accept',
    'Origin',
    'Access-Control-Allow-Origin'
],
credentials: true,
preflightContinue: false,
optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.json());


//BD---------------------------------------------------------------------------------------------------------------------------------------------------------

app.post('/role/gituser',  async function (req, res) {
    const result = await teacherRequests.getRoleByGitHubUser(req,res);
    return result;
});

app.get('/teachers',  async function (req, res) {
    const result = await teacherRequests.getTeachers(req,res);
    return result;
});

app.post('/teachers/gituser',  async function (req, res) {
    const result = await teacherRequests.getTeacherByGitHubUser(req,res);
    return result;
});

app.post('/teachers/token',  async function (req, res) {
    const result = await teacherRequests.updateTeacherToken(req,res);
    return result;
});

app.post('/teachers/token/id',  async function (req, res) {
    const result = await teacherRequests.getTeacherToken(req,res);
    return result;
});

app.post('/teachers/id', async function (req, res) {
    const result = await teacherRequests.getTeacherId(req,res);
    return result;
});

app.post('/teachers/save', async function (req, res) {
    const result = await teacherRequests.insertTeacher(req,res);
    return result;
});

app.post('/teachers/delete', async function (req, res) {
    const result = await teacherRequests.deleteTeacher(req,res);
    return result;
});

app.post('/teachers/edit', async function (req, res) {
    const result = await teacherRequests.editTeacher(req,res);
    return result;
});

app.post('/students/id', async function (req, res) {
    const result = await studentRequests.getStudentId(req,res);
    return result;
});

app.post('/students/teacher', async function (req, res) {
    const result = await studentRequests.getStudentsByTeacher(req,res);
    return result;
});

app.get('/students', async function (req, res) {
    const result = await studentRequests.getAllStudents(req,res);
    return result;
});

app.post('/students/teacher/subject', async function (req, res) {
    const result = await studentRequests.getStudentsBySubject(req,res);
    return result;
});

app.post('/students/teacher/repo', async function (req, res) {
    const result = await studentRequests.getStudentsByTeacherWithoutRepo(req,res);
    return result;
});

app.post('/students/work', async function (req, res) {
    const result = await studentRequests.getStudentsByGroup(req,res);
    return result;
});

app.post('/students/save', async function (req, res) {
    const result = await studentRequests.insertStudent(req,res);
    return result;
});

app.post('/students/edit', async function (req, res) {
    const result = await studentRequests.editStudent(req,res);
    return result;
});

app.post('/students/delete', async function (req, res) {
    const result = await studentRequests.deleteStudent(req,res);
    return result;
});

app.post('/students/email', async function (req, res) {
    const result = await studentRequests.getIdByEmail(req,res);
    return result;
});

app.post('/students/githubUser', async function (req, res) {
    const result = await studentRequests.getIdByUser(req,res);
    return result;
});

app.post('/works/student/id',  async function (req, res) {
    const result = await workRequests.getWorksByStudentId(req,res);
    return result;
});

app.post('/works/save',  async function (req, res) {
    const result = await workRequests.insertWork(req,res);
    return result;
});

app.post('/works/edit', async function (req, res) {
    const result = await workRequests.editWork(req,res);
    return result;
});

app.post('/works/delete', async function (req, res) {
    const result = await workRequests.deleteWork(req,res);
    return result;
});

app.post('/works', async function (req, res) {
    const result = await workRequests.getWorksByTeacherId(req,res);
    return result;
});

app.post('/works/active', async function (req, res) {
    const result = await workRequests.getActiveWorksByTeacherId(req,res);
    return result;
});

app.post('/works/student', async function (req, res) {
    const result = await workRequests.getWorkByStudent(req,res);
    return result;
});

app.post('/works/group', async function (req, res) {
    const result = await workRequests.getWorskByGroup(req,res);
    return result;
});

app.post('/works/subject', async function (req, res) {
    const result = await workRequests.getWorskBySubject(req,res);
    return result;
});

app.post('/works/student/subject', async function (req, res) {
    const result = await workRequests.getWorksByStudentAndSubject(req,res);
    return result;
});

app.post('/works/student/group', async function (req, res) {
    const result = await workRequests.getWorksByStudentAndGroup(req,res);
    return result;
});

app.post('/works/marks/student/group', async function (req, res) {
    const result = await workRequests.getWorksAndMarksByStudentAndGroup(req,res);
    return result;
});

app.post('/marks/save', async function (req, res) {
    const result = await markRequests.insertMark(req,res);
    return result;
});

app.post('/marks/edit', async function (req, res) {
    const result = await markRequests.editMark(req,res);
    return result;
});

app.post('/marks/work/student', async function (req, res) {
    const result = await markRequests.getMarkByWorkAndStudent(req,res);
    return result;
});

app.post('/groups/subject', async function (req, res) {
    const result = await groupRequests.getGroupsBySubject(req,res);
    return result;
});

app.post('/groups/name', async function (req, res) {
    const result = await groupRequests.getIdFromGroupsByName(req,res);
    return result;
});

app.post('/groups/save', async function (req, res) {
    const result = await groupRequests.saveLabGroup(req,res);
    return result;
});

app.post('/groups/delete', async function (req, res) {
    const result = await groupRequests.deleteGroup(req,res);
    return result;
});

app.post('/groups/edit', async function (req, res) {
    const result = await groupRequests.editGroup(req,res);
    return result;
});

app.post('/groups/teacher', async function (req, res) {
    const result = await groupRequests.getGroupsByTeacherId(req,res);
    return result;
});

app.get('/groups', async function (req, res) {
    const result = await groupRequests.getGroups(req,res);
    return result;
});

app.post('/subjects/student', async function (req, res) {
    const result = await groupRequests.getSubjectsForStudent(req,res);
    return result;
});

app.post('/subjects', async function (req, res) {
    const result = await groupRequests.getSubjectsByTeacherId(req,res);
    return result;
});

app.post('/enrolled/save', async function (req, res) {
    const result = await enrrolledRequests.insertEnrolled(req,res);
    return result;
});

//---------------------------------------------------------------------------------------------------------------------------------------------------------

app.post('/sendemail', async function  (req, res){
    const mailOptions = {
        from: process.env.SMTP_USER,
        to: req.body.studentEmail,
        subject: req.body.subject,
        html: req.body.message
      };
    
      transporter.sendMail(mailOptions, (error, info) => {
        if(error){
            console.log(error);
            return res.status(500).json({ success: false, error: 'Error sending email to '+ req.body.studentEmail+ ": "+error});
        } else {
            return res.status(200).json({ success: true, data:  info.response });
        }
      });
});

//---------------------------------------------------------------------------------------------------------------------------------------------------------

app.get('/login', async function  (req, res){
    res.json({ redirectUrl: "https://github.com/login/oauth/authorize?client_id="+ process.env.CLIENT_ID });
});


app.get('/getAccessToken', async function (req,res){
    try {
        const result = await githubRequests.getAccessToken(req, res);
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        return res.status(500).json({ success: false, error: error });
    }
}); 


app.post('/createIssue', async function  (req, res){
    try {
        const result = await githubRequests.createIssue(req, res);
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        if(error.message === 'Error: Unauthorized'){
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }
        if(error.message === 'Error: Not Found'){
            return res.status(402).json({ success: false, error: 'Not Found' });
        }
        return res.status(500).json({ success: false, error: error });
    }
});


app.get('/getUserData', async function  (req, res){
    try {
        const result = await githubRequests.getUserData(req, res);
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        return res.status(500).json({ success: false, error: error });
    }
});


app.post('/downloadRepo', async function  (req, res){
    try {
        const result = await githubRequests.downloadRepo(req, res);
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        if(error.message === 'Error: Unauthorized'){
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }
        if(error.message === 'Error: Not Found'){
            return res.status(402).json({ success: false, error: 'Not Found' });
        }
        return res.status(500).json({ success: false, error: error });
    }
});


app.post('/getFinalCommitInfo', async function  (req, res){
    try {
        const result = await githubRequests.getFinalCommitInfo(req, res);
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        if(error.message === 'Error: Unauthorized'){
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }
        if(error.message === 'Error: Not Found'){
            return res.status(402).json({ success: false, error: 'Not Found' });
        }
        return res.status(500).json({ success: false, error: error });
    }
});


app.post('/commitExplanation', upload.single('file'), async function(req, res) {
    try {
        const result = await githubRequests.createExplanationCommit(req, res);
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        if(error.message === 'Error: Unauthorized'){
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }
        if(error.message === 'Error: Not Found'){
            return res.status(402).json({ success: false, error: 'Not Found' });
        }
        return res.status(500).json({ success: false, error: error });
    }
});


app.listen(4001, function() {
    console.log("CORS server running on port 4001");
});