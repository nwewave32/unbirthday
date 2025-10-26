import React from 'react';
import styled from 'styled-components';

export interface EditHeaderBarProps {
  title: string;
  onBack?: () => void;
  onSave?: () => void;
  saveLabel?: string;
  saveDisabled?: boolean;
  saveLoading?: boolean;
  showBackButton?: boolean;
  showSaveButton?: boolean;
  className?: string;
}

const Container = styled.header`
  width: 100%;
  background: ${({ theme }) => theme.colors.background.primary};
  border-bottom: 1.5px solid ${({ theme }) => theme.colors.border.secondary};
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: ${({ theme }) => theme.shadows.default};
`;

const InnerContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.m} ${({ theme }) => theme.spacing.l};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.m};
  min-height: 64px;

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.m};
    min-height: 56px;
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.m};
  flex: 0 1 auto;
`;

const CenterSection = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  min-width: 0;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.m};
  flex: 0 1 auto;
`;

const BackButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.s};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.primary};
  transition: all ${({ theme }) => theme.transitions.fast};
  border-radius: ${({ theme }) => theme.borderRadius.s};
  width: 40px;
  height: 40px;

  &:hover {
    background: ${({ theme }) => theme.colors.background.hover};
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.typography.fontFamily.display};
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.typography.fontSize.l};
  }
`;

const SaveButton = styled.button<{ loading?: boolean }>`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.text.inverse};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.round};
  padding: ${({ theme }) => `${theme.spacing.s} ${theme.spacing.l}`};
  font-family: ${({ theme }) => theme.typography.fontFamily.base};
  font-size: ${({ theme }) => theme.typography.fontSize.s};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.s};
  min-width: 80px;
  height: 40px;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.grey[700]};
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: ${({ theme }) => theme.colors.background.disabled};
    color: ${({ theme }) => theme.colors.text.disabled};
  }

  ${({ loading }) =>
    loading &&
    `
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

  @media (max-width: 768px) {
    padding: ${({ theme }) => `${theme.spacing.s} ${theme.spacing.m}`};
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
    min-width: 70px;
  }
`;

const BackIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

export const EditHeaderBar: React.FC<EditHeaderBarProps> = ({
  title,
  onBack,
  onSave,
  saveLabel = 'Save',
  saveDisabled = false,
  saveLoading = false,
  showBackButton = true,
  showSaveButton = true,
  className,
}) => {
  return (
    <Container className={className}>
      <InnerContainer>
        <LeftSection>
          {showBackButton && onBack && (
            <BackButton onClick={onBack} aria-label="Go back">
              <BackIcon />
            </BackButton>
          )}
        </LeftSection>

        <CenterSection>
          <Title>{title}</Title>
        </CenterSection>

        <RightSection>
          {showSaveButton && onSave && (
            <SaveButton onClick={onSave} disabled={saveDisabled || saveLoading} loading={saveLoading}>
              {saveLabel}
            </SaveButton>
          )}
        </RightSection>
      </InnerContainer>
    </Container>
  );
};

export default EditHeaderBar;
