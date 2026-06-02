const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
const hostController = require("../controller/hostController");

router.post("/createHost", authMiddleware, hostController.addHost);
router.get("/", authMiddleware, hostController.getHosts);

module.exports = router;
