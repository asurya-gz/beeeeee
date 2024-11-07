const db = require("../../db");

// Fungsi untuk mendapatkan slot waktu berdasarkan room_id
exports.getSlotByRoomId = (roomId, callback) => {
  const query = "SELECT * FROM time_slots WHERE room_id = ?";
  const values = [roomId];

  db.query(query, values, (err, result) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, result);
  });
};

// Fungsi untuk mengupdate status slot waktu berdasarkan time, date, dan room_id
exports.updateTimeSlot = (date, time, roomId, updateData, callback) => {
  const query = `
    UPDATE time_slots 
    SET 
      status = ?,
      borrower = ?,
      role = ?
    WHERE date = ? AND time = ? AND room_id = ?
  `;

  const values = [
    updateData.status,
    updateData.borrower,
    updateData.role,
    date,
    time,
    roomId,
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      return callback(err, null);
    }

    if (result.affectedRows === 0) {
      return callback({ message: "Slot waktu tidak ditemukan" }, null);
    }

    callback(null, {
      message: "Status slot waktu berhasil diperbarui",
      affectedRows: result.affectedRows,
    });
  });
};

// Fungsi untuk mendapatkan detail slot waktu spesifik
exports.getSpecificTimeSlot = (date, time, roomId, callback) => {
  const query =
    "SELECT * FROM time_slots WHERE date = ? AND time = ? AND room_id = ?";
  const values = [date, time, roomId];

  db.query(query, values, (err, result) => {
    if (err) {
      return callback(err, null);
    }

    if (result.length === 0) {
      return callback({ message: "Slot waktu tidak ditemukan" }, null);
    }

    callback(null, result[0]);
  });
};

// Fungsi untuk mengupdate multiple time slots sekaligus
exports.updateMultipleTimeSlots = (slots, updateData, callback) => {
  // Membuat array untuk menyimpan semua query promises
  const updatePromises = slots.map((slot) => {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE time_slots 
        SET 
          status = ?,
          borrower = ?,
          role = ?
        WHERE date = ? AND time = ? AND room_id = ?
      `;

      const values = [
        updateData.status,
        updateData.borrower,
        updateData.role,
        slot.date,
        slot.time,
        slot.roomId,
      ];

      db.query(query, values, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  });

  // Menjalankan semua update secara parallel
  Promise.all(updatePromises)
    .then((results) => {
      const totalUpdated = results.reduce(
        (sum, result) => sum + result.affectedRows,
        0
      );
      callback(null, {
        message: "Slot waktu berhasil diperbarui",
        totalUpdated: totalUpdated,
      });
    })
    .catch((err) => {
      callback(err, null);
    });
};

// Fungsi untuk memeriksa ketersediaan multiple time slots
exports.checkSlotsAvailability = (slots, callback) => {
  const query = `
    SELECT * FROM time_slots 
    WHERE (date, time, room_id) IN (?) 
    AND status != 'available'
  `;

  // Mengubah array slots menjadi format yang sesuai untuk query IN
  const values = [slots.map((slot) => [slot.date, slot.time, slot.roomId])];

  db.query(query, values, (err, result) => {
    if (err) {
      return callback(err, null);
    }

    if (result.length > 0) {
      // Ada slot yang tidak tersedia
      return callback(null, {
        available: false,
        conflictingSlots: result,
      });
    }

    // Semua slot tersedia
    callback(null, {
      available: true,
      conflictingSlots: [],
    });
  });
};

exports.getSlotsByBorrowerEmail = (email, callback) => {
  const query = "SELECT * FROM time_slots WHERE borrower = ?";
  const values = [email];

  db.query(query, values, (err, result) => {
    if (err) {
      return callback(err, null); // Jika ada error, kirimkan error tersebut
    }

    // Jika query berhasil dijalankan, kirimkan hasilnya (bisa kosong)
    callback(null, result || []); // Jika tidak ada slot ditemukan, kirimkan array kosong
  });
};

exports.resetTimeSlot = (date, time, roomId, callback) => {
  const query = `
    UPDATE time_slots 
    SET 
      status = 'available',
      borrower = NULL,
      role = NULL
    WHERE date = ? AND time = ? AND room_id = ?
  `;

  const values = [date, time, roomId];

  db.query(query, values, (err, result) => {
    if (err) {
      return callback(err, null);
    }

    if (result.affectedRows === 0) {
      return callback({ message: "Slot waktu tidak ditemukan" }, null);
    }

    callback(null, {
      message: "Slot waktu berhasil direset menjadi available",
      affectedRows: result.affectedRows,
    });
  });
};

exports.resetMultipleTimeSlots = (slotIds) => {
  // Memeriksa apakah slotIds adalah array yang valid
  if (!Array.isArray(slotIds)) {
    throw new Error("slotIds harus berupa array");
  }

  return new Promise((resolve, reject) => {
    // Query untuk mereset slot yang belum lewat
    const query = `
      UPDATE time_slots 
      SET 
        status = 'available',
        borrower = NULL,
        role = NULL
      WHERE id IN (?) 
      AND CONCAT(date, ' ', time) > NOW()
    `;

    const values = [slotIds];

    db.query(query, values, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          message: "Slot yang belum lewat berhasil direset menjadi available",
          totalReset: result.affectedRows,
        });
      }
    });
  });
};
