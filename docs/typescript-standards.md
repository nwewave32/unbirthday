# TypeScript Coding Standards

Comprehensive TypeScript coding standards and best practices for the UnBirthday project.

## Table of Contents

- [Type Definitions](#type-definitions)
- [Interface vs Type](#interface-vs-type)
- [Function Typing](#function-typing)
- [Generic Types](#generic-types)
- [Union and Intersection Types](#union-and-intersection-types)
- [Strict Type Checking](#strict-type-checking)
- [Utility Types](#utility-types)
- [Module and Import Patterns](#module-and-import-patterns)
- [Error Handling](#error-handling)
- [Performance Considerations](#performance-considerations)

## Type Definitions

### Basic Types
Always use explicit type annotations for clarity and maintainability.

```typescript
// ✅ Good - Explicit types
const userId: string = 'user-123';
const isActive: boolean = true;
const scores: number[] = [85, 92, 78];

// ❌ Avoid - Implicit types
const userId = 'user-123'; // inferred as string, but less clear
const data = getData(); // return type unclear
```

### Object Types
Define clear interfaces for object structures.

```typescript
// ✅ Good - Clear object typing
interface User {
  readonly id: string;
  name: string;
  email: string;
  age?: number; // Optional property
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
}

// ✅ Good - Index signatures for dynamic properties
interface UserSettings {
  [key: string]: string | number | boolean;
}

// ❌ Avoid - Unclear object types
interface User {
  id: any;
  data: object; // Too generic
}
```

### Array Types
Use consistent array typing patterns.

```typescript
// ✅ Good - Array type syntax
const userIds: string[] = ['id1', 'id2', 'id3'];
const users: User[] = [];

// ✅ Also acceptable - Generic syntax for complex types
const responses: Array<Promise<ApiResponse>> = [];

// ❌ Avoid - Mixed or unclear arrays
const data: any[] = [];
const items = []; // No type information
```

## Interface vs Type

### When to Use Interface
Use `interface` for object shapes that might be extended or implemented.

```typescript
// ✅ Good - Interface for extendable objects
interface BaseUser {
  id: string;
  name: string;
}

interface AdminUser extends BaseUser {
  permissions: string[];
  lastLogin: Date;
}

// ✅ Good - Interface for class contracts
interface Serializable {
  serialize(): string;
  deserialize(data: string): void;
}

class UserData implements Serializable {
  serialize(): string { /* ... */ }
  deserialize(data: string): void { /* ... */ }
}
```

### When to Use Type
Use `type` for unions, intersections, and computed types.

```typescript
// ✅ Good - Type for unions
type Status = 'pending' | 'approved' | 'rejected';
type Theme = 'light' | 'dark' | 'auto';

// ✅ Good - Type for intersections
type UserWithTimestamps = User & {
  createdAt: Date;
  updatedAt: Date;
};

// ✅ Good - Type for computed types
type UserKeys = keyof User;
type PartialUser = Partial<User>;

// ✅ Good - Type for function signatures
type EventHandler<T> = (event: T) => void;
type ApiCall<TRequest, TResponse> = (request: TRequest) => Promise<TResponse>;
```

## Function Typing

### Function Declarations
Always type function parameters and return types.

```typescript
// ✅ Good - Explicit function typing
function calculateTotal(items: OrderItem[], taxRate: number): number {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  return subtotal * (1 + taxRate);
}

// ✅ Good - Arrow function typing
const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

// ✅ Good - Async function typing
async function fetchUser(id: string): Promise<User | null> {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch {
    return null;
  }
}
```

### Function Overloads
Use function overloads for different parameter combinations.

```typescript
// ✅ Good - Function overloads
function createElement(tag: 'button'): HTMLButtonElement;
function createElement(tag: 'div'): HTMLDivElement;
function createElement(tag: string): HTMLElement;
function createElement(tag: string): HTMLElement {
  return document.createElement(tag);
}

// ✅ Good - Generic function with constraints
function deepClone<T extends Record<string, any>>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}
```

## Generic Types

### Basic Generics
Use generics for reusable, type-safe code.

```typescript
// ✅ Good - Generic interfaces
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

interface Repository<T> {
  findById(id: string): Promise<T | null>;
  create(item: Omit<T, 'id'>): Promise<T>;
  update(id: string, updates: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}

// ✅ Good - Generic classes
class Cache<T> {
  private store = new Map<string, T>();

  set(key: string, value: T): void {
    this.store.set(key, value);
  }

  get(key: string): T | undefined {
    return this.store.get(key);
  }

  has(key: string): boolean {
    return this.store.has(key);
  }
}
```

### Generic Constraints
Use constraints to limit generic types appropriately.

```typescript
// ✅ Good - Generic constraints
interface Identifiable {
  id: string;
}

function updateEntity<T extends Identifiable>(
  entity: T,
  updates: Partial<Omit<T, 'id'>>
): T {
  return { ...entity, ...updates };
}

// ✅ Good - Keyof constraints
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// ✅ Good - Multiple constraints
function processItems<T extends Identifiable & { name: string }>(
  items: T[]
): string[] {
  return items.map(item => `${item.id}: ${item.name}`);
}
```

## Union and Intersection Types

### Discriminated Unions
Use discriminated unions for type safety with different object types.

```typescript
// ✅ Good - Discriminated union
interface LoadingState {
  status: 'loading';
}

interface SuccessState {
  status: 'success';
  data: any;
}

interface ErrorState {
  status: 'error';
  error: string;
}

type AsyncState = LoadingState | SuccessState | ErrorState;

// ✅ Good - Type guards with discriminated unions
function handleState(state: AsyncState): string {
  switch (state.status) {
    case 'loading':
      return 'Loading...';
    case 'success':
      return `Data: ${JSON.stringify(state.data)}`;
    case 'error':
      return `Error: ${state.error}`;
    default:
      // TypeScript ensures exhaustiveness
      const _exhaustive: never = state;
      return _exhaustive;
  }
}
```

### Intersection Types
Use intersection types to combine multiple type constraints.

```typescript
// ✅ Good - Intersection types
type Timestamped = {
  createdAt: Date;
  updatedAt: Date;
};

type AuditableUser = User & Timestamped & {
  lastModifiedBy: string;
};

// ✅ Good - Mixin pattern with intersections
type Draggable = {
  drag(): void;
};

type Resizable = {
  resize(width: number, height: number): void;
};

type InteractiveElement = HTMLElement & Draggable & Resizable;
```

## Strict Type Checking

### Avoiding Any
Never use `any` - use specific types or `unknown` when type is uncertain.

```typescript
// ✅ Good - Using unknown with type guards
function processApiResponse(response: unknown): User[] {
  if (Array.isArray(response)) {
    return response.filter((item): item is User =>
      typeof item === 'object' &&
      item !== null &&
      typeof item.id === 'string'
    );
  }
  throw new Error('Invalid response format');
}

// ✅ Good - Type assertions with guards
function isUser(obj: unknown): obj is User {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'name' in obj &&
    typeof (obj as any).id === 'string'
  );
}

// ❌ Avoid - Using any
function processData(data: any): any {
  return data.whatever.works;
}
```

### Null and Undefined Handling
Enable strict null checks and handle nullish values explicitly.

```typescript
// ✅ Good - Explicit null handling
function findUser(id: string): User | null {
  const user = users.find(u => u.id === id);
  return user ?? null;
}

// ✅ Good - Optional chaining and nullish coalescing
const displayName = user?.profile?.displayName ?? user.name ?? 'Anonymous';

// ✅ Good - Type guards for null checks
function isNotNull<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

const validUsers = users.filter(isNotNull);
```

## Utility Types

### Built-in Utility Types
Leverage TypeScript's built-in utility types effectively.

```typescript
// ✅ Good - Using utility types
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

// Partial for updates
type UserUpdate = Partial<User>;

// Pick for specific fields
type UserPublic = Pick<User, 'id' | 'name' | 'email'>;

// Omit for excluding fields
type UserCreate = Omit<User, 'id'>;

// Record for key-value mappings
type UserRoles = Record<string, 'admin' | 'user' | 'guest'>;

// Parameters and ReturnType for function types
type CreateUserParams = Parameters<typeof createUser>;
type CreateUserReturn = ReturnType<typeof createUser>;
```

### Custom Utility Types
Create custom utility types for common patterns.

```typescript
// ✅ Good - Custom utility types
type NonEmptyArray<T> = [T, ...T[]];

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Usage examples
const tags: NonEmptyArray<string> = ['react', 'typescript'];
const partialConfig: DeepPartial<Config> = { api: { timeout: 5000 } };
const userWithRequiredEmail: RequiredFields<User, 'email'> = {
  id: '1',
  name: 'John',
  email: 'john@example.com', // Required
};
```

## Module and Import Patterns

### Export Patterns
Use consistent export patterns for better tree-shaking and imports.

```typescript
// ✅ Good - Named exports for utilities
// utils/validation.ts
export const validateEmail = (email: string): boolean => { /* ... */ };
export const validatePassword = (password: string): boolean => { /* ... */ };

// ✅ Good - Default export for main component/class
// components/UserCard.tsx
export interface UserCardProps {
  user: User;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => { /* ... */ };
export default UserCard;

// ✅ Good - Re-exports for clean API
// components/index.ts
export { default as UserCard } from './UserCard';
export { default as UserList } from './UserList';
export type { UserCardProps } from './UserCard';
```

### Import Patterns
Follow consistent import ordering and grouping.

```typescript
// ✅ Good - Import order
// 1. Node modules
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';

// 2. Internal modules (absolute paths)
import { Button } from 'src/components/Button';
import { userService } from 'src/services/userService';
import { User } from 'src/types/user';

// 3. Relative imports
import './UserCard.css';
```

## Error Handling

### Custom Error Types
Create specific error types for better error handling.

```typescript
// ✅ Good - Custom error types
abstract class AppError extends Error {
  abstract readonly statusCode: number;
  abstract readonly isOperational: boolean;

  constructor(message: string, public readonly context?: Record<string, any>) {
    super(message);
    this.name = this.constructor.name;
  }
}

class ValidationError extends AppError {
  readonly statusCode = 400;
  readonly isOperational = true;
}

class NotFoundError extends AppError {
  readonly statusCode = 404;
  readonly isOperational = true;
}

// ✅ Good - Result type for error handling
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

async function fetchUser(id: string): Promise<Result<User, NotFoundError | ValidationError>> {
  try {
    if (!id) {
      return { success: false, error: new ValidationError('User ID is required') };
    }

    const user = await userService.getById(id);
    if (!user) {
      return { success: false, error: new NotFoundError(`User ${id} not found`) };
    }

    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: error as ValidationError };
  }
}
```

## Performance Considerations

### Type-only Imports
Use type-only imports to avoid runtime dependencies.

```typescript
// ✅ Good - Type-only imports
import type { User } from 'src/types/user';
import type { ComponentProps } from 'react';

// ✅ Good - Mixed imports
import { userService } from 'src/services/userService';
import type { UserServiceOptions } from 'src/services/userService';
```

### Conditional Types for Performance
Use conditional types to optimize type checking.

```typescript
// ✅ Good - Conditional types
type NonNullable<T> = T extends null | undefined ? never : T;

type FlattenArray<T> = T extends (infer U)[] ? U : T;

type ApiEndpoint<T> = T extends 'users'
  ? '/api/users'
  : T extends 'posts'
  ? '/api/posts'
  : never;
```

---

## Related Files
- [Main Style Guide](../STYLE_GUIDE.md)
- [React Component Guidelines](./react-guidelines.md)
- [TSConfig Configuration](../tsconfig.json)

## Enforcement
These standards are enforced through:
- TypeScript compiler with strict mode enabled
- ESLint with TypeScript rules
- Pre-commit hooks for type checking
- Code review guidelines

Remember: TypeScript is about making JavaScript more predictable and maintainable. These standards help achieve that goal while keeping the code readable and performant.