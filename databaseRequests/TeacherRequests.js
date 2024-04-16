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


module.exports = {getTeacherToken, getTeachers, updateTeacherToken, getTeacherId};