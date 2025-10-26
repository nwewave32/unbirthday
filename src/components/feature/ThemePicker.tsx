import React from 'react';
import styled from 'styled-components';
import { Badge } from '../ui/Badge';

export interface ThemeOption {
  id: string;
  name: string;
  background: string;
  textColor: string;
  fontFamily: string;
  preview?: {
    heading: string;
    body: string;
  };
}

export interface ThemePickerProps {
  themes: ThemeOption[];
  selectedThemeId?: string;
  onSelect: (themeId: string) => void;
  className?: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.m};
  width: 100%;
`;

const Label = styled.label`
  font-family: ${({ theme }) => theme.typography.fontFamily.base};
  font-size: ${({ theme }) => theme.typography.fontSize.s};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ThemeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.m};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ThemeCard = styled.button<{ selected?: boolean }>`
  background: ${({ theme }) => theme.colors.background.primary};
  border: 2px solid
    ${({ theme, selected }) => (selected ? theme.colors.border.active : theme.colors.border.secondary)};
  border-radius: ${({ theme }) => theme.borderRadius.m};
  padding: ${({ theme }) => theme.spacing.m};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.m};
  text-align: left;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: ${({ theme }) => theme.colors.border.primary};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.default};
  }

  &:active {
    transform: translateY(0);
  }

  ${({ selected, theme }) =>
    selected &&
    `
    border-color: ${theme.colors.border.active};
    box-shadow: 0 0 0 4px rgba(17, 17, 17, 0.12);
  `}
`;

const ThemePreview = styled.div<{ background: string; textColor: string }>`
  width: 100%;
  height: 120px;
  background: ${({ background }) => background};
  border-radius: ${({ theme }) => theme.borderRadius.s};
  padding: ${({ theme }) => theme.spacing.m};
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.s};
  color: ${({ textColor }) => textColor};
  position: relative;
  overflow: hidden;
`;

const PreviewHeading = styled.div<{ fontFamily: string }>`
  font-family: ${({ fontFamily }) => fontFamily};
  font-size: ${({ theme }) => theme.typography.fontSize.l};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

const PreviewBody = styled.div<{ fontFamily: string }>`
  font-family: ${({ fontFamily }) => fontFamily};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  opacity: 0.9;
`;

const ThemeInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const ThemeName = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily.base};
  font-size: ${({ theme }) => theme.typography.fontSize.s};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ThemeDetails = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily.base};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const SelectedBadgeWrapper = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacing.s};
  right: ${({ theme }) => theme.spacing.s};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const CheckIcon = () => (
  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);

export const ThemePicker: React.FC<ThemePickerProps> = ({
  themes,
  selectedThemeId,
  onSelect,
  className,
}) => {
  return (
    <Container className={className}>
      <Label>Choose a Theme</Label>
      <ThemeGrid>
        {themes.map((theme) => {
          const isSelected = selectedThemeId === theme.id;

          return (
            <ThemeCard
              key={theme.id}
              selected={isSelected}
              onClick={() => onSelect(theme.id)}
              type="button"
            >
              <ThemePreview background={theme.background} textColor={theme.textColor}>
                {isSelected && (
                  <SelectedBadgeWrapper>
                    <Badge variant="success" size="s">
                      <CheckIcon />
                      Selected
                    </Badge>
                  </SelectedBadgeWrapper>
                )}
                <PreviewHeading fontFamily={theme.fontFamily}>
                  {theme.preview?.heading || 'Happy Birthday!'}
                </PreviewHeading>
                <PreviewBody fontFamily={theme.fontFamily}>
                  {theme.preview?.body || 'This is how your card will look'}
                </PreviewBody>
              </ThemePreview>

              <ThemeInfo>
                <ThemeName>{theme.name}</ThemeName>
                <ThemeDetails>
                  Background: {theme.background} • Font: {theme.fontFamily.split(',')[0]}
                </ThemeDetails>
              </ThemeInfo>
            </ThemeCard>
          );
        })}
      </ThemeGrid>
    </Container>
  );
};

export default ThemePicker;
