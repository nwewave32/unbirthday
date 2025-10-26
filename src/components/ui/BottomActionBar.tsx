import React from 'react';
import styled, { css } from 'styled-components';

export interface ActionButton {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
}

export interface BottomActionBarProps {
  actions: ActionButton[];
  fixed?: boolean;
  className?: string;
  backgroundColor?: string;
}

const Container = styled.div<{ fixed?: boolean; backgroundColor?: string }>`
  width: 100%;
  background: ${({ backgroundColor, theme }) => backgroundColor || theme.colors.background.primary};
  border-top: 1.5px solid ${({ theme }) => theme.colors.border.secondary};
  box-shadow: 0 -4px 8px 0 rgba(17, 17, 17, 0.06), 0 0 24px 4px rgba(17, 17, 17, 0.03);
  z-index: 100;

  ${({ fixed }) =>
    fixed &&
    css`
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
    `}
`;

const InnerContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.m} ${({ theme }) => theme.spacing.l};
  display: flex;
  gap: ${({ theme }) => theme.spacing.m};
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.m};
    gap: ${({ theme }) => theme.spacing.s};
  }
`;

const getVariantStyles = (variant: string) => {
  switch (variant) {
    case 'secondary':
      return css`
        background: ${({ theme }) => theme.colors.background.secondary};
        color: ${({ theme }) => theme.colors.text.primary};
        border: none;

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
          background: ${({ theme }) => theme.colors.background.hover};
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

const ActionButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !['variant', 'loading'].includes(prop),
})<{ variant?: 'primary' | 'secondary' | 'outline'; loading?: boolean }>`
  flex: 1;
  min-width: 100px;
  max-width: 200px;
  height: 48px;
  padding: 0 ${({ theme }) => theme.spacing.l};
  border-radius: ${({ theme }) => theme.borderRadius.round};
  font-family: ${({ theme }) => theme.typography.fontFamily.base};
  font-size: ${({ theme }) => theme.typography.fontSize.s};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal} cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.s};
  white-space: nowrap;

  ${({ variant = 'primary' }) => getVariantStyles(variant)}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: ${({ theme }) => theme.colors.background.disabled};
    color: ${({ theme }) => theme.colors.text.disabled};
  }

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

  @media (max-width: 768px) {
    min-width: 80px;
    max-width: none;
    padding: 0 ${({ theme }) => theme.spacing.m};
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
  }
`;

const IconWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;

  svg {
    width: 100%;
    height: 100%;
  }

  @media (max-width: 768px) {
    width: 18px;
    height: 18px;
  }
`;

export const BottomActionBar: React.FC<BottomActionBarProps> = ({
  actions,
  fixed = true,
  className,
  backgroundColor,
}) => {
  return (
    <Container fixed={fixed} backgroundColor={backgroundColor} className={className}>
      <InnerContainer>
        {actions.map((action, index) => (
          <ActionButton
            key={index}
            variant={action.variant || 'primary'}
            onClick={action.onClick}
            disabled={action.disabled}
            loading={action.loading}
          >
            {action.icon && <IconWrapper>{action.icon}</IconWrapper>}
            <span>{action.label}</span>
          </ActionButton>
        ))}
      </InnerContainer>
    </Container>
  );
};

export default BottomActionBar;
