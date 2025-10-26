import React, { useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 's' | 'm' | 'l';
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
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

const slideUp = keyframes`
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(17, 17, 17, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${({ theme }) => theme.spacing.l};
  animation: ${fadeIn} ${({ theme }) => theme.transitions.normal} ease-out;
  backdrop-filter: blur(4px);
`;

const ModalContainer = styled.div<{ size: 's' | 'm' | 'l' }>`
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.l};
  box-shadow: ${({ theme }) => theme.shadows.inverse};
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: ${slideUp} ${({ theme }) => theme.transitions.normal} ease-out;

  width: ${({ size }) => {
    switch (size) {
      case 's':
        return '400px';
      case 'l':
        return '800px';
      default:
        return '600px';
    }
  }};

  max-width: 100%;

  @media (max-width: 768px) {
    width: 100%;
    max-height: 100vh;
    border-radius: 0;
  }
`;

const ModalHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.l};
  border-bottom: 1.5px solid ${({ theme }) => theme.colors.border.secondary};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.fontFamily.display};
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  font-size: 28px;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  transition: all ${({ theme }) => theme.transitions.fast};
  border-radius: ${({ theme }) => theme.borderRadius.s};

  &:hover {
    background: ${({ theme }) => theme.colors.background.hover};
    color: ${({ theme }) => theme.colors.text.primary};
  }

  &:active {
    transform: scale(0.95);
  }
`;

const ModalBody = styled.div`
  padding: ${({ theme }) => theme.spacing.l};
  overflow-y: auto;
  flex: 1;
`;

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'm',
  closeOnOverlayClick = true,
  closeOnEsc = true,
  showCloseButton = true,
  className,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Store the previously focused element
      previousActiveElement.current = document.activeElement as HTMLElement;

      // Focus the modal
      modalRef.current?.focus();

      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scroll
      document.body.style.overflow = '';

      // Restore focus to the previously focused element
      previousActiveElement.current?.focus();
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEsc, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    // Focus trap
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    return () => document.removeEventListener('keydown', handleTabKey);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <Overlay onClick={handleOverlayClick}>
      <ModalContainer
        ref={modalRef}
        size={size}
        className={className}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        tabIndex={-1}
      >
        {(title || showCloseButton) && (
          <ModalHeader>
            {title && <ModalTitle id="modal-title">{title}</ModalTitle>}
            {showCloseButton && (
              <CloseButton onClick={onClose} aria-label="Close modal">
                ×
              </CloseButton>
            )}
          </ModalHeader>
        )}
        <ModalBody>{children}</ModalBody>
      </ModalContainer>
    </Overlay>
  );
};

export default Modal;
