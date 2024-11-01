// File: controllers/userController.js
const userModel = require("../models/users/userModel");

exports.createUser = (req, res) => {
  const { email, password, role } = req.body;

  // Validasi input
  if (!email || !password || !role) {
    return res
      .status(400)
      .json({ message: "Email, password, dan role diperlukan" });
  }

  // Validasi format email
  if (!email.endsWith(".undip.ac.id")) {
    return res
      .status(400)
      .json({ message: "Hanya email UNDIP yang diperbolehkan" });
  }

  // Validasi password
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password harus minimal 6 karakter" });
  }

  // Panggil model untuk membuat pengguna baru
  userModel.createUser(email, password, role, (err, result) => {
    if (err) {
      console.error("Error creating user:", err);

      if (err.message === "Email sudah terdaftar") {
        return res.status(400).json({ message: err.message });
      }

      return res
        .status(500)
        .json({ message: "Gagal membuat pengguna", error: err.message });
    }

    res.status(201).json({
      message: "Pengguna berhasil dibuat",
      userId: result.insertId,
    });
  });
};

exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  console.log("Password yang diinput", password);

  // Validasi input
  if (!email || !password) {
    return res.status(400).json({ message: "Email dan password diperlukan." });
  }

  // Panggil model untuk login pengguna
  userModel.loginUser(email, password, (err, result) => {
    if (err) {
      console.error("Server error during login:", err);
      return res.status(500).json({
        message: "Terjadi kesalahan pada server.",
        error: err.message,
      });
    }

    if (!result.success) {
      return res.status(401).json({ message: result.message });
    }

    // Mengembalikan data pengguna yang berhasil login
    res.status(200).json({
      message: "Login berhasil.",
      user: result.user,
      token: result.token,
    });
  });
};

exports.changePassword = (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  // Validasi input
  if (!email || !oldPassword || !newPassword) {
    return res
      .status(400)
      .json({
        message: "Email, kata sandi lama, dan kata sandi baru diperlukan.",
      });
  }

  // Validasi password
  if (newPassword.length < 6) {
    return res
      .status(400)
      .json({ message: "Kata sandi baru harus minimal 6 karakter." });
  }

  // Panggil model untuk memverifikasi kata sandi lama
  userModel.verifyPassword(email, oldPassword, (err, isMatch) => {
    if (err) {
      console.error("Error verifying old password:", err);
      return res
        .status(500)
        .json({
          message: "Terjadi kesalahan saat memverifikasi kata sandi lama.",
          error: err.message,
        });
    }

    if (!isMatch) {
      return res.status(401).json({ message: "Kata sandi lama tidak cocok." });
    }

    // Panggil model untuk mengubah kata sandi
    userModel.changePassword(email, newPassword, (err, result) => {
      if (err) {
        console.error("Error changing password:", err);

        if (err.message === "Email tidak ditemukan") {
          return res.status(404).json({ message: err.message });
        }

        return res
          .status(500)
          .json({ message: "Gagal mengubah kata sandi", error: err.message });
      }

      res.status(200).json({
        message: result.message,
      });
    });
  });
};

// Tambahkan route untuk memeriksa status autentikasi
exports.checkAuth = (req, res) => {
  // Middleware JWT akan menangani verifikasi token
  res.status(200).json({
    message: "Token valid",
    user: req.user,
  });
};
