const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
const userController = require("../controller/userController");

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);


module.exports = router;
