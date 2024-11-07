const timeSlotsModel = require("../models/ruangan/timeSlotModel");

// Get time slots by room ID
exports.getTimeSlotsByRoomId = (req, res) => {
  const { room_id } = req.body;

  if (!room_id) {
    return res.status(400).json({ message: "Room ID diperlukan." });
  }

  timeSlotsModel.getSlotByRoomId(room_id, (err, slots) => {
    if (err) {
      console.error("Error retrieving time slots:", err);
      return res.status(500).json({ message: "Gagal mengambil slot waktu." });
    }

    if (slots.length === 0) {
      return res
        .status(404)
        .json({ message: "Tidak ada slot waktu ditemukan untuk room ID ini." });
    }

    res.status(200).json({
      message: "Slot waktu berhasil ditemukan.",
      data: slots,
    });
  });
};

// Get specific time slot
exports.getSpecificTimeSlot = (req, res) => {
  const { date, time, room_id } = req.body;

  // Validasi input
  if (!date || !time || !room_id) {
    return res.status(400).json({
      message: "Date, time, dan room ID diperlukan.",
    });
  }

  timeSlotsModel.getSpecificTimeSlot(date, time, room_id, (err, slot) => {
    if (err) {
      console.error("Error retrieving specific time slot:", err);
      if (err.message === "Slot waktu tidak ditemukan") {
        return res.status(404).json({ message: err.message });
      }
      return res
        .status(500)
        .json({ message: "Gagal mengambil detail slot waktu." });
    }

    res.status(200).json({
      message: "Detail slot waktu berhasil ditemukan.",
      data: slot,
    });
  });
};

// Update single time slot
exports.updateTimeSlot = (req, res) => {
  const { date, time, room_id, status, borrower, role } = req.body;

  // Validasi input
  if (!date || !time || !room_id || !status || !borrower || !role) {
    return res.status(400).json({
      message:
        "Semua field (date, time, room_id, status, borrower, role) diperlukan.",
    });
  }

  // Validasi status
  const validStatus = ["available", "booked", "holiday"];
  if (!validStatus.includes(status)) {
    return res.status(400).json({
      message:
        "Status tidak valid. Status harus 'available', 'booked', atau 'holiday'.",
    });
  }

  const updateData = { status, borrower, role };

  timeSlotsModel.updateTimeSlot(
    date,
    time,
    room_id,
    updateData,
    (err, result) => {
      if (err) {
        console.error("Error updating time slot:", err);
        if (err.message === "Slot waktu tidak ditemukan") {
          return res.status(404).json({ message: err.message });
        }
        return res
          .status(500)
          .json({ message: "Gagal mengupdate slot waktu." });
      }

      res.status(200).json({
        message: "Slot waktu berhasil diupdate.",
        data: result,
      });
    }
  );
};

// Update multiple time slots
exports.updateMultipleTimeSlots = (req, res) => {
  const { slots, updateData } = req.body;

  // Validasi input
  if (!Array.isArray(slots) || slots.length === 0) {
    return res.status(400).json({
      message: "Array slots diperlukan dan tidak boleh kosong.",
    });
  }

  if (
    !updateData ||
    !updateData.status ||
    !updateData.borrower ||
    !updateData.role
  ) {
    return res.status(400).json({
      message: "Update data (status, borrower, role) diperlukan.",
    });
  }

  // Validasi status
  const validStatus = ["available", "booked", "holiday"];
  if (!validStatus.includes(updateData.status)) {
    return res.status(400).json({
      message:
        "Status tidak valid. Status harus 'available', 'booked', atau 'holiday'.",
    });
  }

  // Validasi format setiap slot
  for (const slot of slots) {
    if (!slot.date || !slot.time || !slot.roomId) {
      return res.status(400).json({
        message: "Setiap slot harus memiliki date, time, dan roomId.",
      });
    }
  }

  // Cek ketersediaan slot terlebih dahulu
  timeSlotsModel.checkSlotsAvailability(slots, (err, availabilityResult) => {
    if (err) {
      console.error("Error checking slots availability:", err);
      return res.status(500).json({
        message: "Gagal memeriksa ketersediaan slot.",
      });
    }

    if (!availabilityResult.available) {
      return res.status(409).json({
        message: "Beberapa slot tidak tersedia.",
        conflictingSlots: availabilityResult.conflictingSlots,
      });
    }

    // Jika semua slot tersedia, lakukan update
    timeSlotsModel.updateMultipleTimeSlots(
      slots,
      updateData,
      (updateErr, updateResult) => {
        if (updateErr) {
          console.error("Error updating multiple time slots:", updateErr);
          return res.status(500).json({
            message: "Gagal mengupdate slot waktu.",
          });
        }

        res.status(200).json({
          message: "Semua slot waktu berhasil diupdate.",
          data: updateResult,
        });
      }
    );
  });
};

