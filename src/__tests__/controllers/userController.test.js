const prisma = require('../../prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userController = require('../../controller/userController');

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('User Controller', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      body: {},
      headers: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe('registerUser', () => {
    it('should register a user successfully', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      const mockUser = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashed_password',
      };

      req.body = userData;
      prisma.user.findUnique.mockResolvedValue(null); // User doesn't exist
      bcrypt.hash.mockResolvedValue('hashed_password');
      prisma.user.create.mockResolvedValue(mockUser);

      await userController.registerUser(req, res);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: userData.email },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          name: userData.name,
          email: userData.email,
          password: 'hashed_password',
        },
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User created',
        user: mockUser,
      });
    });

    it('should return error if email already exists', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      const existingUser = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashed_password',
      };

      req.body = userData;
      prisma.user.findUnique.mockResolvedValue(existingUser);

      await userController.registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Email already exists',
      });
    });

    it('should handle registration errors', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      const errorMessage = 'Database error';
      req.body = userData;
      prisma.user.findUnique.mockRejectedValue(new Error(errorMessage));

      await userController.registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: errorMessage,
      });
    });
  });

  describe('loginUser', () => {
    it('should login user successfully', async () => {
      const loginData = {
        email: 'john@example.com',
        password: 'password123',
      };

      const mockUser = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashed_password',
      };

      const mockToken = 'jwt_token_123';

      req.body = loginData;
      prisma.user.findUnique.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue(mockToken);

      await userController.loginUser(req, res);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: loginData.email },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(loginData.password, mockUser.password);
      expect(jwt.sign).toHaveBeenCalledWith(
        {
          id: mockUser.id,
          email: mockUser.email,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '1d',
        }
      );
      expect(res.json).toHaveBeenCalledWith({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        token: mockToken,
      });
    });

    it('should return error if user not found', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      req.body = loginData;
      prisma.user.findUnique.mockResolvedValue(null);

      await userController.loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid credentials',
      });
    });

    it('should return error if password is incorrect', async () => {
      const loginData = {
        email: 'john@example.com',
        password: 'wrongpassword',
      };

      const mockUser = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashed_password',
      };

      req.body = loginData;
      prisma.user.findUnique.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      await userController.loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid credentials',
      });
    });

    it('should handle login errors', async () => {
      const loginData = {
        email: 'john@example.com',
        password: 'password123',
      };

      const errorMessage = 'Database error';
      req.body = loginData;
      prisma.user.findUnique.mockRejectedValue(new Error(errorMessage));

      await userController.loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: errorMessage,
      });
    });
  });
});
