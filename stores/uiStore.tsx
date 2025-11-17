import { createContext, useContext, useState, ReactNode } from 'react';

interface UIState {
  theme: 'light' | 'dark';
  isLoading: boolean;
  setTheme: (theme: 'light' | 'dark') => void;
  setLoading: (loading: boolean) => void;
}

const UIContext = createContext<UIState | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isLoading, setLoading] = useState(false);

  return (
    <UIContext.Provider value={{ theme, isLoading, setTheme, setLoading }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUIStore(): UIState {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUIStore must be used within UIProvider');
  }
  return context;
}

