import React from "react";
import styled from "styled-components";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { Button } from "../ui/Button";
import { IconButton } from "../ui/IconButton";

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

const SaveButtonWrapper = styled.div`
  button {
    min-width: 80px;

    @media (max-width: 768px) {
      min-width: 70px;
    }
  }
`;

export const EditHeaderBar: React.FC<EditHeaderBarProps> = ({
  title,
  onBack,
  onSave,
  saveLabel = "Save",
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
            <IconButton onClick={onBack} variant="ghost" aria-label="Go back">
              <ChevronLeftIcon />
            </IconButton>
          )}
        </LeftSection>

        <CenterSection>
          <Title>{title}</Title>
        </CenterSection>

        <RightSection>
          {showSaveButton && onSave && (
            <SaveButtonWrapper>
              <Button
                onClick={onSave}
                disabled={saveDisabled || saveLoading}
                loading={saveLoading}
                size="s"
              >
                {saveLabel}
              </Button>
            </SaveButtonWrapper>
          )}
        </RightSection>
      </InnerContainer>
    </Container>
  );
};

export default EditHeaderBar;
