# Styled Components Conventions

Comprehensive styled-components guidelines and best practices for the UnBirthday project using styled-components 6.1.19 with TypeScript.

## Table of Contents

- [Component Naming](#component-naming)
- [Component Structure](#component-structure)
- [Theme and Design Tokens](#theme-and-design-tokens)
- [Props and Styling](#props-and-styling)
- [CSS Organization](#css-organization)
- [Responsive Design](#responsive-design)
- [Animation and Transitions](#animation-and-transitions)
- [Performance Optimization](#performance-optimization)
- [Testing Styled Components](#testing-styled-components)
- [Migration Patterns](#migration-patterns)

## Component Naming

### Naming Conventions
Prefix all styled components with `Styled` and use PascalCase.

```tsx
// ✅ Good - Clear styled component naming
const StyledButton = styled.button`
  /* styles */
`;

const StyledCard = styled.div`
  /* styles */
`;

const StyledUserProfile = styled.section`
  /* styles */
`;

// ✅ Good - Descriptive names for specific variants
const StyledPrimaryButton = styled(StyledButton)`
  /* primary variant styles */
`;

const StyledCardHeader = styled.header`
  /* card header styles */
`;

// ❌ Avoid - Unclear or inconsistent naming
const Button = styled.button``; // Missing Styled prefix
const button = styled.button``; // Wrong case
const Btn = styled.button``; // Abbreviated
```

### Organizing Styled Components
Keep styled components close to their usage but organized logically.

```tsx
// ✅ Good - Styled components at the top of the file
import React from 'react';
import styled, { css } from 'styled-components';

// Styled components
const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const StyledHeader = styled.header`
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.primary};
`;

const StyledContent = styled.main`
  flex: 1;
  padding: 1rem;
`;

// Component interfaces
interface UserDashboardProps {
  user: User;
}

// Main component
const UserDashboard: React.FC<UserDashboardProps> = ({ user }) => {
  return (
    <StyledContainer>
      <StyledHeader>
        Welcome, {user.name}
      </StyledHeader>
      <StyledContent>
        {/* Content */}
      </StyledContent>
    </StyledContainer>
  );
};

export default UserDashboard;
```

## Component Structure

### Basic Component Structure
Follow consistent structure for styled components.

```tsx
// ✅ Good - Well-structured styled component
interface StyledButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  fullWidth?: boolean;
}

const StyledButton = styled.button<StyledButtonProps>`
  /* Base styles */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;

  /* Size variants */
  ${({ size = 'medium' }) => {
    switch (size) {
      case 'small':
        return css`
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
        `;
      case 'large':
        return css`
          padding: 1rem 2rem;
          font-size: 1.125rem;
        `;
      default:
        return css`
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
        `;
    }
  }}

  /* Variant styles */
  ${({ variant = 'primary', theme }) => {
    switch (variant) {
      case 'secondary':
        return css`
          background-color: ${theme.colors.secondary};
          color: ${theme.colors.white};

          &:hover:not(:disabled) {
            background-color: ${theme.colors.secondaryDark};
          }
        `;
      case 'outline':
        return css`
          background-color: transparent;
          color: ${theme.colors.primary};
          border: 2px solid ${theme.colors.primary};

          &:hover:not(:disabled) {
            background-color: ${theme.colors.primary};
            color: ${theme.colors.white};
          }
        `;
      default:
        return css`
          background-color: ${theme.colors.primary};
          color: ${theme.colors.white};

          &:hover:not(:disabled) {
            background-color: ${theme.colors.primaryDark};
          }
        `;
    }
  }}

  /* Conditional styles */
  ${({ fullWidth }) =>
    fullWidth &&
    css`
      width: 100%;
    `}

  /* Disabled state */
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* Focus styles */
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}33;
  }
`;
```

### Component Composition
Use composition for complex components.

```tsx
// ✅ Good - Component composition
const StyledCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const StyledCardHeader = styled.header`
  padding: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const StyledCardTitle = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const StyledCardBody = styled.div`
  padding: 1.5rem;
`;

const StyledCardFooter = styled.footer`
  padding: 1rem 1.5rem;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

// Usage
const Card: React.FC<CardProps> = ({ title, children, footer }) => {
  return (
    <StyledCard>
      {title && (
        <StyledCardHeader>
          <StyledCardTitle>{title}</StyledCardTitle>
        </StyledCardHeader>
      )}
      <StyledCardBody>{children}</StyledCardBody>
      {footer && <StyledCardFooter>{footer}</StyledCardFooter>}
    </StyledCard>
  );
};
```

## Theme and Design Tokens

### Theme Structure
Create a comprehensive theme object for design consistency.

```typescript
// theme.ts
export const theme = {
  colors: {
    // Primary colors
    primary: '#007acc',
    primaryLight: '#4da6e0',
    primaryDark: '#005999',

    // Secondary colors
    secondary: '#6c757d',
    secondaryLight: '#9aa0a6',
    secondaryDark: '#495057',

    // Semantic colors
    success: '#28a745',
    warning: '#ffc107',
    error: '#dc3545',
    info: '#17a2b8',

    // Neutral colors
    white: '#ffffff',
    black: '#000000',
    gray: {
      50: '#f8f9fa',
      100: '#e9ecef',
      200: '#dee2e6',
      300: '#ced4da',
      400: '#adb5bd',
      500: '#6c757d',
      600: '#495057',
      700: '#343a40',
      800: '#212529',
      900: '#1a1a1a',
    },

    // Background colors
    background: {
      primary: '#ffffff',
      secondary: '#f8f9fa',
      tertiary: '#e9ecef',
    },

    // Text colors
    text: {
      primary: '#212529',
      secondary: '#6c757d',
      tertiary: '#adb5bd',
      inverse: '#ffffff',
    },

    // Border colors
    border: '#dee2e6',
    borderLight: '#e9ecef',
    borderDark: '#ced4da',
  },

  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    xxl: '3rem',     // 48px
    xxxl: '4rem',    // 64px
  },

  typography: {
    fontFamily: {
      primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mono: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
    },
    fontSize: {
      xs: '0.75rem',   // 12px
      sm: '0.875rem',  // 14px
      base: '1rem',    // 16px
      lg: '1.125rem',  // 18px
      xl: '1.25rem',   // 20px
      '2xl': '1.5rem', // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },

  borderRadius: {
    none: '0',
    sm: '0.125rem',  // 2px
    base: '0.25rem', // 4px
    md: '0.375rem',  // 6px
    lg: '0.5rem',    // 8px
    xl: '0.75rem',   // 12px
    full: '9999px',
  },

  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
  },

  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    xxl: '1536px',
  },

  zIndex: {
    dropdown: 1000,
    modal: 1050,
    tooltip: 1070,
    toast: 1080,
  },
} as const;

// Type for theme
export type Theme = typeof theme;

// Styled-components theme type augmentation
declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
```

### Using Theme in Components
Access theme values consistently throughout components.

```tsx
// ✅ Good - Using theme values
const StyledAlert = styled.div<{ variant: 'success' | 'warning' | 'error' | 'info' }>`
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-family: ${({ theme }) => theme.typography.fontFamily.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};

  ${({ variant, theme }) => {
    const colors = {
      success: theme.colors.success,
      warning: theme.colors.warning,
      error: theme.colors.error,
      info: theme.colors.info,
    };

    return css`
      background-color: ${colors[variant]}15;
      border: 1px solid ${colors[variant]}40;
      color: ${variant === 'warning' ? theme.colors.text.primary : colors[variant]};
    `;
  }}
`;

// ✅ Good - Theme-aware responsive design
const StyledContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.md};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0 ${({ theme }) => theme.spacing.lg};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: 0 ${({ theme }) => theme.spacing.xl};
  }
`;
```

## Props and Styling

### Conditional Styling with Props
Use props for dynamic styling in a type-safe manner.

```tsx
// ✅ Good - Type-safe prop styling
interface StyledButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  fullWidth?: boolean;
}

const StyledButton = styled.button<StyledButtonProps>`
  /* Base styles */
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;

  /* Conditional styles using helper functions */
  ${getButtonSizeStyles}
  ${getButtonVariantStyles}
  ${getButtonStateStyles}

  /* Simple conditional styles */
  ${({ fullWidth }) =>
    fullWidth &&
    css`
      width: 100%;
    `}

  ${({ isLoading }) =>
    isLoading &&
    css`
      pointer-events: none;
      opacity: 0.7;
    `}
`;

// Helper functions for complex styling logic
const getButtonSizeStyles = ({ size = 'medium', theme }: StyledButtonProps & { theme: Theme }) => {
  const sizes = {
    small: css`
      padding: ${theme.spacing.sm} ${theme.spacing.md};
      font-size: ${theme.typography.fontSize.sm};
      min-height: 2rem;
    `,
    medium: css`
      padding: ${theme.spacing.md} ${theme.spacing.lg};
      font-size: ${theme.typography.fontSize.base};
      min-height: 2.5rem;
    `,
    large: css`
      padding: ${theme.spacing.lg} ${theme.spacing.xl};
      font-size: ${theme.typography.fontSize.lg};
      min-height: 3rem;
    `,
  };

  return sizes[size];
};

const getButtonVariantStyles = ({ variant = 'primary', theme }: StyledButtonProps & { theme: Theme }) => {
  const variants = {
    primary: css`
      background-color: ${theme.colors.primary};
      color: ${theme.colors.white};

      &:hover:not(:disabled) {
        background-color: ${theme.colors.primaryDark};
      }

      &:active {
        transform: translateY(1px);
      }
    `,
    secondary: css`
      background-color: ${theme.colors.secondary};
      color: ${theme.colors.white};

      &:hover:not(:disabled) {
        background-color: ${theme.colors.secondaryDark};
      }
    `,
    outline: css`
      background-color: transparent;
      color: ${theme.colors.primary};
      border: 2px solid ${theme.colors.primary};

      &:hover:not(:disabled) {
        background-color: ${theme.colors.primary};
        color: ${theme.colors.white};
      }
    `,
    ghost: css`
      background-color: transparent;
      color: ${theme.colors.primary};

      &:hover:not(:disabled) {
        background-color: ${theme.colors.primary}15;
      }
    `,
  };

  return variants[variant];
};
```

### Complex Prop Handling
Handle complex prop combinations effectively.

```tsx
// ✅ Good - Complex prop handling
interface StyledInputProps {
  hasError?: boolean;
  isDisabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  variant?: 'outlined' | 'filled' | 'underlined';
}

const StyledInput = styled.input<StyledInputProps>`
  width: 100%;
  font-family: ${({ theme }) => theme.typography.fontFamily.primary};
  transition: all 0.2s ease;

  ${({ size = 'medium', theme }) => {
    const sizeMap = {
      small: { padding: theme.spacing.sm, fontSize: theme.typography.fontSize.sm },
      medium: { padding: theme.spacing.md, fontSize: theme.typography.fontSize.base },
      large: { padding: theme.spacing.lg, fontSize: theme.typography.fontSize.lg },
    };

    const { padding, fontSize } = sizeMap[size];

    return css`
      padding: ${padding};
      font-size: ${fontSize};
    `;
  }}

  ${({ variant = 'outlined', theme, hasError, isDisabled }) => {
    const getColor = () => {
      if (hasError) return theme.colors.error;
      if (isDisabled) return theme.colors.gray[400];
      return theme.colors.border;
    };

    const baseStyles = css`
      border: 1px solid ${getColor()};

      &:focus {
        outline: none;
        border-color: ${hasError ? theme.colors.error : theme.colors.primary};
        box-shadow: 0 0 0 3px ${hasError ? theme.colors.error : theme.colors.primary}33;
      }
    `;

    const variantStyles = {
      outlined: css`
        ${baseStyles}
        background-color: ${theme.colors.white};
        border-radius: ${theme.borderRadius.md};
      `,
      filled: css`
        ${baseStyles}
        background-color: ${theme.colors.background.secondary};
        border-radius: ${theme.borderRadius.md};
      `,
      underlined: css`
        background-color: transparent;
        border: none;
        border-bottom: 2px solid ${getColor()};
        border-radius: 0;

        &:focus {
          border-bottom-color: ${hasError ? theme.colors.error : theme.colors.primary};
          box-shadow: none;
        }
      `,
    };

    return variantStyles[variant];
  }}

  ${({ isDisabled, theme }) =>
    isDisabled &&
    css`
      background-color: ${theme.colors.background.tertiary};
      cursor: not-allowed;
      opacity: 0.6;
    `}
`;
```

## CSS Organization

### CSS Property Order
Follow consistent CSS property ordering.

```tsx
// ✅ Good - Organized CSS properties
const StyledCard = styled.div`
  /* Positioning */
  position: relative;
  top: 0;
  left: 0;
  z-index: 1;

  /* Display & Box Model */
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  height: auto;
  padding: ${({ theme }) => theme.spacing.lg};
  margin: ${({ theme }) => theme.spacing.md};

  /* Border */
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};

  /* Background */
  background-color: ${({ theme }) => theme.colors.white};
  background-image: none;

  /* Typography */
  font-family: ${({ theme }) => theme.typography.fontFamily.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.normal};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: left;

  /* Visual Effects */
  box-shadow: ${({ theme }) => theme.shadows.md};
  opacity: 1;
  overflow: hidden;

  /* Animation */
  transition: all 0.2s ease;
  transform: translateY(0);

  /* Pseudo-classes */
  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.lg};
    transform: translateY(-2px);
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;
```

### CSS Mixins and Helpers
Create reusable CSS mixins for common patterns.

```tsx
// mixins.ts
import { css } from 'styled-components';
import { Theme } from './theme';

// Flexbox mixins
export const flexCenter = css`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const flexBetween = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

// Typography mixins
export const truncateText = css`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const visuallyHidden = css`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

// Focus styles
export const focusRing = (theme: Theme) => css`
  &:focus {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 2px;
  }
`;

// Responsive helpers
export const hideOnMobile = (theme: Theme) => css`
  @media (max-width: ${theme.breakpoints.md}) {
    display: none;
  }
`;

export const showOnMobile = (theme: Theme) => css`
  display: none;

  @media (max-width: ${theme.breakpoints.md}) {
    display: block;
  }
`;

// Usage in components
const StyledHeader = styled.header`
  ${flexBetween}
  padding: ${({ theme }) => theme.spacing.lg};

  h1 {
    ${truncateText}
    max-width: 200px;
  }

  button {
    ${({ theme }) => focusRing(theme)}
  }

  .mobile-only {
    ${({ theme }) => showOnMobile(theme)}
  }
`;
```

## Responsive Design

### Breakpoint Management
Use consistent breakpoint patterns.

```tsx
// ✅ Good - Responsive design patterns
const StyledGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  grid-template-columns: 1fr;

  /* Mobile first approach */
  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(3, 1fr);
    gap: ${({ theme }) => theme.spacing.lg};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(4, 1fr);
    gap: ${({ theme }) => theme.spacing.xl};
  }
`;

// Helper for media queries
const media = {
  sm: (styles: string) => css`
    @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
      ${styles}
    }
  `,
  md: (styles: string) => css`
    @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
      ${styles}
    }
  `,
  lg: (styles: string) => css`
    @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
      ${styles}
    }
  `,
  xl: (styles: string) => css`
    @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
      ${styles}
    }
  `,
};

// Usage with helper
const StyledResponsiveContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.md};

  ${media.md`
    padding: ${({ theme }) => theme.spacing.lg};
  `}

  ${media.lg`
    padding: ${({ theme }) => theme.spacing.xl};
    max-width: 1200px;
    margin: 0 auto;
  `}
`;
```

## Animation and Transitions

### Animation Best Practices
Create smooth, accessible animations.

```tsx
// ✅ Good - Animation patterns
const fadeIn = css`
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const slideIn = css`
  @keyframes slideIn {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(0);
    }
  }
