import React from "react";
import styled, { css } from "styled-components";

export interface InputProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: "text" | "email" | "password" | "number" | "tel" | "url" | "date";
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  label?: string;
  fullWidth?: boolean;
  className?: string;
  name?: string;
  id?: string;
  style?: React.CSSProperties;
}

const InputWrapper = styled.div<{ fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  ${({ fullWidth }) =>
    fullWidth &&
    css`
      width: 100%;
    `}
`;

const Label = styled.label`
  font-family: ${({ theme }) => theme.typography.fontFamily.base};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const StyledInput = styled.input<{ error?: boolean }>`
  height: 56px;
  padding: 0 ${({ theme }) => theme.spacing.m};
  border-radius: ${({ theme }) => theme.borderRadius.s};
  border: 1.5px solid ${({ theme }) => theme.colors.border.secondary};
  font-family: ${({ theme }) => theme.typography.fontFamily.base};
  font-size: ${({ theme }) => theme.typography.fontSize.s};
  color: ${({ theme }) => theme.colors.text.primary};
  background: ${({ theme }) => theme.colors.background.primary};
  transition: all ${({ theme }) => theme.transitions.fast};
  outline: none;
  width: 100%;

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.disabled};
  }

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.border.primary};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.border.active};
    box-shadow: 0 0 0 4px rgba(17, 17, 17, 0.12);
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.background.disabled};
    color: ${({ theme }) => theme.colors.text.disabled};
    cursor: not-allowed;
  }

  ${({ error }) =>
    error &&
    css`
      border-color: ${({ theme }) => theme.colors.error};

      &:focus {
        border-color: ${({ theme }) => theme.colors.error};
        box-shadow: 0 0 0 4px rgba(211, 0, 5, 0.12);
      }
    `}
`;

const ErrorMessage = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily.base};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.error};
`;

export const Input: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder,
  type = "text",
  disabled = false,
  error = false,
  errorMessage,
  label,
  fullWidth = false,
  className,
  name,
  id,
  style,
  ...props
}) => {
  return (
    <InputWrapper fullWidth={fullWidth} className={className} style={style}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <StyledInput
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        error={error}
        {...props}
      />
      {error && errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </InputWrapper>
  );
};

export default Input;
