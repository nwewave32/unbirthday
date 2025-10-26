import React from 'react';
import styled, { css } from 'styled-components';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 's' | 'm';
  className?: string;
}

const getVariantStyles = (variant: string) => {
  switch (variant) {
    case 'success':
      return css`
        background: ${({ theme }) => theme.colors.success};
        color: ${({ theme }) => theme.colors.white};
      `;
    case 'warning':
      return css`
        background: ${({ theme }) => theme.colors.warning};
        color: ${({ theme }) => theme.colors.black};
      `;
    case 'error':
      return css`
        background: ${({ theme }) => theme.colors.error};
        color: ${({ theme }) => theme.colors.white};
      `;
    case 'info':
      return css`
        background: ${({ theme }) => theme.colors.blue};
        color: ${({ theme }) => theme.colors.white};
      `;
    default:
      return css`
        background: ${({ theme }) => theme.colors.grey[200]};
        color: ${({ theme }) => theme.colors.text.primary};
      `;
  }
};

const getSizeStyles = (size: string) => {
  switch (size) {
    case 's':
      return css`
        padding: 2px 8px;
        font-size: 10px;
      `;
    default: // m
      return css`
        padding: 4px 12px;
        font-size: 12px;
      `;
  }
};

const StyledBadge = styled.span.withConfig({
  shouldForwardProp: (prop) => !['variant', 'size'].includes(prop),
})<Omit<BadgeProps, 'children'>>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.s};
  font-family: ${({ theme }) => theme.typography.fontFamily.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  white-space: nowrap;

  ${({ variant = 'default' }) => getVariantStyles(variant)}
  ${({ size = 'm' }) => getSizeStyles(size)}
`;

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'm',
  className,
  ...props
}) => {
  return (
    <StyledBadge variant={variant} size={size} className={className} {...props}>
      {children}
    </StyledBadge>
  );
};

export default Badge;
