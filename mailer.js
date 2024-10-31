const nodemailer = require("nodemailer");

// Konfigurasi transporter menggunakan OAuth2
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: "perpustakaanundip2@gmail.com",
    clientId:
      "173110143507-8mk0frbms9aropgvomc8tpadba67c5l1.apps.googleusercontent.com",
    clientSecret: "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",
    refreshToken:
      "1//04DCQSHvfqAR1CgYIARAAGAQSNwF-L9IrzRGQ__UKn1JDaZgCN7xUPp3u_xBdFz6pd9ki8O2CkV580l6l61V6onrHXtH4oQiqd6Y",
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
