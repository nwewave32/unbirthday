import React, { useState } from 'react';
import styled from 'styled-components';

export interface PageTitleEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  label?: string;
  error?: boolean;
  errorMessage?: string;
  className?: string;
}

export interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: boolean;
  errorMessage?: string;
  className?: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.m};
  width: 100%;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  width: 100%;
`;

const Label = styled.label`
  font-family: ${({ theme }) => theme.typography.fontFamily.base};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const StyledInput = styled.input<{ error?: boolean; hasValue?: boolean }>`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.m} ${({ theme }) => theme.spacing.l};
  border: none;
  border-bottom: 2px solid
    ${({ theme, error }) => (error ? theme.colors.error : theme.colors.border.secondary)};
  font-family: ${({ theme }) => theme.typography.fontFamily.display};
  font-size: ${({ theme }) => theme.typography.fontSize.xxxl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  background: transparent;
  transition: all ${({ theme }) => theme.transitions.fast};
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.disabled};
    font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
  }

  &:hover {
    border-bottom-color: ${({ theme, error }) =>
      error ? theme.colors.error : theme.colors.border.primary};
  }

  &:focus {
    border-bottom-color: ${({ theme, error }) =>
      error ? theme.colors.error : theme.colors.border.active};
  }

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.typography.fontSize.xxl};
    padding: ${({ theme }) => theme.spacing.s} ${({ theme }) => theme.spacing.m};
  }
`;

const DateInput = styled.input<{ error?: boolean }>`
  width: 100%;
  height: 56px;
  padding: 0 ${({ theme }) => theme.spacing.m};
  border-radius: ${({ theme }) => theme.borderRadius.s};
  border: 1.5px solid
    ${({ theme, error }) => (error ? theme.colors.error : theme.colors.border.secondary)};
  font-family: ${({ theme }) => theme.typography.fontFamily.base};
  font-size: ${({ theme }) => theme.typography.fontSize.m};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  background: ${({ theme }) => theme.colors.background.primary};
  transition: all ${({ theme }) => theme.transitions.fast};
  outline: none;

  &::-webkit-calendar-picker-indicator {
    cursor: pointer;
    filter: invert(0);
  }

  &:hover {
    border-color: ${({ theme, error }) =>
      error ? theme.colors.error : theme.colors.border.primary};
  }

  &:focus {
    border-color: ${({ theme, error }) => (error ? theme.colors.error : theme.colors.border.active)};
    box-shadow: 0 0 0 4px rgba(17, 17, 17, 0.12);
  }

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.typography.fontSize.s};
  }
`;

const ErrorMessage = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily.base};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.error};
`;

const CharacterCount = styled.span<{ isNearLimit?: boolean }>`
  font-family: ${({ theme }) => theme.typography.fontFamily.base};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme, isNearLimit }) =>
    isNearLimit ? theme.colors.warning : theme.colors.text.secondary};
  text-align: right;
`;

export const PageTitleEditor: React.FC<PageTitleEditorProps> = ({
  value,
  onChange,
  placeholder = 'Enter name...',
  maxLength = 50,
  label,
  error = false,
  errorMessage,
  className,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const characterCount = value.length;
  const isNearLimit = maxLength ? characterCount > maxLength * 0.8 : false;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (!maxLength || newValue.length <= maxLength) {
      onChange(newValue);
    }
  };

  return (
    <InputWrapper className={className}>
      {label && <Label>{label}</Label>}
      <StyledInput
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        error={error}
        hasValue={value.length > 0}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        maxLength={maxLength}
      />
      {(error && errorMessage) || (isFocused && maxLength) ? (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {error && errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          {isFocused && maxLength && (
            <CharacterCount isNearLimit={isNearLimit}>
              {characterCount} / {maxLength}
            </CharacterCount>
          )}
        </div>
      ) : null}
    </InputWrapper>
  );
};

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  label,
  error = false,
  errorMessage,
  className,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <InputWrapper className={className}>
      {label && <Label>{label}</Label>}
      <DateInput type="date" value={value} onChange={handleChange} error={error} />
      {error && errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </InputWrapper>
  );
};

// Combined component for birthday person name and date
export interface BirthdayEditorProps {
  name: string;
  date: string;
  onNameChange: (name: string) => void;
  onDateChange: (date: string) => void;
  nameLabel?: string;
  dateLabel?: string;
  namePlaceholder?: string;
  nameError?: boolean;
  dateError?: boolean;
  nameErrorMessage?: string;
  dateErrorMessage?: string;
  className?: string;
}

export const BirthdayEditor: React.FC<BirthdayEditorProps> = ({
  name,
  date,
  onNameChange,
  onDateChange,
  nameLabel = "Birthday Person's Name",
  dateLabel = 'Birthday Date',
  namePlaceholder = 'Enter name...',
  nameError = false,
  dateError = false,
  nameErrorMessage,
  dateErrorMessage,
  className,
}) => {
  return (
    <Container className={className}>
      <PageTitleEditor
        value={name}
        onChange={onNameChange}
        label={nameLabel}
        placeholder={namePlaceholder}
        error={nameError}
        errorMessage={nameErrorMessage}
      />
      <DatePicker
        value={date}
        onChange={onDateChange}
        label={dateLabel}
        error={dateError}
        errorMessage={dateErrorMessage}
      />
    </Container>
  );
};

export default PageTitleEditor;
