const connection = require('../databaseInfo');



function insertWork(req,res) {
    const sql = 'INSERT INTO worklabs (title, description, initialdate, finaldate, percentage, labgroupNameFK, teacherIDFK, active) VALUES (?,?,?,?,?,?,?,1)';
    const params = [req.body.title, req.body.description, req.body.initialDate,
        req.body.finalDate, req.body.percentage, req.body.name,  req.body.teacherID];
    connection.query(sql, params,(err, data) =>{
        if(err){
            console.log(err);
            return res.status(500).json({ success: false, error: 'Error saving: '+ err.sqlMessage, code: err.code});
        } else {
            return res.status(200).json({ success: true, data: data });
        }
    })
}


function editWork(req,res) {
    const sql = 'update worklabs set title=?, description=?, percentage=?, '+
                'initialdate=?, finaldate=?, active=? where worklabID=?';
    const params = [req.body.title, req.body.description, req.body.percentage,
                    req.body.initialdate, req.body.finaldate, req.body.active, req.body.worklabID];
    connection.query(sql, params ,(err, data) =>{
        if(err){
            console.log(err);
            return res.status(500).json({ success: false, error: 'Error saving: '+ err.sqlMessage, code: err.code});
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
            return res.status(500).json({ success: false, error: 'Error deleting work: '+ err.sqlMessage, code: err.code});
        } else {
            return res.status(200).json({ success: true, data: data });
        }
    })
}

function getWorksByTeacherId(req,res) {
    const sql = 'select worklabID, title, labgroupNameFK, description, percentage, initialdate, finaldate, active from worklabs where teacheridfk=?';
    const params = [req.body.teacherID];
    connection.query(sql, params,(err, data) =>{
        if(err){
            console.log(err);
            return res.status(500).json({ success: false, error: 'Error getting works: '+ err.sqlMessage, code: err.code});
        } else {
            return res.status(200).json({ success: true, data: data });
        }
    })
}

function getActiveWorksByTeacherId(req,res) {
    const sql = 'select worklabID, title, labgroupNameFK, description, percentage, initialdate, finaldate, active from worklabs where teacheridfk=? and active=1';
    const params = [req.body.teacherID];
    connection.query(sql, params,(err, data) =>{
        if(err){
            console.log(err);
            return res.status(500).json({ success: false, error: 'Error getting active works: '+ err.sqlMessage, code: err.code});
        } else {
            return res.status(200).json({ success: true, data: data });
        }
    })
}


function getWorkByStudent(req,res) {
    const sql = "SELECT DISTINCT w.worklabID, w.title, w.labgroupNameFK, w.active "+
                "FROM worklabs w " +
                "JOIN labgroups g ON w.labgroupnameFK = g.name "+
                "JOIN enrolled e ON g.idlabgroup = e.labgroupfk "+
                "JOIN students s ON e.studentfk = s.studentsID "+
                "WHERE g.teacherIDFK = ? and s.email = ? and w.active=1";
    const params = [req.body.teacherID, req.body.studentEmail];
    connection.query(sql, params,(err, data) =>{
        if(err){
            console.log(err);
            return res.status(500).json({ success: false, error: 'Error getting work for student: '+ err.sqlMessage, code: err.code});
        } else {
            return res.status(200).json({ success: true, data: data });
        }
    })
}

function getWorskByGroup(req,res) {
    const sql = "SELECT DISTINCT w.worklabID, w.title, w.labgroupNameFK, w.description, w.percentage, w.initialdate, w.finaldate, w.active "+
                "FROM worklabs w where w.labgroupNameFK = ? and w.teacherIDFK = ?";;
    const params = [req.body.groupName, req.body.teacherID];
    connection.query(sql, params,(err, data) =>{
        if(err){
            console.log(err);
            return res.status(500).json({ success: false, error: 'Error getting work for group: '+ err.sqlMessage, code: err.code});
        } else {
            return res.status(200).json({ success: true, data: data });
        }
    })
}

function getWorskBySubject(req,res) {
    const sql = "SELECT DISTINCT w.worklabID, w.title, w.labgroupNameFK, w.description, w.percentage, w.initialdate, w.finaldate, w.active "+
                "FROM worklabs w JOIN labgroups l ON l.name = w.labgroupNameFK where l.subject = ? and w.teacherIDFK = ?";;
    const params = [req.body.subject, req.body.teacherID];
    connection.query(sql, params,(err, data) =>{
        if(err){
            console.log(err);
            return res.status(500).json({ success: false, error: 'Error getting work for subject: '+ err.sqlMessage, code: err.code});
        } else {
            return res.status(200).json({ success: true, data: data });
        }
    })
}

