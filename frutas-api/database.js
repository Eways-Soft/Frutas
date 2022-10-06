const mysql = require('mysql');

/*const db_connect = mysql.createConnection({
  host: "localhost",
  user: "ewayswork_fbasket",
  password: "ewayswork_fbasket",
  database: 'ewayswork_fbasket'
});*/

const db_connect = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: 'fruits_basket'
});

db_connect.connect(function(err) {
    if (!err) {
        console.log('Database is Connected Succesfully !');
    } else {
        console.log("error 32432434");
    }
});

module.exports = db_connect;

