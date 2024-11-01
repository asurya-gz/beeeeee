// File: models/users/userModel.js
const db = require("../../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // Tambahkan JWT untuk token

exports.createUser = (email, password, role, callback) => {
  // Pertama cek apakah email sudah ada
  const checkEmailQuery = "SELECT * FROM users WHERE email = ?";
  db.query(checkEmailQuery, [email], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return callback(err, null);
    }

    if (results.length > 0) {
      return callback(new Error("Email sudah terdaftar"), null);
    }

    // Hash password sebelum disimpan ke database
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error("Password hashing error:", err);
        return callback(err, null);
      }

      const query =
        "INSERT INTO users (email, password, role) VALUES (?, ?, ?)";
      const values = [email.toLowerCase(), hashedPassword, role];

      db.query(query, values, (err, result) => {
        if (err) {
          console.error("Insert user error:", err);
          return callback(err, null);
        }
        callback(null, result);
      });
    });
  });
};

exports.loginUser = (email, password, callback) => {
  console.log("Login attempt for:", email);

  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email.toLowerCase()], (err, results) => {
    if (err) {
      console.error("Database error during login:", err);
      return callback(err, null);
    }

    if (results.length === 0) {
      console.log("No user found with email:", email);
      return callback(null, {
        success: false,
        message: "Email atau password salah.",
      });
    }

    const user = results[0];
    console.log("User found, comparing passwords");

    // Bandingkan password
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error("Password comparison error:", err);
        return callback(err, null);
      }

      if (!isMatch) {
        console.log("Password does not match for user:", email);
        return callback(null, {
          success: false,
          message: "Email atau password salah.",
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: "24h" }
      );

      // Remove password from user object
      const userWithoutPassword = { ...user };
      delete userWithoutPassword.password;

      console.log("Login successful for user:", email);
      callback(null, {
        success: true,
        user: userWithoutPassword,
        token,
      });
    });
  });
};

exports.verifyPassword = (email, password, callback) => {
  const query = "SELECT password FROM users WHERE email = ?";
  const values = [email.toLowerCase()];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Database query error:", err);
      return callback(err, null);
    }

    // Cek apakah email ditemukan
    if (result.length === 0) {
      return callback(new Error("Email tidak ditemukan"), null);
    }

    const hashedPassword = result[0].password;

    // Bandingkan password yang diberikan dengan hashed password
    bcrypt.compare(password, hashedPassword, (err, isMatch) => {
      if (err) {
        console.error("Password comparison error:", err);
        return callback(err, null);
      }

      // Kembalikan hasil perbandingan
      callback(null, isMatch);
    });
  });
};

exports.changePassword = (email, newPassword, callback) => {
  // Hash password baru sebelum disimpan ke database
  bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
    if (err) {
      console.error("Password hashing error:", err);
      return callback(err, null);
    }

    const query = "UPDATE users SET password = ? WHERE email = ?";
    const values = [hashedPassword, email.toLowerCase()];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Update password error:", err);
        return callback(err, null);
      }

      if (result.affectedRows === 0) {
        return callback(new Error("Email tidak ditemukan"), null);
      }

      callback(null, {
        success: true,
        message: "Password berhasil diubah",
      });
    });
  });
};
