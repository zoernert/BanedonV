# Change Request: Code Quality Refactoring - Service Layer & Architecture Improvements

## Summary
Refactor the current monolithic route handlers into a clean architecture with proper separation of concerns, service layer abstraction, and improved testability to enhance code maintainability and scalability.

## Priority
**High Priority** - Foundation for future development and maintainability

## Background
The current implementation has business logic mixed with HTTP handling in route handlers, making the code difficult to test, maintain, and scale. This refactoring will establish a proper architectural foundation following clean architecture principles.

## Requested Changes

### 1. Implement Service Layer Architecture

#### Create Service Layer Structure
```
src/
├── controllers/          # HTTP request/response handling
│   ├── AuthController.ts
│   ├── UserController.ts
│   ├── CollectionController.ts
│   ├── FileController.ts
│   ├── SearchController.ts
│   ├── BillingController.ts
│   └── BaseController.ts
├── services/            # Business logic
│   ├── AuthService.ts
│   ├── UserService.ts
│   ├── CollectionService.ts
│   ├── FileService.ts
│   ├── SearchService.ts
│   ├── BillingService.ts
│   └── interfaces/
│       ├── IAuthService.ts
│       ├── IUserService.ts
│       └── [other service interfaces]
├── repositories/        # Data access layer
│   ├── interfaces/
│   │   ├── IUserRepository.ts
│   │   ├── ICollectionRepository.ts
│   │   └── IFileRepository.ts
│   └── mock/
│       ├── MockUserRepository.ts
│       ├── MockCollectionRepository.ts
│       └── MockFileRepository.ts
└── domain/             # Domain models and errors
    ├── models/
    │   ├── User.ts
    │   ├── Collection.ts
    │   └── File.ts
    └── errors/
        ├── AuthError.ts
        ├── UserError.ts
        └── ValidationError.ts
```

#### Example Implementation Pattern

**Base Controller** (`src/controllers/BaseController.ts`):
```typescript
export abstract class BaseController {
  protected async executeWithDelay<T>(
    operation: () => Promise<T>,
    res: Response,
    successMessage: string,
    statusCode: number = 200
  ): Promise<void> {
    await ResponseUtil.withDelay(async () => {
      const result = await operation();
      return ResponseUtil.success(res, result, successMessage, statusCode);
    });
  }

  protected handleError(error: Error, next: NextFunction): void {
    if (error instanceof DomainError) {
      next(ErrorMiddleware.createError(error.message, error.statusCode, error.code));
    } else {
      next(error);
    }
  }
}
```

**Service Interface** (`src/services/interfaces/IAuthService.ts`):
```typescript
export interface IAuthService {
  loginUser(email: string, password: string): Promise<LoginResult>;
  registerUser(userData: RegisterUserDto): Promise<RegisterResult>;
  refreshToken(refreshToken: string): Promise<TokenResult>;
  resetPassword(resetToken: string, newPassword: string): Promise<void>;
}

export interface LoginResult {
  user: AuthUser;
  token: string;
  refreshToken: string;
  expiresIn: string;
}
```

**Controller Implementation** (`src/controllers/AuthController.ts`):
```typescript
export class AuthController extends BaseController {
  constructor(private authService: IAuthService) {
    super();
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.executeWithDelay(
        () => this.authService.loginUser(req.body.email, req.body.password),
        res,
        'Login successful'
      );
    } catch (error) {
      this.handleError(error as Error, next);
    }
  }

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.executeWithDelay(
        () => this.authService.registerUser(req.body),
        res,
        'Registration successful',
        201
      );
    } catch (error) {
      this.handleError(error as Error, next);
    }
  }
}
```

### 2. Implement Repository Pattern

#### Repository Interface (`src/repositories/interfaces/IUserRepository.ts`):
```typescript
export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: CreateUserDto): Promise<User>;
  update(id: string, updates: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
  findAll(pagination: PaginationOptions): Promise<PaginatedResult<User>>;
}
```

#### Mock Implementation (`src/repositories/mock/MockUserRepository.ts`):
```typescript
export class MockUserRepository implements IUserRepository {
  private users: User[] = mockUsers.map(u => this.mapToUser(u));

  async findById(id: string): Promise<User | null> {
    return this.users.find(u => u.id === id) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find(u => u.email === email) || null;
  }

  // ... other methods
}
```

### 3. Create Domain Error Classes

#### Base Domain Error (`src/domain/errors/DomainError.ts`):
```typescript
export abstract class DomainError extends Error {
  abstract readonly statusCode: number;
  abstract readonly code: string;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}
```

#### Specific Error Classes (`src/domain/errors/AuthError.ts`):
```typescript
export class AuthError extends DomainError {
  readonly statusCode = 401;

  constructor(public readonly code: string, message: string) {
    super(message);
  }

  static invalidCredentials(): AuthError {
    return new AuthError('INVALID_CREDENTIALS', 'Invalid email or password');
  }

  static tokenExpired(): AuthError {
    return new AuthError('TOKEN_EXPIRED', 'Authentication token has expired');
  }
}
```

