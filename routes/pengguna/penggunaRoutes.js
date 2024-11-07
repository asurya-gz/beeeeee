const express = require("express");
const router = express.Router();
const penggunaController = require("../../controllers/penggunaController");

// Rute untuk membuat pengguna baru
router.post("/register-pengguna", penggunaController.createPengguna);

// Rute untuk verifikasi pengguna
router.post("/verifikasi-pengguna", penggunaController.verifyUser);

// Rute untuk mendapatkan pengguna berdasarkan email
router.post("/pengguna-by-email", penggunaController.getPenggunaByEmail);

// Rute untuk mengedit pengguna berdasarkan email
router.put("/edit-pengguna-by-email", penggunaController.editPenggunaByEmail);

// Rute untuk mendapatkan semua pengguna
router.get("/all-pengguna", penggunaController.getAllPengguna);

module.exports = router;
