import React, {createContext, useContext, useState, useCallback} from 'react';
import Toast from './Toast';

type ToastType = 'success' | 'error' | 'info';

interface ToastData {
  message: string;
  type?: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

export const useToast = () => useContext(ToastContext);

export const ToastProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [toast, setToast] = useState<ToastData | null>(null);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    setToast({message, type});
    setTimeout(() => setToast(null), 3000);
  }, []);

  return (
    <ToastContext.Provider value={{showToast}}>
      {children}
      {toast ? <Toast message={toast.message} type={toast.type} /> : null}
    </ToastContext.Provider>
  );
};
