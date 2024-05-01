const connection = require('./databaseInfo');

function getGroupsBySubject(req,res) {
    const sql = 'select name from labgroups where subject=? and teacheridfk=?';
    const params = [req.body.actualSubject, req.body.teacherID];
    connection.query(sql, params,(err, data) =>{
        if(err){
            console.log(err);
            return res.status(500).json({ success: false, error: 'Error getting labgroups for subject: '+ err.sqlMessage, code: err.code});
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
            return res.status(500).json({ success: false, error: 'Error getting labgroups: '+ err.sqlMessage, code: err.code});
        } else {
            return res.status(200).json({ success: true, data: data });
        }
    })
}


function getGroups(req,res) {
    const sql = "SELECT l.name as name, l.idlabGroup as id, l.subject, t.name as teacherName, t.teacherID as teacherID "+
                "FROM labgroups as l JOIN teachers t ON l.teacherIDFK = t.teacherID";
    connection.query(sql, (err, data) =>{
        if(err){
            console.log(err);
            return res.status(500).json({ success: false, error: 'Error getting labgroups: '+ err.sqlMessage, code: err.code});
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
            return res.status(500).json({ success: false, error: 'Error getting labgroups: '+ err.sqlMessage, code: err.code});
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
            return res.status(500).json({ success: false, error: 'Error getting subjects: '+ err.sqlMessage, code: err.code});
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
            return res.status(500).json({ success: false, error: 'Error getting id from group: '+ err.sqlMessage, code: err.code});
        } else {
            return res.status(200).json({ success: true, data: data });
        }
    })
}


function saveLabGroup(req,res) {
    const sql = 'INSERT INTO labgroups (name, subject, teacherIDFK) VALUES (?,?,?)';
    const params = [req.body.name, req.body.subject, req.body.teacherAssigned];
    connection.query(sql, params,(err, data) =>{
        if(err){
            console.log(err);
            return res.status(500).json({ success: false, error: 'Error saving: '+ err.sqlMessage, code: err.code});
        } else {
            return res.status(200).json({ success: true, data: data });
        }
    })
}

function deleteGroup(req,res) {
    const sql = 'delete from labgroups where name = ?';
    const params = [req.body.groupName];
    connection.query(sql, params ,(err, data) =>{
        if(err){
            console.log(err);
            return res.status(500).json({ success: false, error: 'Error deleting lab group: '+ err.sqlMessage, code: err.code});
        } else {
            return res.status(200).json({ success: true, data: data });
        }
    })
}


function editGroup(req,res){
    const sql = "update labgroups set name=?, subject=?, teacherIDFK=? where idlabGroup=?";
    const params = [req.body.name, req.body.subject, req.body.teacherID,
                    req.body.groupID];
    connection.query(sql, params ,(err, data) =>{
        if(err){
            console.log(err);
            return res.status(500).json({ success: false, error: 'Error saving: '+ err.sqlMessage, code: err.code});
        } else {
            return res.status(200).json({ success: true, data: data });
        }
    })
}



module.exports = {getIdFromGroupsByName, editGroup, getGroups, deleteGroup, saveLabGroup, getSubjectsByTeacherId, getGroupsBySubject, getGroupsByTeacherId};