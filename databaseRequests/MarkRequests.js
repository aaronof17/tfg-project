const connection = require('../databaseInfo');


function insertMark(req,res) {
    const sql = 'INSERT INTO marks (mark, comment, studentIDFK, worklabIDFK) VALUES (?,?,?,?)';
    const params = [req.body.mark, req.body.comment, req.body.student,
        req.body.work];
    connection.query(sql, params,(err, data) =>{
        if(err){
            console.log(err);
            return res.status(500).json({ success: false, error: 'Error saving: '+ err.sqlMessage, code: err.code});
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
            return res.status(500).json({ success: false, error: 'Error getting id from marks: '+ err.sqlMessage, code: err.code});
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
            return res.status(500).json({ success: false, error: 'Error saving: '+ err.sqlMessage, code: err.code});
        } else {
            return res.status(200).json({ success: true, data: data });
        }
    })
}


module.exports = {editMark, getMarkByWorkAndStudent, insertMark};