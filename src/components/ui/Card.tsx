import React from 'react';
import styled, { css } from 'styled-components';

export interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 's' | 'm' | 'l';
  hoverable?: boolean;
  onClick?: () => void;
  className?: string;
}

const getPaddingStyles = (padding: string) => {
  switch (padding) {
    case 's':
      return css`
        padding: ${({ theme }) => theme.spacing.m};
      `;
    case 'l':
      return css`
        padding: ${({ theme }) => theme.spacing.xl};
      `;
    default: // m
      return css`
        padding: ${({ theme }) => theme.spacing.l};
      `;
  }
};

const getVariantStyles = (variant: string) => {
  switch (variant) {
    case 'elevated':
      return css`
        background: ${({ theme }) => theme.colors.background.primary};
        border: none;
        box-shadow: ${({ theme }) => theme.shadows.default};
      `;
    case 'outlined':
      return css`
        background: ${({ theme }) => theme.colors.background.primary};
        border: 1.5px solid ${({ theme }) => theme.colors.border.secondary};
        box-shadow: none;
      `;
    default: // default
      return css`
        background: ${({ theme }) => theme.colors.background.secondary};
        border: none;
        box-shadow: none;
      `;
  }
};

const StyledCard = styled.div.withConfig({
  shouldForwardProp: (prop) => !['variant', 'padding', 'hoverable'].includes(prop),
})<Omit<CardProps, 'children'>>`
  border-radius: ${({ theme }) => theme.borderRadius.m};
  transition: all ${({ theme }) => theme.transitions.normal};

  ${({ variant = 'default' }) => getVariantStyles(variant)}
  ${({ padding = 'm' }) => getPaddingStyles(padding)}

  ${({ hoverable, onClick }) =>
    (hoverable || onClick) &&
    css`
      cursor: pointer;

      &:hover {
        transform: translateY(-2px);
        box-shadow: ${({ theme }) => theme.shadows.default};
      }

      &:active {
        transform: translateY(0);
      }
    `}
`;

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'm',
  hoverable = false,
  onClick,
  className,
  ...props
}) => {
  return (
    <StyledCard
      variant={variant}
      padding={padding}
      hoverable={hoverable}
      onClick={onClick}
      className={className}
      {...props}
    >
      {children}
    </StyledCard>
  );
};

export default Card;
