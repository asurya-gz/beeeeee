const mysql = require("mysql2");
require("dotenv").config();

// Buat koneksi ke database lokal
// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });

// Buat koneksi database online
// Buat pool koneksi ke database online
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10, // Sesuaikan limit koneksi
  queueLimit: 0,
});

// Hubungkan ke database
db.connect((err) => {
  if (err) {
    console.error("Koneksi ke database gagal:", err);
  } else {
    console.log("Koneksi ke database berhasil.");
  }
});

module.exports = db;