`;

const StyledModal = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.xl};

  /* Animation */
  ${fadeIn}
  animation: ${({ isVisible }) => isVisible ? 'fadeIn 0.2s ease-out' : 'none'};

  /* Respect user preferences */
  @media (prefers-reduced-motion: reduce) {
    animation: none;
    transition: none;
  }
`;

const StyledButton = styled.button`
  /* Smooth transitions */
  transition:
    background-color 0.2s ease,
    transform 0.1s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }

  &:active {
    transform: translateY(0);
    transition-duration: 0.05s;
  }

  /* Disable animations for users who prefer reduced motion */
  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &:hover,
    &:active {
      transform: none;
    }
  }
`;
```

## Performance Optimization

### Optimizing Styled Components
Follow performance best practices.

```tsx
// ✅ Good - Performance optimizations

// 1. Use static styles when possible
const StyledContainer = styled.div`
  /* Static styles - computed once */
  display: flex;
  flex-direction: column;
  border-radius: 8px;
`;

// 2. Minimize dynamic styles
const StyledButton = styled.button<{ variant: string }>`
  /* Static base styles */
  padding: 1rem 2rem;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;

  /* Dynamic styles - use sparingly */
  background-color: ${({ variant, theme }) =>
    variant === 'primary' ? theme.colors.primary : theme.colors.secondary
  };
`;

