const nodemailer = require("nodemailer");
require("dotenv").config();

// Konfigurasi transporter menggunakan OAuth2
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.GMAIL_USER, // Gunakan variabel lingkungan untuk user
    clientId: process.env.GOOGLE_CLIENT_ID, // Gunakan variabel lingkungan untuk clientId
    clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Gunakan variabel lingkungan untuk clientSecret
    refreshToken: process.env.GOOGLE_CLIENT_REFRESH_TOKEN, // Gunakan variabel lingkungan untuk refreshToken
  },
});

// Fungsi untuk mengirim email verifikasi
const sendVerificationEmail = (email, verificationCode) => {
  const mailOptions = {
    from: "perpustakaanundip2@gmail.com",
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
