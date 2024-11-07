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

exports.getPenggunaByEmail = (email, callback) => {
  const query = "SELECT * FROM pengguna WHERE email = ?";
  const values = [email];

  db.query(query, values, (err, result) => {
    if (err) {
      return callback(err, null);
    }
    if (result.length > 0) {
      callback(null, result[0]); // Mengembalikan data pengguna pertama yang ditemukan
    } else {
      callback(null, null); // Jika tidak ada data pengguna dengan email tersebut
    }
  });
};

// Fungsi untuk mengedit pengguna berdasarkan email
exports.editPenggunaByEmail = (email, updatedData, callback) => {
  // Membangun query SQL untuk memperbarui data pengguna
  const query = `
    UPDATE pengguna 
    SET name = ?, nim_nip = ?, role = ? 
    WHERE email = ?
  `;

  // Ambil nilai dari updatedData
  const values = [
    updatedData.name,
    updatedData.nim_nip,
    updatedData.role,
    email,
  ];

  // Jalankan query
  db.query(query, values, (err, result) => {
    if (err) {
      return callback(err, null);
    }

    // Cek apakah ada baris yang terpengaruh
    if (result.affectedRows === 0) {
      return callback(new Error("Email tidak ditemukan"), null);
    }

    // Kembalikan hasil
    callback(null, {
      success: true,
      message: "Pengguna berhasil diperbarui",
    });
  });
};

// Fungsi untuk mendapatkan semua pengguna
exports.getAllPengguna = (callback) => {
  const query = "SELECT * FROM pengguna";

  db.query(query, (err, result) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, result); // Mengembalikan semua data pengguna
  });
};
