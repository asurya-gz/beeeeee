const nodemailer = require("nodemailer");
require("dotenv").config();

// Konfigurasi transporter menggunakan app password Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER, // Gunakan email Gmail Anda
    pass: process.env.GMAIL_APP_PASSWORD, // Gunakan App Password yang Anda buat di Google
  },
  tls: {
    rejectUnauthorized: false, // Menangani masalah terkait sertifikat
  },
  secure: true, // Gunakan SSL/TLS untuk koneksi yang aman
});

// Fungsi untuk mengirim email verifikasi
const sendVerificationEmail = (email, verificationCode) => {
  const mailOptions = {
    from: process.env.GMAIL_USER, // Gunakan email Gmail Anda
    to: email,
    subject: "Verifikasi Email Anda",
    text: `Selamat! Anda telah berhasil mendaftar. Kode verifikasi Anda adalah: ${verificationCode}. Silakan masukkan kode ini untuk menyelesaikan pendaftaran.`,
  };

  return transporter
    .sendMail(mailOptions)
    .then((info) => {
      console.log("Email sent: " + info.response);
    })
    .catch((error) => {
      console.error("Error sending verification email:", error);
      throw new Error("Gagal mengirim email verifikasi.");
    });
};

module.exports = {
  sendVerificationEmail,
};
