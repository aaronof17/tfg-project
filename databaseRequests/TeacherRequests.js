const connection = require('../databaseInfo');

function getRoleByGitHubUser(req,res) {
    const sql = "SELECT 'teacher' AS user_type "+
    "FROM teachers WHERE githubProfile = ? "+
    "UNION "+
    "SELECT 'student' AS user_type " +
    "FROM students WHERE githubuser = ? " +
    "UNION "+
    "SELECT 'admin' AS user_type " +
    "FROM admins WHERE githubProfile = ? ";


    const params = [req.body.gituser, req.body.gituser, req.body.gituser];
    connection.query(sql, params, (err, data) =>{
        if(err){
            console.log(err);
            return res.status(500).json({ success: false, error: 'Error getting teachers: '+ err.sqlMessage, code: err.code});
        } else {
            return res.status(200).json({ success: true, data: data });
        }
    })
}

function getTeachers(req,res) {
    const sql = "SELECT * FROM teachers";
    connection.query(sql, (err, data) =>{
        if(err){
            console.log(err);
            return res.status(500).json({ success: false, error: 'Error getting teachers: '+ err.sqlMessage, code: err.code});
        } else {
            return res.status(200).json({ success: true, data: data });
        }
    })
}



function getTeacherByGitHubUser(req,res) {
    const sql = "SELECT COUNT(*) as count FROM teachers where githubProfile = ?";
    const params = [req.body.gituser];

    connection.query(sql, params, (err, data) =>{
        if(err){
            console.log(err);
            return res.status(500).json({ success: false, error: 'Error getting teachers: '+ err.sqlMessage, code: err.code});
        } else {
            return res.status(200).json({ success: true, data: data });
        }
    })
}

function updateTeacherToken(req,res) {
    const sql = 'update teachers set githubToken=? where githubProfile=?';
    const params = [req.body.token, req.body.profileName];
    connection.query(sql, params ,(err, data) =>{
        if(err){
            console.log(err);
            return res.status(500).json({ success: false, error: 'Error saving: '+ err.sqlMessage, code: err.code});
        } else {
            return res.status(200).json({ success: true, data: data });
        }
    })
}


function getTeacherId(req,res) {
    const sql = 'select teacherID from teachers where githubProfile=?';
    const params = [req.body.profileURL];
    connection.query(sql, params,(err, data) =>{
        if(err){
            console.log(err);
            return res.status(500).json({ success: false, error: 'Error getting teacherID: '+ err.sqlMessage, code: err.code});
        } else {
            return res.status(200).json({ success: true, data: data });
        }
    })
}


function insertTeacher(req,res) {
    const sql = 'INSERT INTO teachers (name, email, githubProfile) VALUES (?,?,?)';
    const params = [req.body.name, req.body.email, req.body.user];
    connection.query(sql, params,(err, data) =>{
        if(err){
            console.log(err);
            return res.status(500).json({ success: false, error: 'Error saving: '+ err.sqlMessage, code: err.code});
        } else {
            return res.status(200).json({ success: true, data: data });
        }
    })
}


function deleteTeacher(req,res) {
    const sql = 'delete from teachers where email = ?';
    const params = [req.body.email];
    connection.query(sql, params ,(err, data) =>{
        if(err){
            console.log(err);
            return res.status(500).json({ success: false, error: 'Error deleting teacher: '+ err.sqlMessage, code: err.code});
        } else {
            return res.status(200).json({ success: true, data: data });
        }
    })
}

function editTeacher(req,res) {
    const sql = "UPDATE teachers set name=?, email=?, githubProfile=? where email=?";

    const params = [req.body.name,  req.body.email, req.body.githubuser, req.body.teacherID];
    connection.query(sql, params ,(err, data) =>{
        if(err){
            console.log(err);
            return res.status(500).json({ success: false, error: 'Error saving: '+ err.sqlMessage, code: err.code});
        } else {
            return res.status(200).json({ success: true, data: data });
        }
    })
}


function getTeacherToken(req,res) {
    const sql = 'select githubToken from teachers where teacherid=?';
    const params = [req.body.teacherId];
    connection.query(sql, params,(err, data) =>{
        if(err){
            console.log(err);
            return res.status(500).json({ success: false, error: 'Error getting token: '+ err.sqlMessage, code: err.code});
        } else {
            return res.status(200).json({ success: true, data: data });
        }
    })
}


module.exports = {getTeacherToken, insertTeacher, getTeachers, editTeacher, deleteTeacher, updateTeacherToken, getTeacherId, getTeacherByGitHubUser, getRoleByGitHubUser};