const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
const eventController = require("../controller/eventController");

router.post("/createEvent", authMiddleware, eventController.createEvent);
router.get("/", authMiddleware, eventController.getEvents);
router.get("/:host_id", authMiddleware, eventController.getEventByHost);
router.put("/:id", authMiddleware, eventController.updateEvent);
router.delete("/:id", authMiddleware, eventController.deleteEvent);

module.exports = router;
