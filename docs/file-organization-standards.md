# File Organization Standards

Comprehensive file and folder organization standards for the UnBirthday project to maintain consistency, scalability, and developer experience.

## Table of Contents

- [Project Structure Overview](#project-structure-overview)
- [Folder Naming Conventions](#folder-naming-conventions)
- [File Naming Conventions](#file-naming-conventions)
- [Import and Export Patterns](#import-and-export-patterns)
- [Component Organization](#component-organization)
- [Service and Utility Organization](#service-and-utility-organization)
- [Asset Management](#asset-management)
- [Configuration Files](#configuration-files)
- [Documentation Structure](#documentation-structure)
- [Testing Organization](#testing-organization)

## Project Structure Overview

### Root Level Structure
```
unbirthday/
├── .claude/                     # Claude Code configuration and commands
│   ├── commands/               # Custom Claude commands
│   └── settings.local.json     # Local Claude settings
├── .github/                    # GitHub workflows and templates
├── .vscode/                    # VS Code workspace settings
├── backlog/                    # Project backlog management
│   ├── tasks/                  # Individual task files
│   ├── docs/                   # Project documentation
│   └── decisions/              # Architectural decision records
├── docs/                       # Development documentation
│   ├── typescript-standards.md
│   ├── react-guidelines.md
│   ├── styled-components-conventions.md
│   ├── file-organization-standards.md
│   └── firebase-integration-patterns.md
├── public/                     # Static public assets
├── src/                        # Application source code
│   ├── components/             # Reusable UI components
│   ├── pages/                  # Page-level components
│   ├── hooks/                  # Custom React hooks
│   ├── services/               # API and external services
│   ├── utils/                  # Utility functions
│   ├── types/                  # TypeScript type definitions
│   ├── constants/              # Application constants
│   ├── contexts/               # React contexts
│   ├── firebase/               # Firebase configuration and services
│   ├── theme/                  # Styled-components theme
│   ├── assets/                 # Static assets (images, icons, etc.)
│   └── __tests__/              # Global test utilities and setup
├── STYLE_GUIDE.md              # Project style guide
├── README.md                   # Project documentation
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── tsconfig.app.json           # App-specific TypeScript config
├── tsconfig.node.json          # Node-specific TypeScript config
├── vite.config.ts              # Vite build configuration
├── eslint.config.js            # ESLint configuration
└── .env.example                # Environment variables template
```

### Source Code Structure (`src/`)
```
src/
├── components/                 # Reusable UI components
│   ├── common/                 # Basic, foundational components
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Modal/
│   │   └── index.ts
│   ├── forms/                  # Form-specific components
│   │   ├── UserForm/
│   │   ├── ContactForm/
│   │   └── index.ts
│   ├── layout/                 # Layout components
│   │   ├── Header/
│   │   ├── Footer/
│   │   ├── Sidebar/
│   │   └── index.ts
│   └── index.ts                # Main components export
├── pages/                      # Page-level components
│   ├── HomePage/
│   ├── UserDashboard/
│   ├── UserProfile/
│   └── index.ts
├── hooks/                      # Custom React hooks
│   ├── useApi.ts
│   ├── useLocalStorage.ts
│   ├── useAuth.ts
│   └── index.ts
├── services/                   # External service integrations
│   ├── api/
│   │   ├── userService.ts
│   │   ├── authService.ts
│   │   └── index.ts
│   ├── firebase/
│   │   ├── firestore.ts
│   │   ├── auth.ts
│   │   └── index.ts
│   └── index.ts
├── utils/                      # Utility functions
│   ├── validation/
│   │   ├── emailValidation.ts
│   │   ├── passwordValidation.ts
│   │   └── index.ts
│   ├── formatters/
│   │   ├── dateFormatter.ts
│   │   ├── currencyFormatter.ts
│   │   └── index.ts
│   ├── helpers/
│   │   ├── arrayHelpers.ts
│   │   ├── stringHelpers.ts
│   │   └── index.ts
│   └── index.ts
├── types/                      # TypeScript type definitions
│   ├── api.ts
│   ├── user.ts
│   ├── common.ts
│   └── index.ts
├── constants/                  # Application constants
│   ├── apiEndpoints.ts
│   ├── errorMessages.ts
│   ├── routes.ts
│   └── index.ts
├── contexts/                   # React contexts
│   ├── AuthContext.tsx
│   ├── ThemeContext.tsx
│   └── index.ts
├── firebase/                   # Firebase configuration
│   ├── config.ts
│   ├── services.ts
│   └── index.ts
├── theme/                      # Styled-components theme
│   ├── theme.ts
│   ├── globalStyles.ts
│   ├── mixins.ts
│   └── index.ts
├── assets/                     # Static assets
│   ├── images/
│   ├── icons/
│   ├── fonts/
│   └── index.ts
└── __tests__/                  # Test utilities
    ├── setup.ts
    ├── mocks/
    └── utils/
```

## Folder Naming Conventions

### General Rules
- Use **kebab-case** for folder names containing multiple words
- Use **camelCase** for single-concept folders
- Use **PascalCase** for component folders
- Keep folder names descriptive but concise

```
✅ Good folder names:
components/
user-profile/
api-endpoints/
styled-components/
test-utils/

❌ Avoid:
Components/           # Should be lowercase
user_profile/         # Use kebab-case, not snake_case
userprofile/          # Missing separation
API_ENDPOINTS/        # Should be kebab-case
```

### Specific Folder Types

#### Component Folders
Use **PascalCase** for component folders to match component names.

```
✅ Good:
components/
├── Button/
├── UserCard/
├── NavigationMenu/
└── ApiStatusIndicator/

❌ Avoid:
components/
├── button/           # Should be PascalCase
├── userCard/         # Should be PascalCase
├── navigation-menu/  # Should be PascalCase
```

#### Feature Folders
Use **kebab-case** for feature-based organization.

```
✅ Good:
features/
├── user-management/
├── order-processing/
├── inventory-tracking/
└── payment-gateway/
```

#### Utility Folders
Use **camelCase** or **kebab-case** for utility folders.

```
✅ Good:
utils/
├── validation/
├── formatters/
├── api-helpers/
└── date-utils/
```

## File Naming Conventions

### General Principles
- Use consistent casing based on file type
- Include meaningful descriptors
- Follow platform conventions

### File Naming by Type

#### React Components
Use **PascalCase** for component files.

```
✅ Good:
Button.tsx
UserCard.tsx
NavigationMenu.tsx
ApiStatusIndicator.tsx

❌ Avoid:
button.tsx           # Should be PascalCase
userCard.jsx         # Use .tsx for TypeScript
user-card.tsx        # Should be PascalCase
```

#### TypeScript Files (Non-Components)
Use **camelCase** for utilities, services, and other TypeScript files.

```
✅ Good:
userService.ts
dateFormatter.ts
apiClient.ts
validationHelpers.ts

❌ Avoid:
UserService.ts       # Should be camelCase for non-components
date_formatter.ts    # Use camelCase, not snake_case
api-client.ts        # Use camelCase, not kebab-case
```

#### Type Definition Files
Use **camelCase** with descriptive names.

```
✅ Good:
types/
├── user.ts
├── apiResponse.ts
├── commonTypes.ts
└── formValidation.ts

❌ Avoid:
types/
├── User.ts          # Should be camelCase
├── api_response.ts  # Use camelCase
├── common.ts        # Be more descriptive
```

#### Test Files
Use the same casing as the file being tested with `.test.` or `.spec.` suffix.

```
✅ Good:
Button.test.tsx
userService.test.ts
dateFormatter.spec.ts
apiClient.test.ts

❌ Avoid:
button.test.tsx      # Should match component casing
UserService.test.ts  # Should match service casing
test-button.tsx      # Use suffix, not prefix
```

#### Configuration Files
Use **kebab-case** for configuration files.

```
✅ Good:
eslint.config.js
vite.config.ts
tsconfig.json
package.json

❌ Avoid:
eslintConfig.js      # Use kebab-case
viteConfig.ts        # Use kebab-case
```

#### Documentation Files
Use **kebab-case** for documentation files.

```
✅ Good:
README.md
STYLE_GUIDE.md
contributing-guidelines.md
deployment-guide.md

❌ Avoid:
readme.md           # Use uppercase for important docs
styleGuide.md       # Use kebab-case
CONTRIBUTING.md     # Use kebab-case for detailed docs
```

## Import and Export Patterns

### Import Organization
Follow consistent import ordering and grouping.

```typescript
// ✅ Good - Import order
// 1. Node modules (React, third-party libraries)
import React, { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import styled from 'styled-components';
import { format } from 'date-fns';

// 2. Internal modules (absolute imports from src/)
import { Button } from 'src/components/common';
import { userService } from 'src/services/api';
import { User, ApiResponse } from 'src/types';
import { validateEmail } from 'src/utils/validation';

// 3. Relative imports
import { UserCardProps } from './UserCard.types';
import './UserCard.css';

// ❌ Avoid - Mixed import order
import { Button } from 'src/components/common';
import React from 'react';
import './UserCard.css';
import { userService } from 'src/services/api';
```

### Export Patterns

#### Named Exports for Utilities
Use named exports for utility functions and services.

```typescript
// ✅ Good - userService.ts
export const userService = {
  async getById(id: string): Promise<User> { /* ... */ },
  async create(userData: UserData): Promise<User> { /* ... */ },
  async update(id: string, updates: Partial<User>): Promise<User> { /* ... */ },
  async delete(id: string): Promise<void> { /* ... */ },
};

export const validateUser = (user: Partial<User>): ValidationResult => {
  // Validation logic
};

export const formatUserName = (user: User): string => {
  return `${user.firstName} ${user.lastName}`;
};
```

#### Default Exports for Components
Use default exports for React components.

```typescript
// ✅ Good - UserCard.tsx
import React from 'react';

interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onEdit }) => {
  // Component implementation
};

export default UserCard;
export type { UserCardProps };
```

#### Index Files for Clean Imports
Create index files to provide clean import paths.

```typescript
// ✅ Good - components/common/index.ts
export { default as Button } from './Button';
export { default as Input } from './Input';
export { default as Modal } from './Modal';
export { default as Card } from './Card';

// Re-export types
export type { ButtonProps } from './Button';
export type { InputProps } from './Input';
export type { ModalProps } from './Modal';
export type { CardProps } from './Card';

// ✅ Good - services/index.ts
export { userService } from './api/userService';
export { authService } from './api/authService';
export { firebaseService } from './firebase/firebaseService';

// ✅ Good - types/index.ts
export type { User, UserData, UserRole } from './user';
export type { ApiResponse, ApiError } from './api';
export type { ValidationResult, FormErrors } from './validation';
```

## Component Organization

### Component Folder Structure
Organize components with supporting files.

```
components/
├── Button/
│   ├── Button.tsx              # Main component
│   ├── Button.types.ts         # TypeScript interfaces
│   ├── Button.styles.ts        # Styled components
│   ├── Button.test.tsx         # Tests
│   ├── Button.stories.tsx      # Storybook stories (if applicable)
│   └── index.ts                # Export file
├── UserCard/
│   ├── UserCard.tsx
│   ├── UserCard.types.ts
│   ├── UserCard.styles.ts
│   ├── UserCard.test.tsx
│   ├── components/             # Sub-components (if needed)
│   │   ├── UserAvatar.tsx
│   │   └── UserActions.tsx
│   └── index.ts
└── index.ts                    # Main export file
```

### Component File Templates

#### Main Component File (Button.tsx)
```typescript
import React from 'react';
import { StyledButton } from './Button.styles';
import type { ButtonProps } from './Button.types';

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  onClick,
  ...props
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default Button;
```

#### Types File (Button.types.ts)
```typescript
import type { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
  disabled?: boolean;
}
```

#### Styles File (Button.styles.ts)
```typescript
import styled from 'styled-components';
import type { ButtonProps } from './Button.types';

export const StyledButton = styled.button<Pick<ButtonProps, 'variant' | 'size'>>`
  // Styled component implementation
`;
```

#### Index File (index.ts)
```typescript
export { default } from './Button';
export type { ButtonProps } from './Button.types';
```

## Service and Utility Organization

### Service Structure
Organize services by domain or functionality.

```
services/
├── api/
│   ├── userService.ts
│   ├── authService.ts
│   ├── orderService.ts
│   ├── common/
│   │   ├── apiClient.ts
│   │   ├── errorHandler.ts
│   │   └── index.ts
│   └── index.ts
├── firebase/
│   ├── firestore.ts
│   ├── auth.ts
│   ├── storage.ts
│   └── index.ts
├── external/
│   ├── stripeService.ts
│   ├── emailService.ts
│   └── index.ts
└── index.ts
```

### Utility Structure
Group utilities by functionality.

```
utils/
├── validation/
│   ├── emailValidation.ts
│   ├── passwordValidation.ts
│   ├── phoneValidation.ts
│   └── index.ts
├── formatters/
│   ├── dateFormatter.ts
│   ├── currencyFormatter.ts
│   ├── numberFormatter.ts
│   └── index.ts
├── helpers/
│   ├── arrayHelpers.ts
│   ├── objectHelpers.ts
│   ├── stringHelpers.ts
│   └── index.ts
├── constants/
│   ├── apiEndpoints.ts
│   ├── errorMessages.ts
│   ├── regex.ts
│   └── index.ts
└── index.ts
```

## Asset Management

### Asset Organization
Structure assets by type and usage.

```
src/assets/
├── images/
│   ├── logos/
│   │   ├── logo.svg
│   │   ├── logo-light.svg
│   │   └── logo-dark.svg
│   ├── backgrounds/
│   │   ├── hero-bg.jpg
│   │   └── pattern-bg.svg
│   ├── illustrations/
│   │   ├── empty-state.svg
│   │   └── error-404.svg
│   └── photos/
│       ├── team/
│       └── products/
├── icons/
│   ├── system/          # System/UI icons
│   │   ├── arrow-right.svg
│   │   ├── close.svg
│   │   └── menu.svg
│   ├── social/          # Social media icons
│   │   ├── facebook.svg
│   │   ├── twitter.svg
│   │   └── linkedin.svg
│   └── index.ts         # Icon exports
├── fonts/
│   ├── inter/
│   └── roboto-mono/
└── index.ts             # Asset exports
```

### Asset Naming
Use descriptive, consistent names for assets.

```
✅ Good asset names:
logo-primary.svg
button-arrow-right.svg
hero-background-desktop.jpg
user-placeholder-avatar.png
icon-social-facebook.svg

❌ Avoid:
logo.svg             # Too generic
arrow.svg            # Missing context
bg.jpg               # Too abbreviated
img1.png             # Non-descriptive
facebook.svg         # Missing category prefix
```

## Configuration Files

### Configuration Organization
Keep configuration files organized and well-documented.

```
# Root level configs
├── .env.example         # Environment variables template
├── .env.local          # Local environment (not committed)
├── .gitignore          # Git ignore rules
├── .eslintrc.json      # ESLint configuration
├── tsconfig.json       # TypeScript base config
├── tsconfig.app.json   # App-specific TypeScript config
├── tsconfig.node.json  # Node-specific TypeScript config
├── vite.config.ts      # Vite build configuration
├── package.json        # Dependencies and scripts
└── README.md           # Project documentation

# Tool-specific configs
├── .vscode/
│   ├── settings.json   # VS Code workspace settings
│   ├── extensions.json # Recommended extensions
│   └── launch.json     # Debug configurations
├── .github/
│   ├── workflows/      # GitHub Actions
│   └── ISSUE_TEMPLATE/ # Issue templates
```

## Documentation Structure

### Documentation Organization
Structure documentation for easy navigation and maintenance.

```
docs/
├── README.md                           # Documentation index
├── getting-started/
│   ├── installation.md
│   ├── development-setup.md
│   └── first-run.md
├── development/
│   ├── typescript-standards.md
│   ├── react-guidelines.md
│   ├── styled-components-conventions.md
│   ├── file-organization-standards.md
│   └── firebase-integration-patterns.md
├── deployment/
│   ├── production-deployment.md
│   ├── staging-deployment.md
│   └── environment-configuration.md
├── api/
│   ├── authentication.md
│   ├── user-endpoints.md
│   └── error-handling.md
├── architecture/
│   ├── system-overview.md
│   ├── data-flow.md
│   └── security-considerations.md
└── troubleshooting/
    ├── common-issues.md
    ├── debugging-guide.md
    └── faq.md
```

## Testing Organization

### Test Structure
Organize tests to mirror source structure.

```
src/
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   └── __tests__/
│   │       ├── Button.integration.test.tsx
│   │       └── Button.accessibility.test.tsx
│   └── UserCard/
│       ├── UserCard.tsx
│       ├── UserCard.test.tsx
│       └── __tests__/
├── services/
│   ├── userService.ts
│   ├── userService.test.ts
│   └── __tests__/
│       └── userService.integration.test.ts
├── utils/
│   ├── validation/
│   │   ├── emailValidation.ts
│   │   └── emailValidation.test.ts
│   └── formatters/
│       ├── dateFormatter.ts
│       └── dateFormatter.test.ts
└── __tests__/
    ├── setup.ts           # Test setup and configuration
    ├── mocks/             # Global mocks
    │   ├── firebase.ts
    │   └── api.ts
    └── utils/             # Test utilities
        ├── render.tsx     # Custom render function
        └── factories.ts   # Test data factories
```

### Test File Naming
Use descriptive test file names.

```
✅ Good test names:
Button.test.tsx
userService.test.ts
emailValidation.test.ts
Button.integration.test.tsx
UserCard.accessibility.test.tsx

❌ Avoid:
test-button.tsx        # Use suffix, not prefix
button.spec.tsx        # Be consistent with .test.tsx
buttonTest.tsx         # Missing separator
```

---

## Enforcement and Tools

### Automated Enforcement
Use tools to enforce file organization standards:

```json
// .eslintrc.json
{
  "rules": {
    "import/order": ["error", {
      "groups": [
        "builtin",
        "external",
        "internal",
        "parent",
        "sibling",
        "index"
      ],
      "newlines-between": "always"
    }]
  }
}
```

### File Templates
Create templates for consistent file structure:

```bash
# Component template script
npm run create:component ComponentName
```

### Documentation
Maintain documentation for:
- File naming conventions
- Folder structure decisions
- Import/export patterns
- Asset organization

## Related Files
- [Main Style Guide](../STYLE_GUIDE.md)
- [TypeScript Standards](./typescript-standards.md)
- [React Component Guidelines](./react-guidelines.md)

Follow these file organization standards to maintain a clean, scalable, and maintainable codebase that supports team collaboration and project growth.