# Style Guide

This document outlines the coding standards, conventions, and best practices for the UnBirthday project.

## 📋 Table of Contents

- [Overview](#overview)
- [TypeScript Standards](#typescript-standards)
- [React Component Guidelines](#react-component-guidelines)
- [Styled Components Conventions](#styled-components-conventions)
- [File Organization](#file-organization)
- [Firebase Integration Patterns](#firebase-integration-patterns)
- [Code Quality](#code-quality)
- [Development Workflow](#development-workflow)

## Overview

UnBirthday is a React + TypeScript application built with:
- **Framework**: React 19.1.1 with TypeScript
- **Styling**: Styled Components
- **Backend**: Firebase (Firestore)
- **Build Tool**: Vite
- **Linting**: ESLint with TypeScript rules
- **Package Manager**: npm

## TypeScript Standards

### Type Definitions
- Use explicit types for function parameters and return values
- Prefer `interface` for object shapes, `type` for unions/intersections
- Use generic types when appropriate for reusability

```typescript
// ✅ Good
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

type Status = 'pending' | 'completed' | 'failed';

// ❌ Avoid
const user = {
  id: "123",
  name: "John",
  email: "john@example.com"
}; // implicit any
```

### Strict Type Checking
- Enable strict mode in `tsconfig.json`
- Avoid `any` types - use `unknown` when type is uncertain
- Use type assertions sparingly and with proper type guards

```typescript
// ✅ Good
function processData(data: unknown): string {
  if (typeof data === 'string') {
    return data.toUpperCase();
  }
  throw new Error('Invalid data type');
}

// ❌ Avoid
function processData(data: any): string {
  return data.toUpperCase();
}
```

## React Component Guidelines

### Component Structure
- Use functional components with hooks
- Implement components as arrow functions for consistency
- Export components as default when they're the main component

```tsx
// ✅ Good
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ children, onClick, variant = 'primary' }) => {
  return (
    <StyledButton variant={variant} onClick={onClick}>
      {children}
    </StyledButton>
  );
};

export default Button;
```

### Props and State
- Define prop interfaces above the component
- Use destructuring for props
- Provide default values where appropriate
- Use `React.ReactNode` for children

### Hooks Usage
- Follow Rules of Hooks
- Use custom hooks for reusable logic
- Prefer `useCallback` and `useMemo` for performance optimization

```tsx
// ✅ Good - Custom hook
const useFirebaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Firebase auth logic
  }, []);

  return { user, loading };
};
```

## Styled Components Conventions

### Component Naming
- Prefix styled components with `Styled`
- Use PascalCase for component names
- Keep styling close to the component that uses it

```tsx
// ✅ Good
const StyledButton = styled.button<{ variant: string }>`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;

  ${({ variant }) => variant === 'primary' && css`
    background-color: #007acc;
    color: white;
  `}

  ${({ variant }) => variant === 'secondary' && css`
    background-color: transparent;
    color: #007acc;
    border: 2px solid #007acc;
  `}
`;
```

### Theme and Design Tokens
- Use a consistent theme object for colors, spacing, typography
- Define design tokens in a central theme file
- Use theme values instead of hardcoded values

```tsx
// theme.ts
export const theme = {
  colors: {
    primary: '#007acc',
    secondary: '#6c757d',
    success: '#28a745',
    danger: '#dc3545',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
};

// ✅ Good - Using theme
const StyledCard = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.background};
`;
```

## File Organization

### Folder Structure
```
src/
├── components/          # Reusable UI components
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   └── index.ts
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── services/           # API and external services
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── firebase/           # Firebase configuration and services
└── assets/             # Static assets
```

### File Naming Conventions
- Use PascalCase for component files: `UserProfile.tsx`
- Use camelCase for utility files: `formatDate.ts`
- Use kebab-case for configuration files: `eslint.config.js`
- Include appropriate file extensions: `.tsx` for JSX, `.ts` for TypeScript

### Import/Export Patterns
- Use absolute imports from `src/`
- Group imports: external libraries, internal modules, relative imports
- Use named exports for utilities, default exports for components

```tsx
// ✅ Good import order
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';

import { Button } from 'src/components/Button';
import { formatDate } from 'src/utils/date';

import './Component.css';
```

## Firebase Integration Patterns

### Service Organization
- Separate Firebase services into logical modules
- Use consistent error handling patterns
- Implement proper TypeScript types for Firestore documents

```typescript
// firebase/services/userService.ts
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export const userService = {
  async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    try {
      const userId = crypto.randomUUID();
      const user: User = {
        ...userData,
        id: userId,
        createdAt: new Date(),
      };

      await setDoc(doc(db, 'users', userId), user);
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  },

  async getUser(id: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', id));
      return userDoc.exists() ? userDoc.data() as User : null;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw new Error('Failed to fetch user');
    }
  },
};
```

### Error Handling
- Implement consistent error handling across Firebase operations
- Use custom error types for different failure scenarios
- Provide meaningful error messages to users

## Code Quality

### Linting and Formatting
- Follow ESLint configuration with TypeScript rules
- Use Prettier for consistent code formatting
- Run linting checks before commits

### Testing
- Write unit tests for utility functions
- Use React Testing Library for component testing
- Test Firebase integrations with mocks

### Performance
- Use `React.memo` for expensive components
- Implement lazy loading for routes and large components
- Optimize Firebase queries with proper indexing

## Development Workflow

### Git Conventions
- Use conventional commit messages
- Create feature branches for new development
- Use pull requests for code review

### Environment Setup
- Use environment variables for Firebase configuration
- Keep sensitive data in `.env.local` (not committed)
- Document required environment variables

### Build and Deploy
- Test builds locally before deployment
- Use TypeScript strict checking in CI/CD
- Monitor bundle size and performance metrics

---

## Related Tasks

This style guide is implemented through the following tasks:

- [Task 2: Define TypeScript coding standards](./backlog/tasks/task-2%20-%20Define-TypeScript-coding-standards.md)
- [Task 3: Define React component guidelines](./backlog/tasks/task-3%20-%20Define-React-component-guidelines.md)
- [Task 4: Document styled-components conventions](./backlog/tasks/task-4%20-%20Document-styled-components-conventions.md)
- [Task 5: Establish file organization standards](./backlog/tasks/task-5%20-%20Establish-file-organization-standards.md)
- [Task 6: Document Firebase integration patterns](./backlog/tasks/task-6%20-%20Document-Firebase-integration-patterns.md)

## Contributing

When contributing to this project:
1. Follow the guidelines outlined in this document
2. Update this style guide if introducing new patterns
3. Ensure all code passes linting and type checking
4. Add tests for new functionality

For questions or suggestions about these guidelines, please create an issue or discuss in pull requests.