// Endpoint untuk validasi ketersediaan slot
exports.checkAvailability = (req, res) => {
  const { slots } = req.body;

  // Validasi input
  if (!Array.isArray(slots) || slots.length === 0) {
    return res.status(400).json({
      message: "Array slots diperlukan dan tidak boleh kosong.",
    });
  }

  // Validasi format setiap slot
  for (const slot of slots) {
    if (!slot.date || !slot.time || !slot.roomId) {
      return res.status(400).json({
        message: "Setiap slot harus memiliki date, time, dan roomId.",
      });
    }
  }

  timeSlotsModel.checkSlotsAvailability(slots, (err, result) => {
    if (err) {
      console.error("Error checking slots availability:", err);
      return res.status(500).json({
        message: "Gagal memeriksa ketersediaan slot.",
      });
    }

    res.status(200).json({
      message: result.available
        ? "Semua slot tersedia."
        : "Beberapa slot tidak tersedia.",
      available: result.available,
      conflictingSlots: result.conflictingSlots,
    });
  });
};

exports.getTimeSlotsByBorrowerEmail = (req, res) => {
  const { email } = req.body;

  // Validasi input email
  if (!email) {
    return res.status(400).json({ message: "Email diperlukan." });
  }

  // Memanggil model untuk mendapatkan slot waktu berdasarkan email borrower
  timeSlotsModel.getSlotsByBorrowerEmail(email, (err, slots) => {
    if (err) {
      console.error("Error retrieving time slots by email:", err);
      return res.status(500).json({ message: "Gagal mengambil slot waktu." });
    }

    if (slots.length === 0) {
      return res.status(404).json({
        message: "Tidak ada slot waktu yang ditemukan untuk email ini.",
      });
    }

    res.status(200).json({
      message: "Slot waktu berhasil ditemukan.",
      data: slots,
    });
  });
};

exports.resetTimeSlot = (req, res) => {
  const { date, time, roomId } = req.body;

  // Validasi input
  if (!date || !time || !roomId) {
    return res.status(400).json({
      message: "Date, time, dan room ID diperlukan.",
    });
  }

  // Menggunakan model untuk mereset slot waktu
  timeSlotsModel.resetTimeSlot(date, time, roomId, (err, result) => {
    if (err) {
      console.error("Error resetting time slot:", err);
      return res.status(500).json({
        message: err.message || "Gagal mereset slot waktu.",
      });
    }

    res.status(200).json({
      message: result.message,
      affectedRows: result.affectedRows,
    });
  });
};

exports.resetMultipleTimeSlots = async (req, res) => {
  const { slotIds } = req.body; // Mengambil slotIds yang dikirim dari frontend

  // Validasi bahwa slotIds adalah array
  if (!slotIds || !Array.isArray(slotIds)) {
    return res.status(400).json({ message: "slotIds harus berupa array" });
  }

  try {
    // Mengupdate status atau menghapus time slots berdasarkan id dan waktu
    const result = await timeSlotsModel.resetMultipleTimeSlots(slotIds);

    // Mengecek apakah ada yang berhasil di-reset
    if (result.totalReset === 0) {
      return res.status(404).json({
        message: "Tidak ada slot yang ditemukan untuk diupdate",
      });
    }

    return res.status(200).json({
      message: "Slot waktu yang belum lewat berhasil di-reset",
      totalReset: result.totalReset,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

module.exports = exports;
