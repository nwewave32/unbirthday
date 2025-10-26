import { createContext } from 'react';

export type ToastVariant = 'success' | 'error' | 'info' | 'warning';

export interface ToastContextType {
  showToast: (message: string, variant?: ToastVariant, duration?: number) => void;
  hideToast: (id: string) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);
