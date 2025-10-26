import React from 'react';
import styled from 'styled-components';

export interface TypographyProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body1' | 'body2' | 'body3' | 'caption';
  weight?: 'regular' | 'medium' | 'bold';
  color?: 'primary' | 'secondary' | 'disabled' | 'inverse';
  align?: 'left' | 'center' | 'right';
  className?: string;
  as?: React.ElementType;
  style?: React.CSSProperties;
}

const StyledText = styled.p.withConfig({
  shouldForwardProp: (prop) => !['variant', 'weight', 'color', 'align'].includes(prop),
})<Omit<TypographyProps, 'children'>>`
  margin: 0;
  padding: 0;
  font-family: ${({ variant }) =>
    variant === 'h1' || variant === 'h2' || variant === 'h3' || variant === 'h4'
      ? ({ theme }) => theme.typography.fontFamily.display
      : ({ theme }) => theme.typography.fontFamily.base};

  font-size: ${({ variant, theme }) => {
    switch (variant) {
      case 'h1':
        return theme.typography.fontSize.xxxl;
      case 'h2':
        return theme.typography.fontSize.xxl;
      case 'h3':
        return theme.typography.fontSize.xl;
      case 'h4':
        return theme.typography.fontSize.l;
      case 'body1':
        return theme.typography.fontSize.s;
      case 'body2':
        return theme.typography.fontSize.xs;
      case 'body3':
        return '12px';
      case 'caption':
        return '12px';
      default:
        return theme.typography.fontSize.s;
    }
  }};

  font-weight: ${({ weight, theme }) => {
    switch (weight) {
      case 'bold':
        return theme.typography.fontWeight.bold;
      case 'medium':
        return theme.typography.fontWeight.medium;
      default:
        return theme.typography.fontWeight.regular;
    }
  }};

  color: ${({ color, theme }) => {
    switch (color) {
      case 'secondary':
        return theme.colors.text.secondary;
      case 'disabled':
        return theme.colors.text.disabled;
      case 'inverse':
        return theme.colors.text.inverse;
      default:
        return theme.colors.text.primary;
    }
  }};

  text-align: ${({ align }) => align || 'left'};

  line-height: ${({ variant }) => {
    switch (variant) {
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
        return 1.2;
      default:
        return 1.5;
    }
  }};
`;

export const Typography: React.FC<TypographyProps> = ({
  children,
  variant = 'body1',
  weight = 'regular',
  color = 'primary',
  align = 'left',
  className,
  as,
  style,
  ...props
}) => {
  const defaultAs = (() => {
    if (as) return as;
    switch (variant) {
      case 'h1':
        return 'h1';
      case 'h2':
        return 'h2';
      case 'h3':
        return 'h3';
      case 'h4':
        return 'h4';
      case 'caption':
        return 'span';
      default:
        return 'p';
    }
  })();

  return (
    <StyledText
      as={defaultAs}
      variant={variant}
      weight={weight}
      color={color}
      align={align}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </StyledText>
  );
};

export default Typography;
