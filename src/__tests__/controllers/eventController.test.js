const prisma = require('../../prisma');
const eventController = require('../../controller/eventController');

describe('Event Controller', () => {
  let req, res;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Mock request and response objects
    req = {
      body: {},
      params: {},
      headers: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe('createEvent', () => {
    it('should create an event successfully', async () => {
      const eventData = {
        name: 'Summer Concert',
        venue: 'Central Park',
        dateSchedule: '2026-06-15T10:00:00Z',
        user_id: 1,
      };

      const mockEvent = {
        event_id: 1,
        name: 'Summer Concert',
        venue: 'Central Park',
        date_schedule: new Date('2026-06-15T10:00:00Z').toISOString(),
        user_id: 1,
      };

      req.body = eventData;
      prisma.event.create.mockResolvedValue(mockEvent);

      await eventController.createEvent(req, res);

      expect(prisma.event.create).toHaveBeenCalledWith({
        data: {
          name: eventData.name,
          venue: eventData.venue,
          date_schedule: new Date(eventData.dateSchedule).toISOString(),
          user_id: eventData.user_id,
        },
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Event created',
        event: mockEvent,
      });
    });

    it('should handle errors when creating an event', async () => {
      const eventData = {
        name: 'Summer Concert',
        venue: 'Central Park',
        dateSchedule: '2026-06-15T10:00:00Z',
        user_id: 1,
      };

      const errorMessage = 'Database error';
      req.body = eventData;
      prisma.event.create.mockRejectedValue(new Error(errorMessage));

      await eventController.createEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: errorMessage,
      });
    });
  });

  describe('getEvents', () => {
    it('should retrieve all events', async () => {
      const mockEvents = [
        {
          event_id: 1,
          name: 'Event 1',
          venue: 'Venue 1',
          date_schedule: new Date().toISOString(),
          user_id: 1,
        },
        {
          event_id: 2,
          name: 'Event 2',
          venue: 'Venue 2',
          date_schedule: new Date().toISOString(),
          user_id: 2,
        },
      ];

      prisma.event.findMany.mockResolvedValue(mockEvents);

      await eventController.getEvents(req, res);

      expect(prisma.event.findMany).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockEvents);
    });

    it('should handle errors when retrieving events', async () => {
      const errorMessage = 'Failed to fetch events';
      prisma.event.findMany.mockRejectedValue(new Error(errorMessage));

      await eventController.getEvents(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: errorMessage,
      });
    });
  });

  describe('getEventByHost', () => {
    it('should retrieve events by host id', async () => {
      const hostId = 1;
      const mockEvents = [
        {
          event_id: 1,
          name: 'Host Event 1',
          venue: 'Venue 1',
          date_schedule: new Date().toISOString(),
          user_id: hostId,
        },
      ];

      req.params = { id: hostId };
      prisma.event.findMany.mockResolvedValue(mockEvents);

      await eventController.getEventByHost(req, res);

      expect(prisma.event.findMany).toHaveBeenCalledWith({
        where: {
          user_id: hostId,
        },
      });

      expect(res.json).toHaveBeenCalledWith(mockEvents);
    });

    it('should handle errors when retrieving events by host', async () => {
      const errorMessage = 'Host not found';
      req.params = { id: 1 };
      prisma.event.findMany.mockRejectedValue(new Error(errorMessage));

      await eventController.getEventByHost(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: errorMessage,
      });
    });
  });

  describe('updateEvent', () => {
    it('should update an event successfully', async () => {
      const eventId = 1;
      const updateData = {
        name: 'Updated Event',
        venue: 'New Venue',
        dateSchedule: '2026-07-20T14:30:00Z',
        user_id: 1,
      };

      const mockUpdatedEvent = {
        event_id: eventId,
        name: 'Updated Event',
        venue: 'New Venue',
        date_schedule: new Date(updateData.dateSchedule).toISOString(),
        user_id: 1,
      };

      req.params = { id: eventId };
      req.body = updateData;
      prisma.event.update.mockResolvedValue(mockUpdatedEvent);

      await eventController.updateEvent(req, res);

      expect(prisma.event.update).toHaveBeenCalledWith({
        where: { event_id: eventId },
        data: {
          name: updateData.name,
          venue: updateData.venue,
          date_schedule: new Date(updateData.dateSchedule).toISOString(),
          user_id: updateData.user_id,
        },
      });

      expect(res.json).toHaveBeenCalledWith({
        message: 'Event updated',
        event: mockUpdatedEvent,
      });
    });

    it('should handle errors when updating an event', async () => {
      const errorMessage = 'Event not found';
      req.params = { id: 999 };
      req.body = {
        name: 'Updated Event',
        venue: 'New Venue',
        dateSchedule: '2026-07-20T14:30:00Z',
        user_id: 1,
      };
      prisma.event.update.mockRejectedValue(new Error(errorMessage));

      await eventController.updateEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: errorMessage,
      });
    });
  });

  describe('deleteEvent', () => {
    it('should delete an event successfully', async () => {
      const eventId = 1;
      req.params = { id: eventId };
      prisma.event.delete.mockResolvedValue({ event_id: eventId });

      await eventController.deleteEvent(req, res);

      expect(prisma.event.delete).toHaveBeenCalledWith({
        where: { event_id: eventId },
      });

      expect(res.json).toHaveBeenCalledWith({
        message: 'Event deleted',
      });
    });

    it('should handle errors when deleting an event', async () => {
      const errorMessage = 'Event not found';
      req.params = { id: 999 };
      prisma.event.delete.mockRejectedValue(new Error(errorMessage));

      await eventController.deleteEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: errorMessage,
      });
    });
  });
});
