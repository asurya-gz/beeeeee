const db = require("../../db");

// Fungsi untuk membuat pengguna baru
exports.createPengguna = (
  name,
  nim_nip,
  email,
  role,
  verificationCode,
  callback
) => {
  const query =
    "INSERT INTO pengguna (name, nim_nip, email, role, verificated, verification_code) VALUES (?, ?, ?, ?, false, ?)";
  const values = [name, nim_nip, email, role, verificationCode];

  db.query(query, values, (err, result) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, result);
  });
};

// Fungsi untuk memeriksa apakah email sudah ada
exports.checkEmailExists = (email, callback) => {
  const query = "SELECT COUNT(*) AS count FROM pengguna WHERE email = ?";
  const values = [email];

  db.query(query, values, (err, result) => {
    if (err) {
      return callback(err, null);
    }
    const exists = result[0].count > 0; // Jika count lebih dari 0, berarti email sudah ada
    callback(null, exists);
  });
};

// Fungsi untuk mengubah kolom verificated menjadi true berdasarkan kode verifikasi
exports.verifyPengguna = (email, verificationCode, callback) => {
  const query =
    "UPDATE pengguna SET verificated = true, verification_code = NULL WHERE email = ? AND verification_code = ?";
  const values = [email, verificationCode];

  db.query(query, values, (err, result) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, result);
  });
};
