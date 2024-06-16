var mysql = require('mysql');
require('dotenv').config();

var dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
};

var connection;

function handleDisconnect() {
  connection = mysql.createConnection(dbConfig);

  connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      setTimeout(handleDisconnect, 2000); // Retry connection after 2 seconds
    } else {
      console.log('Connected to the database');
    }
  });

  connection.on('error', function(err) {
    console.error('db error', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect(); // Reconnect if connection is lost
    } else {
      throw err;
    }
  });
}

// Initial call to handleDisconnect to establish the connection
handleDisconnect();

// Keep the connection alive by sending a query periodically
setInterval(function () {
  if (connection && connection.state !== 'disconnected') {
    connection.query('SELECT 1', function (err) {
      if (err) {
        console.error('Error with keep-alive query:', err);
      }
    });
  } else {
    console.log('Connection is in disconnected state, attempting to reconnect.');
    handleDisconnect();
  }
}, 5000); // Ping the server every 5 seconds

module.exports = connection;
