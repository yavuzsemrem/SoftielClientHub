import { createContext, useContext, useState, ReactNode } from 'react';
import { ClientUser } from '@/types';

interface SessionState {
  user: ClientUser | null;
  setUser: (user: ClientUser | null) => void;
  clearSession: () => void;
}

const SessionContext = createContext<SessionState | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ClientUser | null>(null);

  const clearSession = () => {
    setUser(null);
  };

  return (
    <SessionContext.Provider value={{ user, setUser, clearSession }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSessionStore(): SessionState {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSessionStore must be used within SessionProvider');
  }
  return context;
}

