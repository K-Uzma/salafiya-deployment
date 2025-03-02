const mysql = require("mysql2/promise");

//for local
const pool = mysql.createPool({
  host: "byhrkgo8wmzugrxr4xvi-mysql.services.clever-cloud.com",
  user: "usnukubpjknulnzr",
  password: "02zD0OQ7TUsF2ockAlLc",
  database: "byhrkgo8wmzugrxr4xvi",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: "utc",
});

pool
  .getConnection()
  .then((connection) => {
    console.log("Connected to MySQL database!");
    connection.release();
  })
  .catch((error) => {
    console.error("Error connecting to MySQL database:", error.message);
  });

module.exports = pool;
