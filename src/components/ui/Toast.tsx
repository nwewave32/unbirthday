import React, { useCallback, useEffect, useState } from "react";
import styled, { css, keyframes } from "styled-components";
import { ToastContext, type ToastVariant } from "../../context/ToastContext";

export type { ToastVariant } from "../../context/ToastContext";

export interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
  duration?: number;
}

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const ToastContainer = styled.div`
  position: fixed;
  top: ${({ theme }) => theme.spacing.l};
  right: ${({ theme }) => theme.spacing.l};
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.m};
  pointer-events: none;
`;

const getVariantStyles = (variant: ToastVariant) => {
  switch (variant) {
    case "success":
      return css`
        background: ${({ theme }) => theme.colors.success};
        color: ${({ theme }) => theme.colors.white};
      `;
    case "error":
      return css`
        background: ${({ theme }) => theme.colors.error};
        color: ${({ theme }) => theme.colors.white};
      `;
    case "warning":
      return css`
        background: ${({ theme }) => theme.colors.warning};
        color: ${({ theme }) => theme.colors.black};
      `;
    case "info":
      return css`
        background: ${({ theme }) => theme.colors.blue};
        color: ${({ theme }) => theme.colors.white};
      `;
    default:
      return css`
        background: ${({ theme }) => theme.colors.black};
        color: ${({ theme }) => theme.colors.white};
      `;
  }
};

const ToastItem = styled.div<{ variant: ToastVariant; isExiting?: boolean }>`
  min-width: 300px;
  max-width: 500px;
  padding: ${({ theme }) => theme.spacing.m} ${({ theme }) => theme.spacing.l};
  border-radius: ${({ theme }) => theme.borderRadius.m};
  box-shadow: ${({ theme }) => theme.shadows.default};
  font-family: ${({ theme }) => theme.typography.fontFamily.base};
  font-size: ${({ theme }) => theme.typography.fontSize.s};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  pointer-events: auto;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.m};

  ${({ variant }) => getVariantStyles(variant)}

  animation: ${({ isExiting }) => (isExiting ? slideOut : slideIn)}
    ${({ theme }) => theme.transitions.normal} cubic-bezier(0.4, 0, 0.2, 1);
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: inherit;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.8;
  transition: opacity ${({ theme }) => theme.transitions.fast};

  &:hover {
    opacity: 1;
  }
`;

interface ToastItemComponentProps {
  toast: Toast;
  onClose: (id: string) => void;
}

const ToastItemComponent: React.FC<ToastItemComponentProps> = ({
  toast,
  onClose,
}) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(toast.id);
    }, 250);
  }, [onClose, toast.id]);

  useEffect(() => {
    if (toast.duration) {
      const timer = setTimeout(() => {
        handleClose();
      }, toast.duration);

      return () => clearTimeout(timer);
    }
  }, [toast.duration, handleClose]);

  return (
    <ToastItem
      variant={toast.variant}
      isExiting={isExiting}
      onClick={handleClose}
    >
      <span>{toast.message}</span>
      <CloseButton onClick={handleClose}>×</CloseButton>
    </ToastItem>
  );
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (
      message: string,
      variant: ToastVariant = "info",
      duration: number = 3000
    ) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: Toast = { id, message, variant, duration };
      setToasts((prev) => [...prev, newToast]);
    },
    []
  );

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <ToastContainer>
        {toasts.map((toast) => (
          <ToastItemComponent
            key={toast.id}
            toast={toast}
            onClose={hideToast}
          />
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
