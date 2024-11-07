const express = require("express");
const router = express.Router();
const timeSlotsController = require("../../controllers/timeSlotController");

// Get time slots by room ID
router.post("/time-slots", timeSlotsController.getTimeSlotsByRoomId);

// Get specific time slot
router.post("/time-slots/specific", timeSlotsController.getSpecificTimeSlot);

// Update single time slot
router.put("/time-slots/update", timeSlotsController.updateTimeSlot);

// Update multiple time slots
router.put(
  "/time-slots/update-multiple",
  timeSlotsController.updateMultipleTimeSlots
);

// Check time slots availability
router.post(
  "/time-slots/check-availability",
  timeSlotsController.checkAvailability
);

// Get time slots by borrower email
router.post(
  "/time-slots/by-email",
  timeSlotsController.getTimeSlotsByBorrowerEmail
);

// Reset single time slot
router.post("/time-slots/reset", timeSlotsController.resetTimeSlot);

// Reset multiple time slots
router.post(
  "/time-slots/reset-multiple",
  timeSlotsController.resetMultipleTimeSlots
);

module.exports = router;
