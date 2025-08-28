import React, { createContext, useContext, useState, useEffect } from 'react';
import { sessionManager } from '../lib/SessionManager';

interface User {
  id: string;
  phone: string;
  email?: string;
  name?: string;
  selectedBranch?: string;
  deliveryAddress?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (phone: string, otp: string) => Promise<boolean>;
  logout: () => void;
  sendOTP: (phone: string) => Promise<boolean>;
  updateUser: (updates: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check for existing session
    const session = sessionManager.loadSession();
    if (session?.user) {
      setUser(session.user);
      console.log('👤 Restored user session from cache');
    }
  }, []);

  const sendOTP = async (phone: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In real implementation, call your OTP service
      console.log(`Sending OTP to ${phone}`);
      return true;
    } catch (error) {
      console.error('Failed to send OTP:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (phone: string, otp: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simple validation for demo (accept any 4-digit OTP)
      if (otp.length === 4) {
        const newUser: User = {
          id: Date.now().toString(),
          phone,
        };
        setUser(newUser);
        sessionManager.updateUser(newUser);
        // Keep legacy localStorage for backward compatibility
        localStorage.setItem('bigBossUser', JSON.stringify(newUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    sessionManager.updateUser(null);
    // Keep legacy localStorage for backward compatibility
    localStorage.removeItem('bigBossUser');
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      sessionManager.updateUser(updatedUser);
      // Keep legacy localStorage for backward compatibility
      localStorage.setItem('bigBossUser', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout,
      sendOTP,
      updateUser,
      isLoading,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};