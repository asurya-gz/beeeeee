const express = require("express");
const cors = require("cors");
const app = express();
const port = 4000;
const authRoutes = require("./routes/auth/authRoutes");
const penggunaRoutes = require("./routes/pengguna/penggunaRoutes");

// Middleware untuk mengizinkan CORS
app.use(cors());

// Middleware untuk parsing JSON
app.use(express.json());

// Gunakan rute autentikasi
app.use("/api", authRoutes);
app.use("/api", penggunaRoutes);

// Jalankan server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
