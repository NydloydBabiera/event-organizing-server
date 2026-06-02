const prisma = require('../../prisma');
const guestController = require('../../controller/guestController');

describe('Guest Controller', () => {
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

  describe('addGuest', () => {
    it('should add a guest successfully', async () => {
      const guestData = {
        name: 'Alice Smith',
        type: 'VIP',
        event_id: 1,
      };

      const mockGuest = {
        guest_id: 1,
        name: 'Alice Smith',
        type: 'VIP',
        event_id: 1,
      };

      req.body = guestData;
      prisma.guest.create.mockResolvedValue(mockGuest);

      await guestController.addGuest(req, res);

      expect(prisma.guest.create).toHaveBeenCalledWith({
        data: {
          name: guestData.name,
          type: guestData.type,
          event_id: guestData.event_id,
        },
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Guest created',
        guest: mockGuest,
      });
    });

    it('should handle errors when adding a guest', async () => {
      const guestData = {
        name: 'Alice Smith',
        type: 'VIP',
        event_id: 1,
      };

      const errorMessage = 'Database error';
      req.body = guestData;
      prisma.guest.create.mockRejectedValue(new Error(errorMessage));

      await guestController.addGuest(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: errorMessage,
      });
    });
  });

  describe('getGuestsByEvent', () => {
    it('should retrieve all guests for an event', async () => {
      const eventId = 1;
      const mockGuests = [
        {
          guest_id: 1,
          name: 'Guest 1',
          type: 'VIP',
          event_id: eventId,
        },
        {
          guest_id: 2,
          name: 'Guest 2',
          type: 'Regular',
          event_id: eventId,
        },
      ];

      req.params = { eventId };
      prisma.guest.findMany.mockResolvedValue(mockGuests);

      await guestController.getGuestsByEvent(req, res);

      expect(prisma.guest.findMany).toHaveBeenCalledWith({
        where: {
          event_id: eventId,
        },
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Guests fetched successfully',
        guests: mockGuests,
      });
    });

    it('should return empty array if no guests found', async () => {
      const eventId = 1;
      req.params = { eventId };
      prisma.guest.findMany.mockResolvedValue([]);

      await guestController.getGuestsByEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Guests fetched successfully',
        guests: [],
      });
    });

    it('should handle errors when retrieving guests', async () => {
      const errorMessage = 'Failed to fetch guests';
      req.params = { eventId: 1 };
      prisma.guest.findMany.mockRejectedValue(new Error(errorMessage));

      await guestController.getGuestsByEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: errorMessage,
      });
    });
  });

  describe('updateGuest', () => {
    it('should update a guest successfully', async () => {
      const guestId = 1;
      const updateData = {
        name: 'Updated Guest',
        type: 'VIP Plus',
      };

      const mockUpdatedGuest = {
        guest_id: guestId,
        name: 'Updated Guest',
        type: 'VIP Plus',
        event_id: 1,
      };

      req.params = { id: guestId };
      req.body = updateData;
      prisma.guest.update.mockResolvedValue(mockUpdatedGuest);

      await guestController.updateGuest(req, res);

      expect(prisma.guest.update).toHaveBeenCalledWith({
        where: { guest_id: guestId },
        data: {
          name: updateData.name,
          type: updateData.type,
        },
      });

      expect(res.json).toHaveBeenCalledWith({
        message: 'Guest updated',
        guest: mockUpdatedGuest,
      });
    });

    it('should handle errors when updating a guest', async () => {
      const errorMessage = 'Guest not found';
      req.params = { id: 999 };
      req.body = {
        name: 'Updated Guest',
        type: 'VIP',
      };
      prisma.guest.update.mockRejectedValue(new Error(errorMessage));

      await guestController.updateGuest(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: errorMessage,
      });
    });
  });

  describe('deleteGuest', () => {
    it('should delete a guest successfully', async () => {
      const guestId = 1;
      req.params = { id: guestId };
      prisma.guest.delete.mockResolvedValue({ guest_id: guestId });

      await guestController.deleteGuest(req, res);

      expect(prisma.guest.delete).toHaveBeenCalledWith({
        where: { guest_id: guestId },
      });

      expect(res.json).toHaveBeenCalledWith({
        message: 'Guest deleted',
      });
    });

    it('should handle errors when deleting a guest', async () => {
      const errorMessage = 'Guest not found';
      req.params = { id: 999 };
      prisma.guest.delete.mockRejectedValue(new Error(errorMessage));

      await guestController.deleteGuest(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: errorMessage,
      });
    });
  });
});
