const db = require("mysql");

const mysql = db.createConnection({
  host: "localhost",
  user: "root",
  //   password: "yes",
  database: "HMS",
});

mysql.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + mysql.threadId);
});

module.exports = mysql;
