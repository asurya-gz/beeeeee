const express = require("express");
const cors = require("cors");
const app = express();
const port = 4000;
const authRoutes = require("./routes/auth/authRoutes");
const penggunaRoutes = require("./routes/pengguna/penggunaRoutes");

// Opsi CORS untuk mengizinkan hanya localhost:3000
const corsOptions = {
  origin: "https://perpus-undip.up.railway.app", // Izinkan hanya dari localhost:3000
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Metode yang diizinkan
  credentials: true, // Izinkan cookies
  optionsSuccessStatus: 200, // Untuk beberapa versi lama browsers
};

// Middleware untuk mengizinkan CORS
app.use(cors(corsOptions));

// Middleware untuk parsing JSON
app.use(express.json());

// Gunakan rute autentikasi
app.use("/api", authRoutes);
app.use("/api", penggunaRoutes);

// Jalankan server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
