const jwt = require('jsonwebtoken');
const authMiddleware = require('../../middleware/authMiddleware');

jest.mock('jsonwebtoken');
jest.mock('dotenv', () => ({
  config: jest.fn(),
}));

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      headers: {
        authorization: '',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    next = jest.fn();

    process.env.JWT_SECRET = 'test-secret-key';
  });

  it('should return error if no token is provided', () => {
    req.headers.authorization = '';

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'No token provided',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return error if authorization header is missing', () => {
    delete req.headers.authorization;

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'No token provided',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should verify token and call next on success', () => {
    const token = 'valid_token';
    const decodedToken = {
      id: 1,
      email: 'user@example.com',
    };

    req.headers.authorization = `Bearer ${token}`;
    jwt.verify.mockReturnValue(decodedToken);

    authMiddleware(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET);
    expect(req.user).toEqual(decodedToken);
    expect(next).toHaveBeenCalled();
  });

  it('should return error on invalid token', () => {
    const token = 'invalid_token';
    req.headers.authorization = `Bearer ${token}`;
    jwt.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Invalid token',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should extract token correctly from Authorization header', () => {
    const token = 'valid_token_123';
    const decodedToken = {
      id: 2,
      email: 'admin@example.com',
    };

    req.headers.authorization = `Bearer ${token}`;
    jwt.verify.mockReturnValue(decodedToken);

    authMiddleware(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET);
    expect(req.user).toEqual(decodedToken);
    expect(next).toHaveBeenCalled();
  });

  it('should return error on expired token', () => {
    const token = 'expired_token';
    req.headers.authorization = `Bearer ${token}`;
    jwt.verify.mockImplementation(() => {
      throw new Error('Token expired');
    });

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Invalid token',
    });
    expect(next).not.toHaveBeenCalled();
  });
});
