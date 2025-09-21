# React Component Guidelines

Comprehensive React component guidelines and best practices for the UnBirthday project using React 19.1.1 with TypeScript.

## Table of Contents

- [Component Structure](#component-structure)
- [Naming Conventions](#naming-conventions)
- [Props and Interfaces](#props-and-interfaces)
- [State Management](#state-management)
- [Hooks Best Practices](#hooks-best-practices)
- [Event Handling](#event-handling)
- [Performance Optimization](#performance-optimization)
- [Error Boundaries](#error-boundaries)
- [Testing Guidelines](#testing-guidelines)
- [Accessibility](#accessibility)

## Component Structure

### Functional Components
Always use functional components with TypeScript interfaces.

```tsx
// ✅ Good - Standard functional component structure
import React from 'react';

interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
  className?: string;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  onEdit,
  className
}) => {
  const handleEdit = () => {
    onEdit?.(user);
  };

  return (
    <div className={className}>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      {onEdit && (
        <button onClick={handleEdit}>
          Edit
        </button>
      )}
    </div>
  );
};

export default UserCard;
```

### Component File Organization
Structure component files consistently.

```tsx
// components/UserCard/UserCard.tsx
import React, { useState, useCallback } from 'react';
import styled from 'styled-components';

// Internal components (if any)
import { UserAvatar } from './UserAvatar';

// Types
interface UserCardProps {
  user: User;
  variant?: 'compact' | 'detailed';
  onUserClick?: (user: User) => void;
}

// Styled components
const StyledUserCard = styled.div<{ variant: string }>`
  /* styles */
`;

// Main component
const UserCard: React.FC<UserCardProps> = ({
  user,
  variant = 'detailed',
  onUserClick
}) => {
  // Component logic here
  return (
    <StyledUserCard variant={variant}>
      {/* JSX content */}
    </StyledUserCard>
  );
};

export default UserCard;
export type { UserCardProps };
```

### Component Index Files
Create clean index files for component exports.

```typescript
// components/UserCard/index.ts
export { default } from './UserCard';
export type { UserCardProps } from './UserCard';

// components/index.ts
export { default as UserCard } from './UserCard';
export { default as UserList } from './UserList';
export { default as UserForm } from './UserForm';

// Re-export types
export type { UserCardProps } from './UserCard';
export type { UserListProps } from './UserList';
export type { UserFormProps } from './UserForm';
```

## Naming Conventions

### Component Names
Use PascalCase for component names and files.

```tsx
// ✅ Good - Component naming
const UserProfile = () => { /* ... */ };
const NavigationMenu = () => { /* ... */ };
const ApiStatusIndicator = () => { /* ... */ };

// ❌ Avoid - Incorrect naming
const userProfile = () => { /* ... */ };
const navigationmenu = () => { /* ... */ };
const APIStatus = () => { /* ... */ };
```

### Props and State Names
Use clear, descriptive names for props and state.

```tsx
// ✅ Good - Descriptive prop names
interface ProductCardProps {
  product: Product;
  isSelected: boolean;
  onAddToCart: (product: Product) => void;
  showPrice?: boolean;
  variant?: 'grid' | 'list';
}

// ✅ Good - Clear state names
const [isLoading, setIsLoading] = useState(false);
const [selectedItems, setSelectedItems] = useState<string[]>([]);
const [formErrors, setFormErrors] = useState<ValidationErrors>({});

// ❌ Avoid - Unclear names
interface Props {
  data: any;
  cb: Function;
  flag: boolean;
}
```

### Event Handlers
Follow consistent naming patterns for event handlers.

```tsx
// ✅ Good - Event handler naming
const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onToggleFavorite
}) => {
  const handleAddToCart = () => {
    onAddToCart(product);
  };

  const handleFavoriteToggle = () => {
    onToggleFavorite(product.id);
  };

  const handleQuantityChange = (quantity: number) => {
    // Handle internal state change
  };

  return (
    <div>
      <button onClick={handleAddToCart}>Add to Cart</button>
      <button onClick={handleFavoriteToggle}>♥</button>
    </div>
  );
};
```

## Props and Interfaces

### Props Interface Definition
Define clear, well-documented props interfaces.

```tsx
// ✅ Good - Comprehensive props interface
interface UserFormProps {
  /** The user to edit, or undefined for creating a new user */
  user?: User;

  /** Whether the form is in loading state */
  isLoading?: boolean;

  /** Validation errors to display */
  errors?: Record<string, string>;

  /** Called when form is submitted with valid data */
  onSubmit: (userData: UserFormData) => void;

  /** Called when user cancels the form */
  onCancel?: () => void;

  /** Additional CSS class name */
  className?: string;

  /** Form variant */
  variant?: 'create' | 'edit' | 'view';
}

// ✅ Good - Using the interface
const UserForm: React.FC<UserFormProps> = ({
  user,
  isLoading = false,
  errors = {},
  onSubmit,
  onCancel,
  className,
  variant = 'create'
}) => {
  // Component implementation
};
```

### Default Props
Use default parameters instead of defaultProps.

```tsx
// ✅ Good - Default parameters
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  onClick
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </StyledButton>
  );
};

// ❌ Avoid - defaultProps (legacy pattern)
Button.defaultProps = {
  variant: 'primary',
  size: 'medium',
  disabled: false
};
```

### Children Props
Handle children props appropriately based on usage.

```tsx
// ✅ Good - Flexible children handling
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

interface CardProps {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

// ✅ Good - Render prop pattern
interface DataFetcherProps<T> {
  url: string;
  children: (data: T | null, loading: boolean, error: Error | null) => React.ReactNode;
}

const DataFetcher = <T,>({ url, children }: DataFetcherProps<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch logic...

  return <>{children(data, loading, error)}</>;
};
```

## State Management

### Local State with useState
Use useState for component-local state management.

```tsx
// ✅ Good - Local state management
const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Separate state for different concerns
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({});

  const handleSave = async (userData: UserFormData) => {
    try {
      setIsLoading(true);
      await userService.update(userId, userData);
      setUser({ ...user!, ...userData });
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update user');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Component JSX */}
    </div>
  );
};
```

### Complex State with useReducer
Use useReducer for complex state logic.

```tsx
// ✅ Good - useReducer for complex state
interface FormState {
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
}

type FormAction =
  | { type: 'SET_FIELD'; field: string; value: any }
  | { type: 'SET_ERROR'; field: string; error: string }
  | { type: 'SET_TOUCHED'; field: string }
  | { type: 'SET_SUBMITTING'; isSubmitting: boolean }
  | { type: 'RESET_FORM' };

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        values: { ...state.values, [action.field]: action.value }
      };
    case 'SET_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.field]: action.error }
      };
    // ... other cases
    default:
      return state;
  }
};

const ContactForm: React.FC = () => {
  const [state, dispatch] = useReducer(formReducer, {
    values: {},
    errors: {},
    touched: {},
    isSubmitting: false
  });

  // Use dispatch to update state
  const handleFieldChange = (field: string, value: any) => {
    dispatch({ type: 'SET_FIELD', field, value });
  };

  return (
    <form>
      {/* Form fields */}
    </form>
  );
};
```

## Hooks Best Practices

### Custom Hooks
Create custom hooks for reusable logic.

```tsx
// ✅ Good - Custom hook for API calls
const useApi = <T>(url: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

// ✅ Good - Custom hook for form handling
const useForm = <T extends Record<string, any>>(initialValues: T) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const setValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const setError = useCallback((field: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  return {
    values,
    errors,
    setValue,
    setError,
    reset
  };
};
```

### useEffect Best Practices
Follow useEffect guidelines for side effects.

```tsx
// ✅ Good - Proper useEffect usage
const UserProfile: React.FC<{ userId: string }> = ({ userId }) => {
  const [user, setUser] = useState<User | null>(null);

  // Effect with proper dependencies
  useEffect(() => {
    const fetchUser = async () => {
      const userData = await userService.getById(userId);
      setUser(userData);
    };

    fetchUser();
  }, [userId]); // Dependencies array includes all used values

  // Effect with cleanup
  useEffect(() => {
    const timer = setInterval(() => {
      // Update something periodically
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  // Effect with async cleanup
  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      const result = await api.getData();
      if (!cancelled) {
        setUser(result);
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, []);

  return <div>{/* Component JSX */}</div>;
};
```

### useCallback and useMemo
Use for performance optimization when needed.

```tsx
// ✅ Good - useCallback for event handlers
const UserList: React.FC<UserListProps> = ({ users, onUserSelect }) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleUserToggle = useCallback((userId: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  }, []);

  const selectedUsers = useMemo(() => {
    return users.filter(user => selectedIds.has(user.id));
  }, [users, selectedIds]);

  const userCount = useMemo(() => {
    return users.length;
  }, [users.length]);

  return (
    <div>
      <p>Total users: {userCount}</p>
      <p>Selected: {selectedUsers.length}</p>
      {users.map(user => (
        <UserCard
          key={user.id}
          user={user}
          onToggle={handleUserToggle}
        />
      ))}
    </div>
  );
};
```

## Event Handling

### Event Handler Patterns
Use consistent patterns for event handling.

```tsx
// ✅ Good - Event handler patterns
const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  // Generic input handler
  const handleInputChange = useCallback((
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  // Specific handlers for complex logic
  const handleEmailBlur = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    const email = event.target.value;
    if (email && !isValidEmail(email)) {
      setEmailError('Please enter a valid email address');
    }
  }, []);

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await submitForm(formData);
      // Handle success
    } catch (error) {
      // Handle error
    }
  }, [formData]);

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        value={formData.name}
        onChange={handleInputChange}
      />
      <input
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        onBlur={handleEmailBlur}
      />
      <textarea
        name="message"
        value={formData.message}
        onChange={handleInputChange}
      />
      <button type="submit">Submit</button>
    </form>
  );
};
```

## Performance Optimization

### React.memo
Use React.memo for components that render frequently with same props.

```tsx
// ✅ Good - React.memo with comparison function
interface UserCardProps {
  user: User;
  isSelected: boolean;
  onSelect: (userId: string) => void;
}

const UserCard = React.memo<UserCardProps>(({
  user,
  isSelected,
  onSelect
}) => {
  const handleSelect = useCallback(() => {
    onSelect(user.id);
  }, [onSelect, user.id]);

  return (
    <div className={isSelected ? 'selected' : ''}>
      <h3>{user.name}</h3>
      <button onClick={handleSelect}>Select</button>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for optimization
  return (
    prevProps.user.id === nextProps.user.id &&
    prevProps.user.name === nextProps.user.name &&
    prevProps.isSelected === nextProps.isSelected
  );
});

UserCard.displayName = 'UserCard';
```

### Lazy Loading
Implement lazy loading for better performance.

```tsx
// ✅ Good - Lazy loading with Suspense
const UserDashboard = React.lazy(() => import('./UserDashboard'));
const AdminPanel = React.lazy(() => import('./AdminPanel'));

const App: React.FC = () => {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </Suspense>
    </Router>
  );
};
```

## Error Boundaries

### Error Boundary Implementation
Create error boundaries for graceful error handling.

```tsx
// ✅ Good - Error boundary component
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Log to error reporting service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>Something went wrong.</h2>
          <details>
            {this.state.error?.message}
          </details>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage
const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <MainContent />
    </ErrorBoundary>
  );
};
```

## Testing Guidelines

### Component Testing Structure
Structure component tests consistently.

```tsx
// UserCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { UserCard } from './UserCard';

const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com'
};

describe('UserCard', () => {
  const defaultProps = {
    user: mockUser,
    onEdit: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders user information correctly', () => {
    render(<UserCard {...defaultProps} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    render(<UserCard {...defaultProps} />);

    fireEvent.click(screen.getByText('Edit'));

    expect(defaultProps.onEdit).toHaveBeenCalledWith(mockUser);
  });

  it('does not render edit button when onEdit is not provided', () => {
    const { onEdit, ...propsWithoutOnEdit } = defaultProps;
    render(<UserCard {...propsWithoutOnEdit} />);

    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
  });
});
```

## Accessibility

### Accessibility Best Practices
Ensure components are accessible.

```tsx
// ✅ Good - Accessible component
const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className="modal-content"
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        <div className="modal-header">
          <h2 id="modal-title">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};
```

---

## Related Files
- [Main Style Guide](../STYLE_GUIDE.md)
- [TypeScript Standards](./typescript-standards.md)
- [Styled Components Conventions](./styled-components-conventions.md)

## Enforcement
These guidelines are enforced through:
- ESLint rules for React and React Hooks
- TypeScript strict checking
- Code review process
- Automated testing requirements

Follow these guidelines to maintain consistent, readable, and maintainable React components throughout the project.