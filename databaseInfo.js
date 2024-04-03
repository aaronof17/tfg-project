var mysql = require('mysql');

var connection = mysql.createConnection({
    host:"localhost",
    user: "root",
    password:"27.SQLAa",
    database:"tfgdb"
})

module.exports = connection;