# Unit Testing Documentation

This project uses **Jest** for unit testing with mocked dependencies. The testing suite includes basic and mock testing for controllers and middleware.

## Testing Setup

### Installed Dependencies
- **jest**: Testing framework
- **@types/jest**: TypeScript types for Jest
- **jest-mock-extended**: Extended mocking utilities
- **supertest**: HTTP assertion library for API testing

### Project Structure

```
src/
├── __tests__/
│   ├── controllers/
│   │   ├── eventController.test.js
│   │   ├── userController.test.js
│   │   ├── taskController.test.js
│   │   ├── guestController.test.js
│   │   └── hostController.test.js
│   └── middleware/
│       └── authMiddleware.test.js
├── controller/
├── middleware/
└── routes/

jest.config.js          # Jest configuration
jest.setup.js          # Global setup with mocks
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode (auto-rerun on file changes)
```bash
npm run test:watch
```

### Run tests with verbose output
```bash
npm run test:verbose
```

## Mocking Strategy

### Prisma Database Mocking
All Prisma client calls are globally mocked in `jest.setup.js`:
- `prisma.event.*`
- `prisma.user.*`
- `prisma.host.*`
- `prisma.guest.*`
- `prisma.task.*` / `prisma.tasks.*`

Each model supports: `create()`, `findMany()`, `findUnique()`, `update()`, `delete()`

**Example:**
```javascript
prisma.event.create.mockResolvedValue(mockEvent);
prisma.event.findMany.mockRejectedValue(new Error('Error'));
```

### External Library Mocking
- **bcryptjs**: Mocked for password hashing tests
- **jsonwebtoken**: Mocked for JWT token tests
- **dotenv**: Mocked for environment variables

**Example:**
```javascript
jest.mock('bcryptjs');
bcrypt.hash.mockResolvedValue('hashed_password');
bcrypt.compare.mockResolvedValue(true);
```

## Test Structure

Each test file follows this pattern:

```javascript
describe('Controller/Middleware Name', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock state before each test
    
    // Initialize mock request/response
    req = { body: {}, params: {}, headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe('functionName', () => {
    it('should handle success case', async () => {
      // Setup mocks
      prisma.model.action.mockResolvedValue(mockData);
      
      // Execute function
      await controller.functionName(req, res);
      
      // Assertions
      expect(prisma.model.action).toHaveBeenCalledWith(...);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should handle error case', async () => {
      // Setup error mock
      prisma.model.action.mockRejectedValue(new Error('Error'));
      
      // Execute and assert
      await controller.functionName(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
```

## Test Coverage

The current test suite covers:

### Event Controller
- ✅ Create event (success & error)
- ✅ Get all events (success & error)
- ✅ Get events by host (success & error)
- ✅ Update event (success & error)
- ✅ Delete event (success & error)

### User Controller
- ✅ Register user (success, duplicate email, error)
- ✅ Login user (success, invalid credentials, error)

### Task Controller
- ✅ Create task (success & error)
- ✅ Get tasks by event (success, empty, error)
- ✅ Update task status (success & error)
- ✅ Update task (success & error)
- ✅ Delete task (success & error)

### Guest Controller
- ✅ Add guest (success & error)
- ✅ Get guests by event (success, empty, error)
- ✅ Update guest (success & error)
- ✅ Delete guest (success & error)

### Host Controller
- ✅ Add host (success, duplicate name, error)
- ✅ Get all hosts (success, empty, error)

### Auth Middleware
- ✅ No token provided
- ✅ Missing authorization header
- ✅ Valid token verification
- ✅ Invalid token
- ✅ Token extraction from header
- ✅ Expired token

## Best Practices

1. **Clear Mocks**: Always call `jest.clearAllMocks()` in `beforeEach()`
2. **Mock Request/Response**: Properly mock req and res objects with necessary properties
3. **Test Both Success & Error**: Each function should have tests for both success and failure paths
4. **Assertions**: Verify both the function behavior and Prisma/external library calls
5. **Descriptive Test Names**: Use clear descriptions of what is being tested

## Adding New Tests

1. Create a new test file in `src/__tests__/controllers/` or `src/__tests__/middleware/`
2. Follow the existing test structure
3. Mock Prisma and external dependencies
4. Write tests for success and error cases
5. Run tests: `npm test`

## Troubleshooting

### Tests not running?
```bash
npm install  # Reinstall dependencies
npm test     # Run tests
```

### Mock not working?
- Ensure the mock is set in `jest.setup.js` or at the top of your test file
- Verify `jest.mock()` is called before imports
- Clear mocks between tests with `jest.clearAllMocks()`

### Specific test failing?
```bash
npm run test:verbose  # Shows detailed output
npm run test:watch    # Watch mode for debugging
```

## Next Steps

For more comprehensive testing, consider adding:
- Integration tests with actual database
- E2E tests with supertest
- Performance tests
- Load testing
