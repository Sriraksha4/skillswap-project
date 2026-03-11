const mysql = require("mysql2")

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "skillswap"
})

db.connect((err) => {
  if (err) {
    console.log("Database connection error:", err)
  } else {
    console.log("MySQL Connected")
  }
})

module.exports = db