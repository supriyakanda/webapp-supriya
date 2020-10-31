const mysql = require('mysql2');
const dbConfig = {
  host: 'mysql-14612-0.cloudclusters.net', // MYSQL HOST NAME
  user: 'root', // MYSQL USERNAME
  password: 'Root@123', // MYSQL PASSWORD
  database: 'supriya_webapp', // MYSQL DB NAME
  port: 14612 // MYSQL DB PORT
};

const dbConnection = mysql.createPool(dbConfig).promise();
module.exports = dbConnection;