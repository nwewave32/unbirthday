import React from "react";
import styled, { css } from "styled-components";

export interface IconButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "secondary" | "ghost";
  size?: "s" | "m" | "l";
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
  "aria-label"?: string;
}

const getVariantStyles = (variant: string) => {
  switch (variant) {
    case "secondary":
      return css`
        background: ${({ theme }) => theme.colors.background.secondary};
        color: ${({ theme }) => theme.colors.text.primary};

        &:hover:not(:disabled)::before {
          background: ${({ theme }) => theme.colors.background.hover};
        }
      `;
    case "ghost":
      return css`
        background: transparent;
        color: ${({ theme }) => theme.colors.text.primary};

        &:hover:not(:disabled)::before {
          background: ${({ theme }) => theme.colors.background.hover};
        }
      `;
    default: // default
      return css`
        background: ${({ theme }) => theme.colors.primary};
        color: ${({ theme }) => theme.colors.white};

        &:hover:not(:disabled) {
          background: ${({ theme }) => theme.colors.grey[700]};
        }
      `;
  }
};

const getSizeStyles = (size: string) => {
  switch (size) {
    case "s":
      return css`
        width: 32px;
        height: 32px;
        min-width: 32px;
        min-height: 32px;
        max-width: 32px;
        max-height: 32px;
        padding: ${({ theme }) => theme.spacing.xs};

        svg {
          width: 20px;
          height: 20px;
        }
      `;
    case "l":
      return css`
        width: 48px;
        height: 48px;
        min-width: 48px;
        min-height: 48px;
        max-width: 48px;
        max-height: 48px;
        padding: ${({ theme }) => theme.spacing.m};

        svg {
          width: 28px;
          height: 28px;
        }
      `;
    default: // m
      return css`
        width: 40px;
        height: 40px;
        min-width: 40px;
        min-height: 40px;
        max-width: 40px;
        max-height: 40px;
        padding: ${({ theme }) => theme.spacing.s};

        svg {
          width: 24px;
          height: 24px;
        }
      `;
  }
};

const StyledIconButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !["variant", "size"].includes(prop),
})<Omit<IconButtonProps, "children">>`
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.s};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  align-self: flex-start;
  position: relative;

  &:focus {
    outline: none;
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: ${({ theme }) => theme.borderRadius.s};
    background: transparent;
    transition: background ${({ theme }) => theme.transitions.fast};
  }

  ${({ variant = "default" }) => getVariantStyles(variant)}
  ${({ size = "m" }) => getSizeStyles(size)}

  svg {
    position: relative;
    z-index: 1;
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.6;
      cursor: not-allowed;
      background: ${({ theme }) => theme.colors.background.disabled};
      color: ${({ theme }) => theme.colors.text.disabled};
    `}
`;

export const IconButton: React.FC<IconButtonProps> = ({
  children,
  onClick,
  variant = "default",
  size = "m",
  disabled = false,
  type = "button",
  className,
  "aria-label": ariaLabel,
  ...props
}) => {
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  return (
    <StyledIconButton
      type={type}
      onClick={handleClick}
      variant={variant}
      size={size}
      disabled={disabled}
      className={className}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </StyledIconButton>
  );
};

export default IconButton;
