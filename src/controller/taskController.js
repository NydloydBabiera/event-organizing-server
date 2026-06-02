const prisma = require("../prisma");

const createTask = async (req, res) => {
  try {
    const { name, description, event_id } = req.body;

    const task = await prisma.tasks.create({
      data: {
        name,
        description,
        event_id,
        isDone: false,
      },
    });

    res.status(200).json({
      message: "Task added",
      task,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const getTaskByEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const tasks = await prisma.tasks.findMany({
      where: {
        event_id: Number(id),
      },
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    console.log("🚀 ~ updateTaskStatus ~ status:", status)
    const taskStatus = await prisma.tasks.update({
      where: { task_id: Number(id) },
      data: {
        isDone: status,
      },
    });
    res.json({
      message: "Status updated",
      taskStatus,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, event_id, status } = req.body;
    const task = await prisma.tasks.update({
      where: { task_id: Number(id) },
      data: {
        name,
        description,
        event_id,
        isDone: status,
      },
    });
    res.json({
      message: "Task updated",
      status,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.tasks.delete({
      where: { task_id: Number(id) },
    });
    res.json({
      message: "Event deleted",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = {
    createTask,
    getTaskByEvent,
    updateTask,
    updateTaskStatus,
    deleteTask
}
