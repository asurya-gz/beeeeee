const userModel = require("../models/users/userModel");

// Fungsi untuk menangani pembuatan pengguna baru
exports.createUser = (req, res) => {
  const { email, password, role } = req.body;

  // Validasi input
  if (!email || !password || !role) {
    return res
      .status(400)
      .json({ message: "Email, password, dan role diperlukan" });
  }

  // Panggil model untuk membuat pengguna baru
  userModel.createUser(email, password, role, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Gagal membuat pengguna", error: err });
    }

    res.status(201).json({
      message: "Pengguna berhasil dibuat",
      userId: result.insertId, // ID pengguna yang baru dibuat
    });
  });
};

exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  // Validasi input
  if (!email || !password) {
    return res.status(400).json({ message: "Email dan password diperlukan." });
  }

  // Panggil model untuk login pengguna
  userModel.loginUser(email, password, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Terjadi kesalahan pada server.", error: err });
    }

    if (!result.success) {
      return res.status(401).json({ message: result.message });
    }

    // Mengembalikan data pengguna yang berhasil login
    res.status(200).json({
      message: "Login berhasil.",
      user: result.user,
    });
  });
};
