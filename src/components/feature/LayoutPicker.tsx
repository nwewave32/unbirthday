import React from 'react';
import styled from 'styled-components';

export type LayoutType = 'grid' | 'masonry';
export type HeroStyle = 'full' | 'split' | 'minimal' | 'none';

export interface LayoutOption {
  id: LayoutType;
  name: string;
  description: string;
  icon: React.ReactNode;
}

export interface HeroOption {
  id: HeroStyle;
  name: string;
  description: string;
  preview: React.ReactNode;
}

export interface LayoutPickerProps {
  layoutType: LayoutType;
  heroStyle: HeroStyle;
  onLayoutChange: (layout: LayoutType) => void;
  onHeroStyleChange: (style: HeroStyle) => void;
  className?: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
  width: 100%;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.m};
`;

const Label = styled.label`
  font-family: ${({ theme }) => theme.typography.fontFamily.base};
  font-size: ${({ theme }) => theme.typography.fontSize.s};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Description = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily.base};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
`;

const OptionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.m};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const OptionCard = styled.button<{ selected?: boolean }>`
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

const IconWrapper = styled.div<{ selected?: boolean }>`
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme, selected }) =>
    selected ? theme.colors.background.secondary : theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.s};
  color: ${({ theme, selected }) => (selected ? theme.colors.primary : theme.colors.text.secondary)};

  svg {
    width: 48px;
    height: 48px;
  }
`;

const OptionInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const OptionName = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily.base};
  font-size: ${({ theme }) => theme.typography.fontSize.s};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const OptionDescription = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily.base};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const SelectedBadge = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacing.s};
  right: ${({ theme }) => theme.spacing.s};
  background: ${({ theme }) => theme.colors.success};
  color: ${({ theme }) => theme.colors.white};
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.s};
  font-family: ${({ theme }) => theme.typography.fontFamily.base};
  font-size: 10px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const HeroPreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: ${({ theme }) => theme.spacing.m};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const HeroPreviewCard = styled.button<{ selected?: boolean }>`
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
  position: relative;

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

const PreviewWrapper = styled.div`
  width: 100%;
  height: 120px;
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.s};
  overflow: hidden;
`;

// Layout Icons
const GridIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
    />
  </svg>
);

const MasonryIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 14a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1h-4a1 1 0 01-1-1v-5z"
    />
  </svg>
);

// Hero Preview Components
const HeroFullPreview = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  font-weight: bold;
`;

const HeroSplitPreview = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2px;

  & > div:first-child {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  & > div:last-child {
    background: #f5f5f5;
  }
`;

const HeroMinimalPreview = styled.div`
  width: 100%;
  height: 100%;
  background: #ffffff;
  border: 2px solid #e5e5e5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #707072;
  font-size: 10px;
`;

const HeroNonePreview = styled.div`
  width: 100%;
  height: 100%;
  background: #fafafa;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9e9ea0;
  font-size: 10px;
`;

const layoutOptions: LayoutOption[] = [
  {
    id: 'grid',
    name: 'Grid Layout',
    description: 'Equal-sized cards in a uniform grid',
    icon: <GridIcon />,
  },
  {
    id: 'masonry',
    name: 'Masonry Layout',
    description: 'Varying heights for a dynamic look',
    icon: <MasonryIcon />,
  },
];

const heroOptions: HeroOption[] = [
  {
    id: 'full',
    name: 'Full Hero',
    description: 'Large hero section with image/video',
    preview: <HeroFullPreview>HERO</HeroFullPreview>,
  },
  {
    id: 'split',
    name: 'Split Hero',
    description: 'Image on one side, content on other',
    preview: (
      <HeroSplitPreview>
        <div />
        <div />
      </HeroSplitPreview>
    ),
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Small header with title only',
    preview: <HeroMinimalPreview>Title</HeroMinimalPreview>,
  },
  {
    id: 'none',
    name: 'No Hero',
    description: 'Jump straight to content',
    preview: <HeroNonePreview>Content</HeroNonePreview>,
  },
];

export const LayoutPicker: React.FC<LayoutPickerProps> = ({
  layoutType,
  heroStyle,
  onLayoutChange,
  onHeroStyleChange,
  className,
}) => {
  return (
    <Container className={className}>
      {/* Layout Type Selection */}
      <Section>
        <Label>Layout Style</Label>
        <Description>Choose how your content cards will be arranged</Description>
        <OptionGrid>
          {layoutOptions.map((option) => {
            const isSelected = layoutType === option.id;

            return (
              <OptionCard
                key={option.id}
                selected={isSelected}
                onClick={() => onLayoutChange(option.id)}
                type="button"
              >
                {isSelected && <SelectedBadge>Selected</SelectedBadge>}
                <IconWrapper selected={isSelected}>{option.icon}</IconWrapper>
                <OptionInfo>
                  <OptionName>{option.name}</OptionName>
                  <OptionDescription>{option.description}</OptionDescription>
                </OptionInfo>
              </OptionCard>
            );
          })}
        </OptionGrid>
      </Section>

      {/* Hero Style Selection */}
      <Section>
        <Label>Hero Section</Label>
        <Description>Choose the style for the top of your page</Description>
        <HeroPreviewGrid>
          {heroOptions.map((option) => {
            const isSelected = heroStyle === option.id;

            return (
              <HeroPreviewCard
                key={option.id}
                selected={isSelected}
                onClick={() => onHeroStyleChange(option.id)}
                type="button"
              >
                {isSelected && <SelectedBadge>Selected</SelectedBadge>}
                <PreviewWrapper>{option.preview}</PreviewWrapper>
                <OptionInfo>
                  <OptionName>{option.name}</OptionName>
                  <OptionDescription>{option.description}</OptionDescription>
                </OptionInfo>
              </HeroPreviewCard>
            );
          })}
        </HeroPreviewGrid>
      </Section>
    </Container>
  );
};

export default LayoutPicker;
