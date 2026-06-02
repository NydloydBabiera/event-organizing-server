const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
const taskController = require("../controller/taskController");

router.post("/createTask", authMiddleware, taskController.createTask);
router.get("/:id", authMiddleware, taskController.getTaskByEvent);
router.put(
  "/updateStatus/:id",
  authMiddleware,
  taskController.updateTaskStatus,
);
router.put("/updateTask/:id", authMiddleware, taskController.updateTask);
router.delete("/:id", authMiddleware, taskController.deleteTask);

module.exports = router;
