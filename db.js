const mysql = require("mysql2");

// Buat koneksi ke database
const db = mysql.createConnection({
  host: "localhost", // Ganti dengan host database Anda
  user: "root", // Ganti dengan username MySQL Anda
  password: "BismillahKaya123", // Ganti dengan password MySQL Anda
  database: "perpus-undip", // Ganti dengan nama database Anda
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
