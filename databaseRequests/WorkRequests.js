const connection = require('./databaseInfo');



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


function getWorksByStudentId(req,res) {
    const sql = "SELECT DISTINCT w.worklabID, w.title, w.labgroupNameFK, w.description, w.initialdate, "+
                "w.finaldate, w.percentage, m.mark, m.comment "+
                "FROM worklabs w " +
                "JOIN labgroups g ON w.labgroupnameFK = g.name "+
                "JOIN enrolled e ON g.idlabgroup = e.labgroupfk "+
                "JOIN students s ON e.studentfk = s.studentsID "+
                "JOIN marks m ON w.worklabID = m.worklabIDFk "+
                "WHERE s.studentsId=? and s.studentsId = m.studentIDFK";
    const params = [req.body.studentId];
    connection.query(sql, params,(err, data) =>{
        if(err){
            console.log(err);
            return res.status(500).json({ success: false, error: 'Error getting work for student: '+ err.sqlMessage});
        } else {
            return res.status(200).json({ success: true, data: data });
        }
    })
}





module.exports = {getWorkByStudent, getWorksByStudentId, deleteWork, getWorksByTeacherId, insertWork, editWork};