const connection = require('./databaseInfo');

function getTeachers(req,res) {
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

function updateTeacherToken(req,res) {
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


function getTeacherId(req,res) {
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


function getTeacherToken(req,res) {
    const sql = 'select githubToken from teachers where teacherid=?';
    const params = [req.body.teacherId];
    connection.query(sql, params,(err, data) =>{
        if(err){
            console.log(err);
            return res.status(500).json({ success: false, error: 'Error getting token: '+ err.sqlMessage});
        } else {
            return res.status(200).json({ success: true, data: data });
        }
    })
}

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

// function getStudentsByGroup(req,res) {
//     const sql = "SELECT DISTINCT s.studentsID, s.name, "+
//                 "s.email, s.githubuser, e.repositoryURL " +
//                 "FROM students s " +
//                 "JOIN enrolled e ON s.studentsID = e.studentFK "+
//                 "JOIN labgroups g ON e.labgroupFK = g.idlabgroup "+
//                 "JOIN teachers t ON g.teacherIDFK = t.teacherID "+
//                 "WHERE t.teacherID = ? and g.name = ?";
//     const params = [req.body.teacherID, req.body.actualWork];
//     connection.query(sql, params,(err, data) =>{
//         if(err){
//             console.log(err);
//             return res.status(500).json({ success: false, error: 'Error getting students for work: '+ err.sqlMessage});
//         } else {
//             return res.status(200).json({ success: true, data: data });
//         }
//     })
// }

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

function deleteStudent(req,res) {
    const sql = 'delete from students where email=?';
    const params = [req.body.email];
    connection.query(sql, params,(err, data) =>{
        if(err){
            console.log(err);
            return res.status(500).json({ success: false, error: 'Error deleting student: '+ err.sqlMessage});
        } else {
            return res.status(200).json({ success: true, data: data });
        }
    })
}

function insertWork(req,res) {
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


function editWork(req,res) {
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



function deleteWork(req,res) {
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

function getWorksByTeacherId(req,res) {
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


function getWorkByStudent(req,res) {
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



function insertMark(req,res) {
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



function getGroupsBySubject(req,res) {
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


function getGroupsByTeacherId(req,res) {
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


function getGroupsByTeacherId(req,res) {
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

function getSubjectsByTeacherId(req,res) {
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


function insertEnrolled(req,res) {
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


function getIdFromGroupsByName(req,res) {
    const sql = "SELECT idlabgroup FROM labgroups where name=? ";
    const params = [req.body.groupName];
    connection.query(sql, params,(err, data) =>{
        if(err){
            console.log(err);
            return res.status(500).json({ success: false, error: 'Error getting id from group: '+ err.sqlMessage});
        } else {
            return res.status(200).json({ success: true, data: data });
        }
    })
}


function getMarkByWorkAndStudent(req,res) {
    const sql = "SELECT COUNT(*) as count FROM marks where studentIDFK=? and worklabIDFK=? ";
    const params = [req.body.student, req.body.work];
    connection.query(sql, params,(err, data) =>{
        if(err){
            console.log(err);
            return res.status(500).json({ success: false, error: 'Error getting id from marks: '+ err.sqlMessage});
        } else {
            return res.status(200).json({ success: true, data: data });
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

function editMark(req,res){
    const sql = 'update marks set mark=?, comment=? where studentIDFK=? and worklabIDFK=?';
    const params = [req.body.mark, req.body.comment, req.body.student,
                    req.body.work];
    connection.query(sql, params ,(err, data) =>{
        if(err){
            console.log(err);
            return res.status(500).json({ success: false, error: 'Error editing mark: '+ err.sqlMessage});
        } else {
            return res.status(200).json({ success: true, data: data });
        }
    })
}


module.exports = {connection, getIdFromGroupsByName, getIdByEmail, editMark, getMarkByWorkAndStudent, getTeacherToken, deleteStudent, getTeachers, getStudentsByTeacherWithoutRepo, updateTeacherToken, insertEnrolled, getSubjectsByTeacherId, getGroupsBySubject, getGroupsByTeacherId, getTeacherId, insertMark, getWorkByStudent, deleteWork, getStudentsBySubject, getWorksByTeacherId, insertWork, editWork, insertStudent, getStudentsByGroup, getStudentsByTeacher};