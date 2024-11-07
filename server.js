const express = require("express");
const cors = require("cors");
const app = express();
const port = 4000;
const authRoutes = require("./routes/auth/authRoutes");
const penggunaRoutes = require("./routes/pengguna/penggunaRoutes");
const ruanganRoutes = require("./routes/ruangan/ruanganRoutes");
const timeSlotRoutes = require("./routes/timeSlot/timeSlotRoutes");

// Opsi CORS untuk mengizinkan hanya localhost:3000
const corsOptions = {
  origin: "https://perpus-undip.up.railway.app",
  // origin: "http://localhost:3000",
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
app.use("/api", ruanganRoutes);
app.use("/api", timeSlotRoutes);

// Jalankan server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
