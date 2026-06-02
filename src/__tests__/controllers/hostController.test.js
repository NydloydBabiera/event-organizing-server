const prisma = require('../../prisma');
const hostController = require('../../controller/hostController');

describe('Host Controller', () => {
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

  describe('addHost', () => {
    it('should add a host successfully', async () => {
      const hostData = {
        name: 'Grand Hotel',
        address: '123 Main Street',
        contact_details: '555-1234',
      };

      const mockHost = {
        host_id: 1,
        name: 'Grand Hotel',
        address: '123 Main Street',
        contact_details: '555-1234',
      };

      req.body = hostData;
      prisma.host.findUnique.mockResolvedValue(null); // Host doesn't exist
      prisma.host.create.mockResolvedValue(mockHost);

      await hostController.addHost(req, res);

      expect(prisma.host.findUnique).toHaveBeenCalledWith({
        where: {
          name: hostData.name,
        },
      });

      expect(prisma.host.create).toHaveBeenCalledWith({
        data: {
          name: hostData.name,
          address: hostData.address,
          contact_details: hostData.contact_details,
        },
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Host created',
        host: mockHost,
      });
    });

    it('should return error if host with same name already exists', async () => {
      const hostData = {
        name: 'Grand Hotel',
        address: '123 Main Street',
        contact_details: '555-1234',
      };

      const existingHost = {
        host_id: 1,
        name: 'Grand Hotel',
        address: '123 Main Street',
        contact_details: '555-1234',
      };

      req.body = hostData;
      prisma.host.findUnique.mockResolvedValue(existingHost);

      await hostController.addHost(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Host with this name already exists',
      });
      expect(prisma.host.create).not.toHaveBeenCalled();
    });

    it('should handle errors when adding a host', async () => {
      const hostData = {
        name: 'Grand Hotel',
        address: '123 Main Street',
        contact_details: '555-1234',
      };

      const errorMessage = 'Database error';
      req.body = hostData;
      prisma.host.findUnique.mockRejectedValue(new Error(errorMessage));

      await hostController.addHost(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error creating host',
        error: errorMessage,
      });
    });
  });

  describe('getHosts', () => {
    it('should retrieve all hosts successfully', async () => {
      const mockHosts = [
        {
          host_id: 1,
          name: 'Grand Hotel',
          address: '123 Main Street',
          contact_details: '555-1234',
        },
        {
          host_id: 2,
          name: 'Convention Center',
          address: '456 Oak Avenue',
          contact_details: '555-5678',
        },
      ];

      prisma.host.findMany.mockResolvedValue(mockHosts);

      await hostController.getHosts(req, res);

      expect(prisma.host.findMany).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Hosts retrieved',
        hosts: mockHosts,
      });
    });

    it('should return empty array if no hosts found', async () => {
      prisma.host.findMany.mockResolvedValue([]);

      await hostController.getHosts(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Hosts retrieved',
        hosts: [],
      });
    });

    it('should handle errors when retrieving hosts', async () => {
      const errorMessage = 'Failed to fetch hosts';
      prisma.host.findMany.mockRejectedValue(new Error(errorMessage));

      await hostController.getHosts(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error retrieving hosts',
        error: errorMessage,
      });
    });
  });
});
