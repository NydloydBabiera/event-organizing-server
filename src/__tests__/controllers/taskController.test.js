const prisma = require('../../prisma');
const taskController = require('../../controller/taskController');

describe('Task Controller', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      body: {},
      params: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe('createTask', () => {
    it('should create a task successfully', async () => {
      const taskData = {
        name: 'Book Venue',
        description: 'Contact and book the event venue',
        event_id: 1,
      };

      const mockTask = {
        task_id: 1,
        name: 'Book Venue',
        description: 'Contact and book the event venue',
        event_id: 1,
        isDone: false,
      };

      req.body = taskData;
      prisma.tasks.create.mockResolvedValue(mockTask);

      await taskController.createTask(req, res);

      expect(prisma.tasks.create).toHaveBeenCalledWith({
        data: {
          name: taskData.name,
          description: taskData.description,
          event_id: taskData.event_id,
          isDone: false,
        },
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Task added',
        task: mockTask,
      });
    });

    it('should handle errors when creating a task', async () => {
      const taskData = {
        name: 'Book Venue',
        description: 'Contact and book the event venue',
        event_id: 1,
      };

      const errorMessage = 'Database error';
      req.body = taskData;
      prisma.tasks.create.mockRejectedValue(new Error(errorMessage));

      await taskController.createTask(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: errorMessage,
      });
    });
  });

  describe('getTaskByEvent', () => {
    it('should retrieve all tasks for an event', async () => {
      const eventId = 1;
      const mockTasks = [
        {
          task_id: 1,
          name: 'Task 1',
          description: 'Description 1',
          event_id: eventId,
          isDone: false,
        },
        {
          task_id: 2,
          name: 'Task 2',
          description: 'Description 2',
          event_id: eventId,
          isDone: true,
        },
      ];

      req.params = { id: eventId };
      prisma.tasks.findMany.mockResolvedValue(mockTasks);

      await taskController.getTaskByEvent(req, res);

      expect(prisma.tasks.findMany).toHaveBeenCalledWith({
        where: {
          event_id: eventId,
        },
      });

      expect(res.json).toHaveBeenCalledWith(mockTasks);
    });

    it('should return empty array if no tasks found', async () => {
      const eventId = 1;
      req.params = { id: eventId };
      prisma.tasks.findMany.mockResolvedValue([]);

      await taskController.getTaskByEvent(req, res);

      expect(res.json).toHaveBeenCalledWith([]);
    });

    it('should handle errors when retrieving tasks', async () => {
      const errorMessage = 'Failed to fetch tasks';
      req.params = { id: 1 };
      prisma.tasks.findMany.mockRejectedValue(new Error(errorMessage));

      await taskController.getTaskByEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: errorMessage,
      });
    });
  });

  describe('updateTaskStatus', () => {
    it('should update task status successfully', async () => {
      const taskId = 1;
      const updateData = {
        status: true,
      };

      const mockUpdatedTask = {
        task_id: taskId,
        name: 'Book Venue',
        description: 'Contact and book the event venue',
        event_id: 1,
        isDone: true,
      };

      req.params = { id: taskId };
      req.body = updateData;
      prisma.tasks.update.mockResolvedValue(mockUpdatedTask);

      await taskController.updateTaskStatus(req, res);

      expect(prisma.tasks.update).toHaveBeenCalledWith({
        where: { task_id: taskId },
        data: {
          isDone: updateData.status,
        },
      });

      expect(res.json).toHaveBeenCalledWith({
        message: 'Status updated',
        taskStatus: mockUpdatedTask,
      });
    });

    it('should handle errors when updating task status', async () => {
      const errorMessage = 'Task not found';
      req.params = { id: 999 };
      req.body = { status: true };
      prisma.tasks.update.mockRejectedValue(new Error(errorMessage));

      await taskController.updateTaskStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: errorMessage,
      });
    });
  });

  describe('updateTask', () => {
    it('should update a task successfully', async () => {
      const taskId = 1;
      const updateData = {
        name: 'Updated Task',
        description: 'Updated description',
        event_id: 1,
        status: true,
      };

      req.params = { id: taskId };
      req.body = updateData;
      prisma.tasks.update.mockResolvedValue({ ...updateData, task_id: taskId });

      await taskController.updateTask(req, res);

      expect(prisma.tasks.update).toHaveBeenCalledWith({
        where: { task_id: taskId },
        data: {
          name: updateData.name,
          description: updateData.description,
          event_id: updateData.event_id,
          isDone: updateData.status,
        },
      });

      expect(res.json).toHaveBeenCalledWith({
        message: 'Task updated',
        status: updateData.status,
      });
    });

    it('should handle errors when updating a task', async () => {
      const errorMessage = 'Task not found';
      req.params = { id: 999 };
      req.body = {
        name: 'Updated Task',
        description: 'Updated description',
        event_id: 1,
        status: true,
      };
      prisma.tasks.update.mockRejectedValue(new Error(errorMessage));

      await taskController.updateTask(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: errorMessage,
      });
    });
  });

  describe('deleteTask', () => {
    it('should delete a task successfully', async () => {
      const taskId = 1;
      req.params = { id: taskId };
      prisma.tasks.delete.mockResolvedValue({ task_id: taskId });

      await taskController.deleteTask(req, res);

      expect(prisma.tasks.delete).toHaveBeenCalledWith({
        where: { task_id: taskId },
      });

      expect(res.json).toHaveBeenCalledWith({
        message: 'Event deleted',
      });
    });

    it('should handle errors when deleting a task', async () => {
      const errorMessage = 'Task not found';
      req.params = { id: 999 };
      prisma.tasks.delete.mockRejectedValue(new Error(errorMessage));

      await taskController.deleteTask(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: errorMessage,
      });
    });
  });
});
