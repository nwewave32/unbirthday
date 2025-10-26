import React, { useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

export interface FullScreenOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  className?: string;
}

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const zoomIn = keyframes`
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(17, 17, 17, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: ${fadeIn} ${({ theme }) => theme.transitions.normal} ease-out;
  backdrop-filter: blur(8px);
`;

const ContentWrapper = styled.div`
  position: relative;
  max-width: 95vw;
  max-height: 95vh;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${zoomIn} ${({ theme }) => theme.transitions.normal} ease-out;
`;

const Content = styled.div`
  max-width: 100%;
  max-height: 95vh;
  display: flex;
  align-items: center;
  justify-content: center;

  img,
  video {
    max-width: 100%;
    max-height: 95vh;
    object-fit: contain;
    border-radius: ${({ theme }) => theme.borderRadius.m};
  }
`;

const CloseButton = styled.button`
  position: fixed;
  top: ${({ theme }) => theme.spacing.l};
  right: ${({ theme }) => theme.spacing.l};
  background: ${({ theme }) => theme.colors.white};
  border: none;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  font-size: 28px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.black};
  box-shadow: ${({ theme }) => theme.shadows.default};
  transition: all ${({ theme }) => theme.transitions.fast};
  z-index: 2001;

  &:hover {
    transform: scale(1.1);
    background: ${({ theme }) => theme.colors.grey[100]};
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 24px;
    top: ${({ theme }) => theme.spacing.m};
    right: ${({ theme }) => theme.spacing.m};
  }
`;

const NavigationButton = styled.button<{ direction: 'prev' | 'next' }>`
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  ${({ direction }) => (direction === 'prev' ? 'left: 24px;' : 'right: 24px;')}
  background: ${({ theme }) => theme.colors.white};
  border: none;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.black};
  box-shadow: ${({ theme }) => theme.shadows.default};
  transition: all ${({ theme }) => theme.transitions.fast};
  z-index: 2001;

  &:hover {
    transform: translateY(-50%) scale(1.1);
    background: ${({ theme }) => theme.colors.grey[100]};
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    &:hover {
      transform: translateY(-50%);
    }
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 20px;
    ${({ direction }) => (direction === 'prev' ? 'left: 16px;' : 'right: 16px;')}
  }
`;

const Caption = styled.div`
  position: fixed;
  bottom: ${({ theme }) => theme.spacing.xxl};
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.95);
  padding: ${({ theme }) => theme.spacing.m} ${({ theme }) => theme.spacing.l};
  border-radius: ${({ theme }) => theme.borderRadius.round};
  font-family: ${({ theme }) => theme.typography.fontFamily.base};
  font-size: ${({ theme }) => theme.typography.fontSize.s};
  color: ${({ theme }) => theme.colors.black};
  max-width: 80%;
  text-align: center;
  box-shadow: ${({ theme }) => theme.shadows.default};

  @media (max-width: 768px) {
    bottom: ${({ theme }) => theme.spacing.l};
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
  }
`;

export interface FullScreenOverlayWithNavigationProps extends FullScreenOverlayProps {
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
  caption?: string;
}

export const FullScreenOverlay: React.FC<FullScreenOverlayWithNavigationProps> = ({
  isOpen,
  onClose,
  children,
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEsc = true,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
  caption,
  className,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scroll
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
      if (e.key === 'ArrowLeft' && onPrevious && hasPrevious) {
        onPrevious();
      }
      if (e.key === 'ArrowRight' && onNext && hasNext) {
        onNext();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEsc, onClose, onPrevious, onNext, hasPrevious, hasNext]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <Overlay ref={overlayRef} onClick={handleOverlayClick} className={className}>
      {showCloseButton && (
        <CloseButton onClick={onClose} aria-label="Close overlay">
          ×
        </CloseButton>
      )}

      {onPrevious && (
        <NavigationButton
          direction="prev"
          onClick={onPrevious}
          disabled={!hasPrevious}
          aria-label="Previous"
        >
          ‹
        </NavigationButton>
      )}

      <ContentWrapper>
        <Content>{children}</Content>
      </ContentWrapper>

      {onNext && (
        <NavigationButton
          direction="next"
          onClick={onNext}
          disabled={!hasNext}
          aria-label="Next"
        >
          ›
        </NavigationButton>
      )}

      {caption && <Caption>{caption}</Caption>}
    </Overlay>
  );
};

export default FullScreenOverlay;
