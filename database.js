const mysql = require('mysql2');
const dbConfig = {
  host: 'localhost', // MYSQL HOST NAME
  user: 'root', // MYSQL USERNAME
  password: 'Root@123', // MYSQL PASSWORD
  database: 'webapp_supriya' // MYSQL DB NAME
};

const dbConnection = mysql.createPool(dbConfig).promise();
module.exports = dbConnection;