### 4. Update Route Registration

#### Route Registration (`src/routes/auth.ts`):
```typescript
// Dependency injection setup (simplified for now)
const userRepository = new MockUserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

router.post('/login', 
  ValidationMiddleware.common.validateUserLogin,
  (req, res, next) => authController.login(req, res, next)
);

router.post('/register',
  ValidationMiddleware.common.validateUserRegistration,
  (req, res, next) => authController.register(req, res, next)
);
```

### 5. Standardize Error Handling

#### Error Code Constants (`src/domain/errors/ErrorCodes.ts`):
```typescript
export const ErrorCodes = {
  AUTH: {
    INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
    TOKEN_EXPIRED: 'TOKEN_EXPIRED',
    USER_NOT_FOUND: 'USER_NOT_FOUND',
    EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS'
  },
  USER: {
    NOT_FOUND: 'USER_NOT_FOUND',
    CANNOT_DELETE_SELF: 'CANNOT_DELETE_SELF',
    INVALID_ROLE: 'INVALID_ROLE'
  },
  VALIDATION: {
    REQUIRED_FIELD: 'REQUIRED_FIELD',
    INVALID_FORMAT: 'INVALID_FORMAT'
  }
} as const;
```

### 6. Enhance Testing Structure

#### Service Tests (`tests/services/AuthService.test.ts`):
```typescript
describe('AuthService', () => {
  let authService: AuthService;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    mockUserRepository = createMockUserRepository();
    authService = new AuthService(mockUserRepository);
  });

  describe('loginUser', () => {
    it('should return user and tokens for valid credentials', async () => {
      // Test pure business logic without HTTP dependencies
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      
      const result = await authService.loginUser('test@example.com', 'password');
      
      expect(result.user.email).toBe('test@example.com');
      expect(result.token).toBeDefined();
    });

    it('should throw AuthError for invalid credentials', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      
      await expect(
        authService.loginUser('test@example.com', 'wrong')
      ).rejects.toThrow(AuthError);
    });
  });
});
```

## Files to Create/Modify

### New Files to Create
1. `src/controllers/BaseController.ts`
2. `src/controllers/AuthController.ts`
3. `src/controllers/UserController.ts`
4. `src/controllers/[other controllers]`
5. `src/services/AuthService.ts`
6. `src/services/UserService.ts`
7. `src/services/interfaces/[all service interfaces]`
8. `src/repositories/interfaces/[all repository interfaces]`
9. `src/repositories/mock/[all mock repositories]`
10. `src/domain/models/[domain models]`
11. `src/domain/errors/[error classes]`

### Files to Modify
1. `src/routes/auth.ts` - Update to use controllers
2. `src/routes/users.ts` - Update to use controllers
3. `src/routes/[all other routes]` - Update to use controllers
4. `src/middleware/auth.ts` - Extract business logic to service
5. `tests/[all test files]` - Update for new architecture

### Files to Remove
- Move business logic from middleware to services
- Clean up redundant code in route handlers

## Implementation Guidelines

### Phase 1: Core Infrastructure (Week 1)
1. Create base controller and domain error classes
2. Implement AuthService and AuthController
3. Update auth routes to use new pattern
4. Ensure all auth tests pass

### Phase 2: Expand Pattern (Week 2)
1. Implement UserService and UserController
2. Create repository interfaces and mock implementations
3. Update user routes and tests

### Phase 3: Complete Migration (Week 3)
1. Migrate remaining services (Collections, Files, Search, Billing)
2. Update all routes to use controller pattern
3. Comprehensive testing of all endpoints

### Phase 4: Polish & Optimization (Week 4)
1. Add dependency injection container (optional)
2. Performance optimization
3. Documentation updates
4. Code review and cleanup

## Success Criteria
- [ ] All existing API functionality preserved
- [ ] All tests pass with improved coverage (>80%)
- [ ] Business logic separated from HTTP handling
- [ ] Consistent error handling across all endpoints
- [ ] Easy to add new features and modify existing ones
- [ ] Mock implementations easily replaceable with real ones

## Testing Requirements
- Unit tests for all services with mocked dependencies
- Controller tests focusing on HTTP handling
- Integration tests for complete request flows
- Maintain backward compatibility of all API endpoints

## Benefits Expected
1. **Maintainability**: Clear separation of concerns makes code easier to understand and modify
2. **Testability**: Business logic can be unit tested without HTTP dependencies
3. **Scalability**: Easy to add new features and replace mock implementations
4. **Code Quality**: Reduced duplication and standardized patterns
5. **Team Productivity**: Clearer structure helps team members contribute more effectively

## Risk Mitigation
- Implement incrementally (auth first, then expand)
- Maintain existing API contracts
- Comprehensive testing at each phase
- Keep rollback plan by preserving current implementation during transition
