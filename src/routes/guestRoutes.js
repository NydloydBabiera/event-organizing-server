const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
const guestController = require("../controller/guestController");

router.post("/createGuest", authMiddleware, guestController.addGuest);
router.get("/:eventId", authMiddleware, guestController.getGuestsByEvent);
router.put("/:id", authMiddleware, guestController.updateGuest);
router.delete("/:id", authMiddleware, guestController.deleteGuest);

module.exports = router;
