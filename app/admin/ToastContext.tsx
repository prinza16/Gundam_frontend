import React, { createContext, useContext } from 'react';
import { ShowToastFunction } from './layout';

const ToastContext = createContext<ShowToastFunction>(
  (message: string, type: 'success' | 'error' | 'info') => {
    console.warn("showToast was called without a provider. Did you wrap your component in AdminLayout?");
  }
);

export const useToast = () => {
  return useContext(ToastContext);
};

export const ToastProvider: React.FC<{ children: React.ReactNode; showToast: ShowToastFunction }> = ({
  children,
  showToast,
}) => {
  return (
    <ToastContext.Provider value={showToast}>
      {children}
    </ToastContext.Provider>
  );
};