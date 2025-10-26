import React from 'react';
import styled, { css } from 'styled-components';

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 's' | 'm' | 'l';
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
        background: ${({ theme }) => theme.colors.background.secondary};
        color: ${({ theme }) => theme.colors.text.primary};
        border: ${({ theme }) => `${theme.spacing.xs} solid transparent`};

        &:hover:not(:disabled) {
          background: ${({ theme }) => theme.colors.background.hover};
        }
      `;
    case 'outline':
      return css`
        background: transparent;
        color: ${({ theme }) => theme.colors.text.primary};
        border: 1.5px solid ${({ theme }) => theme.colors.border.primary};

        &:hover:not(:disabled) {
          border-color: ${({ theme }) => theme.colors.border.active};
        }
      `;
    default: // primary
      return css`
        background: ${({ theme }) => theme.colors.primary};
        color: ${({ theme }) => theme.colors.text.inverse};
        border: none;

        &:hover:not(:disabled) {
          background: ${({ theme }) => theme.colors.grey[700]};
        }
      `;
  }
};

const getSizeStyles = (size: string) => {
  switch (size) {
    case 's':
      return css`
        height: 34px;
        padding: 6px 16px;
        font-size: ${({ theme }) => theme.typography.fontSize.xs};
      `;
    case 'l':
      return css`
        height: 58px;
        padding: 18px 24px;
        font-size: ${({ theme }) => theme.typography.fontSize.m};
      `;
    default: // m
      return css`
        height: 46px;
        padding: 12px 24px;
        font-size: ${({ theme }) => theme.typography.fontSize.s};
      `;
  }
};

const StyledButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !['variant', 'size', 'fullWidth', 'loading'].includes(prop),
})<Omit<ButtonProps, 'children'>>`
  border-radius: ${({ theme }) => theme.borderRadius.round};
  font-family: ${({ theme }) => theme.typography.fontFamily.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal} cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  white-space: nowrap;

  ${({ variant = 'primary' }) => getVariantStyles(variant)}
  ${({ size = 'm' }) => getSizeStyles(size)}

  ${({ fullWidth }) =>
    fullWidth &&
    css`
      width: 100%;
    `}

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.6;
      cursor: not-allowed;
      background: ${({ theme }) => theme.colors.background.disabled};
      color: ${({ theme }) => theme.colors.text.disabled};
    `}

  ${({ loading }) =>
    loading &&
    css`
      opacity: 0.7;
      cursor: not-allowed;
      position: relative;

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
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    `}

  &:active:not(:disabled) {
    transform: scale(0.98);
  }
`;

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'm',
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

export default Button;