function getWorksByStudentAndSubject(req,res) {
    const sql = "SELECT DISTINCT w.worklabID as id, w.title, w.labgroupNameFK as groupName, w.description, w.initialdate, "+
                "w.finaldate, w.percentage, COALESCE(m.mark, '') AS mark, COALESCE(m.comment, '') AS comment  "+
                "FROM worklabs w " +
                "JOIN labgroups g ON w.labgroupnameFK = g.name "+
                "JOIN enrolled e ON g.idlabgroup = e.labgroupfk "+
                "JOIN students s ON e.studentfk = s.studentsID "+
                "LEFT JOIN marks m ON w.worklabID = m.worklabIDFk AND s.studentsId = m.studentIDFK "+
                "WHERE s.studentsId=? and g.subject=? and w.active=1";
    const params = [req.body.studentId, req.body.subject];
    connection.query(sql, params,(err, data) =>{
        if(err){
            console.log(err);
            return res.status(500).json({ success: false, error: 'Error getting work for student and subject: '+ err.sqlMessage, code: err.code});
        } else {
            return res.status(200).json({ success: true, data: data });
        }
    })
}


function getWorksByStudentAndGroup(req,res) {
    const sql = "SELECT DISTINCT w.worklabID, w.title, w.labgroupNameFK, w.initialdate, w.finaldate, w.active "+
                "FROM worklabs w " +
                "JOIN labgroups g ON w.labgroupnameFK = g.name "+
                "JOIN enrolled e ON g.idlabgroup = e.labgroupfk "+
                "JOIN students s ON e.studentfk = s.studentsID "+
                "WHERE g.teacherIDFK = ? and s.studentsId = ? and g.name = ? and w.active=1 ";
    const params = [req.body.teacherID, req.body.studentId, req.body.group];
    connection.query(sql, params,(err, data) =>{
        if(err){
            console.log(err);
            return res.status(500).json({ success: false, error: 'Error getting work for student and group: '+ err.sqlMessage, code: err.code});
        } else {
            return res.status(200).json({ success: true, data: data });
        }
    })
}


function getWorksAndMarksByStudentAndGroup(req,res) {
    const sql = "SELECT DISTINCT w.title, s.studentsID as studentID, w.labgroupNameFK as groupName, "+
                "w.percentage, COALESCE(m.mark, '') AS mark "+
                "FROM worklabs w " +
                "JOIN labgroups g ON w.labgroupnameFK = g.name "+
                "JOIN enrolled e ON g.idlabgroup = e.labgroupfk "+
                "JOIN students s ON e.studentfk = s.studentsID "+
                "LEFT JOIN marks m ON w.worklabID = m.worklabIDFk AND s.studentsId = m.studentIDFK  "+
                "WHERE s.studentsId=? and w.active=1 and g.name=? and g.teacherIDFK=?";
    const params = [req.body.studentId, req.body.group, req.body.teacherID];
    connection.query(sql, params,(err, data) =>{
        if(err){
            console.log(err);
            return res.status(500).json({ success: false, error: 'Error getting works and marks for student: '+ err.sqlMessage, code: err.code});
        } else {
            return res.status(200).json({ success: true, data: data });
        }
    })
}


function getWorksByStudentId(req,res) {
    const sql = "SELECT DISTINCT w.worklabID as id, w.title, w.labgroupNameFK as groupName, w.description, w.initialdate, w.active, "+
                "w.finaldate, w.percentage, COALESCE(m.mark, '') AS mark, COALESCE(m.comment, '') AS comment  "+
                "FROM worklabs w " +
                "JOIN labgroups g ON w.labgroupnameFK = g.name "+
                "JOIN enrolled e ON g.idlabgroup = e.labgroupfk "+
                "JOIN students s ON e.studentfk = s.studentsID "+
                "LEFT JOIN marks m ON w.worklabID = m.worklabIDFk AND s.studentsId = m.studentIDFK  "+
                "WHERE s.studentsId=? and w.active=1";
    const params = [req.body.studentId];
    connection.query(sql, params,(err, data) =>{
        if(err){
            console.log(err);
            return res.status(500).json({ success: false, error: 'Error getting work for student: '+ err.sqlMessage, code: err.code});
        } else {
            return res.status(200).json({ success: true, data: data });
        }
    })
}





module.exports = {getWorkByStudent, getWorksAndMarksByStudentAndGroup, getWorskByGroup, getWorksByStudentAndSubject, getActiveWorksByTeacherId, getWorksByStudentId, getWorskBySubject, deleteWork, getWorksByStudentAndGroup, getWorksByTeacherId, insertWork, editWork};