const db = require("../../db");
const bcrypt = require("bcryptjs");

// Fungsi untuk membuat pengguna baru
exports.createUser = (email, password, role, callback) => {
  // Hash password sebelum disimpan ke database
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return callback(err, null);
    }

    const query = "INSERT INTO users (email, password, role) VALUES (?, ?, ?)";
    const values = [email, hashedPassword, role];

    db.query(query, values, (err, result) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, result);
    });
  });
};

exports.loginUser = (email, password, callback) => {
  const query = "SELECT * FROM users WHERE email = ?";

  db.query(query, [email], (err, results) => {
    if (err) {
      return callback(err, null);
    }

    if (results.length === 0) {
      return callback(null, {
        success: false,
        message: "Email atau password salah.",
      });
    }

    const user = results[0];

    // Bandingkan password yang dimasukkan dengan password yang di-hash di database
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return callback(err, null);
      }
      if (!isMatch) {
        return callback(null, {
          success: false,
          message: "Email atau password salah.",
        });
      }

      // Jika login berhasil
      callback(null, { success: true, user });
    });
  });
};
