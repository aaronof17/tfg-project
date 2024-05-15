const connection = require('../databaseInfo');

function insertEnrolled(req,res) {
    const sql = 'INSERT INTO enrolled (studentFK, labgroupFK, repositoryURL) VALUES (?,?,?)';
    const params = [req.body.studentId, req.body.groupId, req.body.repository];
    connection.query(sql, params,(err, data) =>{
        if(err){
            console.log(err);
            return res.status(500).json({ success: false, error: 'Error saving: '+ err.sqlMessage, code: err.code});
        } else {
            return res.status(200).json({ success: true, data: data });
        }
    })
}

module.exports = {insertEnrolled};