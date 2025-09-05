'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (fid: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Check for existing session on mount
  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    try {
      const storedUser = localStorage.getItem('educonnect_user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        
        // Verify user still exists in database
        const response = await fetch(`/api/auth/farcaster?fid=${userData.farcasterId}`);
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setUser({
              userId: result.user.id,
              farcasterId: result.user.farcaster_id,
              displayName: result.user.display_name,
              bio: result.user.bio || '',
              interests: result.user.interests || [],
              courses: result.user.courses || [],
              avatar: result.user.avatar,
              createdAt: new Date(result.user.created_at),
            });
          }
        } else {
          // User no longer exists, clear stored data
          localStorage.removeItem('educonnect_user');
        }
      }
    } catch (error) {
      console.error('Error checking existing session:', error);
      localStorage.removeItem('educonnect_user');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (fid: string) => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/auth/farcaster', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fid }),
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      const result = await response.json();
      
      if (result.success) {
        const userData: User = {
          userId: result.user.id,
          farcasterId: result.user.farcaster_id,
          displayName: result.user.display_name,
          bio: result.user.bio || '',
          interests: result.user.interests || [],
          courses: result.user.courses || [],
          avatar: result.user.avatar,
          createdAt: new Date(result.user.created_at),
        };

        setUser(userData);
        
        // Store user data in localStorage for persistence
        localStorage.setItem('educonnect_user', JSON.stringify({
          farcasterId: userData.farcasterId,
          displayName: userData.displayName,
        }));
      } else {
        throw new Error(result.error || 'Authentication failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('educonnect_user');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      
      // Update stored data
      localStorage.setItem('educonnect_user', JSON.stringify({
        farcasterId: updatedUser.farcasterId,
        displayName: updatedUser.displayName,
      }));
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
