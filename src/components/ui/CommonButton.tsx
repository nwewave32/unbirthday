import React from 'react';
import styled, { css } from 'styled-components';

interface CommonButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const getVariantStyles = (variant: string) => {
  switch (variant) {
    case 'secondary':
      return css`
        background: linear-gradient(45deg, #667eea, #764ba2);
        color: white;

        &:hover {
          background: linear-gradient(45deg, #5a67d8, #553c9a);
        }
      `;
    case 'outline':
      return css`
        background: transparent;
        color: #ff6b6b;
        border: 2px solid #ff6b6b;

        &:hover {
          background: #ff6b6b;
          color: white;
        }
      `;
    default: // primary
      return css`
        background: linear-gradient(45deg, #ff6b6b, #ffa726);
        color: white;

        &:hover {
          background: linear-gradient(45deg, #ff5252, #ff9800);
        }
      `;
  }
};

const getSizeStyles = (size: string) => {
  switch (size) {
    case 'small':
      return css`
        padding: 12px 20px;
        font-size: 0.9rem;
        min-height: 40px;
      `;
    case 'large':
      return css`
        padding: 20px 40px;
        font-size: 1.3rem;
        min-height: 56px;
      `;
    default: // medium
      return css`
        padding: 16px 32px;
        font-size: 1.1rem;
        min-height: 48px;
      `;
  }
};

const StyledButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !['variant', 'size', 'fullWidth', 'loading'].includes(prop),
})<Omit<CommonButtonProps, 'children'>>`
  border: none;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  font-family: inherit;

  ${({ variant = 'primary' }) => getVariantStyles(variant)}
  ${({ size = 'medium' }) => getSizeStyles(size)}

  ${({ fullWidth }) => fullWidth && css`
    width: 100%;
    max-width: 280px;
  `}

  ${({ disabled }) => disabled && css`
    opacity: 0.6;
    cursor: not-allowed;

    &:hover {
      transform: none;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }
  `}

  ${({ loading }) => loading && css`
    opacity: 0.7;
    cursor: not-allowed;

    &:after {
      content: '';
      width: 16px;
      height: 16px;
      margin-left: 8px;
      border: 2px solid transparent;
      border-top: 2px solid currentColor;
      border-radius: 50%;
      display: inline-block;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `}

  &:active {
    transform: translateY(1px);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;

    &:hover, &:active {
      transform: none;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }
  }
`;

const CommonButton: React.FC<CommonButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  loading = false,
  type = 'button',
  className,
  ...props
}) => {
  const handleClick = () => {
    if (!disabled && !loading && onClick) {
      onClick();
    }
  };

  return (
    <StyledButton
      type={type}
      onClick={handleClick}
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      loading={loading}
      className={className}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default CommonButton;