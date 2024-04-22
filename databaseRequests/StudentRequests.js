const connection = require('./databaseInfo');

function getStudentsByTeacher(req,res) {
    const sql = "SELECT DISTINCT s.studentsID, s.name, "+
                "s.email, s.githubuser, e.repositoryURL, g.name as labgroup " +
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

function getStudentId(req,res) {
    const sql = 'select studentsID from students where githubuser=?';
    const params = [req.body.githubUser];
    connection.query(sql, params,(err, data) =>{
        if(err){
            console.log(err);
            return res.status(500).json({ success: false, error: 'Error getting student id: '+ err.sqlMessage});
        } else {
            return res.status(200).json({ success: true, data: data });
        }
    })
}



function getStudentsBySubject(req,res) {
    const sql = "SELECT DISTINCT s.studentsID, s.name, "+
                "s.email, s.githubuser, e.repositoryURL, g.name as labgroup " +
                "FROM students s " +
                "JOIN enrolled e ON s.studentsID = e.studentFK "+
                "JOIN labgroups g ON e.labgroupFK = g.idlabgroup "+
                "JOIN teachers t ON g.teacherIDFK = t.teacherID "+
                "WHERE t.teacherID = ? and g.subject = ?";
    const params = [req.body.teacherID, req.body.subject];
    connection.query(sql, params,(err, data) =>{
        if(err){
            console.log(err);
            return res.status(500).json({ success: false, error: 'Error getting students by subject: '+ err.sqlMessage});
        } else {
            return res.status(200).json({ success: true, data: data });
        }
    })
}


function getStudentsByGroup(req,res) {
    const sql = "SELECT DISTINCT s.studentsID, s.name, "+
                "s.email, s.githubuser, e.repositoryURL, g.name as labgroup " +
                "FROM students s " +
                "JOIN enrolled e ON s.studentsID = e.studentFK "+
                "JOIN labgroups g ON e.labgroupFK = g.idlabgroup "+
                "JOIN teachers t ON g.teacherIDFK = t.teacherID "+
                "WHERE t.teacherID = ? and g.name = ?";
    const params = [req.body.teacherID, req.body.group];
    connection.query(sql, params,(err, data) =>{
        if(err){
            console.log(err);
            return res.status(500).json({ success: false, error: 'Error getting students by group: '+ err.sqlMessage});
        } else {
            return res.status(200).json({ success: true, data: data });
        }
    })
}

function getStudentsByTeacherWithoutRepo(req,res) {
    const sql = "SELECT DISTINCT s.studentsID, s.name, "+
                "s.email, s.githubuser " +
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


function insertStudent(req,res) {
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


function editStudent(req,res) {
    const sql = "UPDATE students AS s "+
                "JOIN enrolled AS e ON s.studentsID = e.studentFK "+
                "JOIN labgroups AS l ON e.labgroupFK = l.idlabGroup "+
                "SET s.name = ?, "+
                "s.githubuser = ?, "+
                "s.email = ?, "+
                "e.repositoryURL = ? "+
                "WHERE s.studentsID = ? "+
                "AND l.name = ? ";

    const params = [req.body.name, req.body.githubuser, req.body.email,
                    req.body.repository, req.body.studentId,req.body.group];
    connection.query(sql, params ,(err, data) =>{
        if(err){
            console.log(err);
            return res.status(500).json({ success: false, error: 'Error editing student: '+ err.sqlMessage});
        } else {
            return res.status(200).json({ success: true, data: data });
        }
    })
}



function deleteStudent(req,res) {
    const sql1 = "delete enrolled from enrolled "+
                "JOIN students as s ON s.studentsID = enrolled.studentFK "+
                "JOIN labgroups AS l ON enrolled.labgroupFK = l.idlabGroup "+
                "where enrolled.studentFK = ? and l.name = ? ";    
                
    const sql2 = "delete from students as s "+
                "where studentsID = ? "+
                "AND NOT EXISTS (SELECT * FROM enrolled as e where e.studentFK = ?)";

    const params1 = [req.body.studentID, req.body.group];
    const params2 = [req.body.studentID, req.body.studentID];

    connection.query(sql1, params1,(err, data) =>{
        if(err){
            console.log(err);
            return res.status(500).json({ success: false, error: 'Error deleting student: '+ err.sqlMessage});
        } else {
            connection.query(sql2, params2,(err, data) =>{
                if(err){
                    console.log(err);
                    return res.status(500).json({ success: false, error: 'Error deleting student: '+ err.sqlMessage});
                } else {
                    return res.status(200).json({ success: true, data: data });
                }
            })
        }
    })
}



function getIdByEmail(req,res) {
    const sql = "SELECT studentsID FROM students where email=? ";
    const params = [req.body.email];
    connection.query(sql, params,(err, data) =>{
        if(err){
            console.log(err);
            return res.status(500).json({ success: false, error: 'Error getting student id for email: '+ err.sqlMessage});
        } else {
            return res.status(200).json({ success: true, data: data });
        }
    })
}



module.exports = {getIdByEmail, deleteStudent, editStudent, getStudentsByTeacherWithoutRepo, getStudentsBySubject,insertStudent, getStudentsByGroup, getStudentsByTeacher, getStudentId};