const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
const userController = require("../controller/userController");

//
// REGISTER
//
router.post("/register", authMiddleware, userController.registerUser);

//
// LOGIN
//
router.post("/login", userController.loginUser);

//
// GET ALL USERS
//
router.get("/", authMiddleware, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

//
// GET USER BY ID
//
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(req.params.id),
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

//
// UPDATE USER
//
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { name, email } = req.body;

    const updatedUser = await prisma.user.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        name,
        email,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

//
// DELETE USER
//
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await prisma.user.delete({
      where: {
        id: Number(req.params.id),
      },
    });

    res.json({
      message: "User deleted",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

module.exports = router;