// 3. Use CSS variables for frequently changing values
const StyledProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: 4px;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    height: 100%;
    background-color: ${({ theme }) => theme.colors.primary};
    width: var(--progress, 0%);
    transition: width 0.3s ease;
  }
`;

// Usage with CSS variable
const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => {
  return (
    <StyledProgressBar
      style={{ '--progress': `${progress}%` } as React.CSSProperties}
    />
  );
};

// 4. Avoid complex computations in render
const getButtonStyles = (variant: string, theme: Theme) => {
  // Pre-compute styles outside of component
  const styleMap = {
    primary: css`
      background-color: ${theme.colors.primary};
      color: ${theme.colors.white};
    `,
    secondary: css`
      background-color: ${theme.colors.secondary};
      color: ${theme.colors.white};
    `,
  };

  return styleMap[variant] || styleMap.primary;
};

const StyledOptimizedButton = styled.button<{ variant: string }>`
  /* Base styles */
  padding: 1rem 2rem;
  border: none;
  border-radius: 4px;

  /* Pre-computed dynamic styles */
  ${({ variant, theme }) => getButtonStyles(variant, theme)}
`;
```

## Testing Styled Components

### Testing Approaches
Test styled components effectively.

```tsx
// StyledButton.test.tsx
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { theme } from '../theme';
import { StyledButton } from './StyledButton';

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('StyledButton', () => {
  it('renders with correct styles', () => {
    renderWithTheme(
      <StyledButton variant="primary" data-testid="button">
        Click me
      </StyledButton>
    );

    const button = screen.getByTestId('button');

    // Test computed styles
    expect(button).toHaveStyle({
      backgroundColor: theme.colors.primary,
      color: theme.colors.white,
    });
  });

  it('applies size variants correctly', () => {
    renderWithTheme(
      <StyledButton size="large" data-testid="large-button">
        Large Button
      </StyledButton>
    );

    const button = screen.getByTestId('large-button');
    expect(button).toHaveStyle({
      padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
    });
  });

  it('handles disabled state', () => {
    renderWithTheme(
      <StyledButton disabled data-testid="disabled-button">
        Disabled
      </StyledButton>
    );

    const button = screen.getByTestId('disabled-button');
    expect(button).toBeDisabled();
    expect(button).toHaveStyle({ opacity: '0.6' });
  });
});
```

---

## Related Files
- [Main Style Guide](../STYLE_GUIDE.md)
- [React Component Guidelines](./react-guidelines.md)
- [Theme Configuration](../src/theme/theme.ts)

## Enforcement
These conventions are enforced through:
- ESLint rules for styled-components
- StyleLint for CSS-in-JS
- Design system documentation
- Code review guidelines

Follow these conventions to maintain consistent, performant, and maintainable styled components throughout the project.