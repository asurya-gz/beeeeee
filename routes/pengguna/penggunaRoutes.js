const express = require("express");
const router = express.Router();
const penggunaController = require("../../controllers/penggunaController");

// Rute untuk membuat pengguna baru
router.post("/register-pengguna", penggunaController.createPengguna);
router.post("/verifikasi-pengguna", penggunaController.verifyUser);
router.post("/pengguna-by-email", penggunaController.getPenggunaByEmail);
router.put("/edit-pengguna-by-email", penggunaController.editPenggunaByEmail); 

module.exports = router;
