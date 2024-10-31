const penggunaModel = require("../models/pengguna/penggunaModel");
const crypto = require("crypto");
const { sendVerificationEmail } = require("../mailer");

exports.createPengguna = (req, res) => {
  const { name, nim_nip, email, role } = req.body;

  // Validasi input
  if (!name || !nim_nip || !email || !role) {
    return res
      .status(400)
      .json({ message: "Nama, NIM/NIP, email, dan role diperlukan" });
  }

  // Validasi format email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Email tidak valid." });
  }

  // Periksa keberadaan email
  penggunaModel.checkEmailExists(email, (err, exists) => {
    if (err) {
      return res.status(500).json({ message: "Gagal memeriksa email." });
    }
    if (exists) {
      return res.status(400).json({ message: "Email sudah terdaftar." });
    }

    // Membuat kode verifikasi
    const verificationCode = crypto.randomBytes(3).toString("hex");

    // Panggil model untuk membuat pengguna baru dengan kode verifikasi
    penggunaModel.createPengguna(
      name,
      nim_nip,
      email,
      role,
      verificationCode,
      (err, result) => {
        if (err) {
          console.error("Error creating user:", err);
          return res
            .status(500)
            .json({ message: "Gagal membuat pengguna", error: err });
        }

        // Kirim email verifikasi
        sendVerificationEmail(email, verificationCode)
          .then(() => {
            res.status(201).json({
              message:
                "Pengguna berhasil dibuat, kode verifikasi telah dikirim ke email Anda.",
              userId: result.insertId,
            });
          })
          .catch((error) => {
            console.error("Error sending verification email:", error);
            res
              .status(500)
              .json({ message: "Gagal mengirim email verifikasi." });
          });
      }
    );
  });
};

exports.verifyUser = (req, res) => {
  const { email, verificationCode } = req.body;

  // Validasi input
  if (!email || !verificationCode) {
    return res
      .status(400)
      .json({ message: "Email dan kode verifikasi diperlukan." });
  }

  // Panggil model untuk memverifikasi pengguna
  penggunaModel.verifyPengguna(email, verificationCode, (err, result) => {
    if (err) {
      console.error("Error verifying user:", err);
      return res
        .status(500)
        .json({ message: "Gagal memverifikasi pengguna.", error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "Kode verifikasi tidak valid." });
    }

    res.status(200).json({ message: "Pengguna berhasil diverifikasi." });
  });
};
