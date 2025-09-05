import { useEffect, useCallback } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useAuthStore } from '../store';
import { userService } from '../services/supabase';
import { neynarService } from '../services/neynar';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';

export function useAuth() {
  const {
    ready,
    authenticated,
    user: privyUser,
    login,
    logout: privyLogout,
    linkFarcaster,
    unlinkFarcaster,
  } = usePrivy();

  const {
    user,
    isAuthenticated,
    isLoading,
    farcasterId,
    setUser,
    setAuthenticated,
    setLoading,
    setFarcasterId,
    setPrivyUser,
    logout: storeLogout,
  } = useAuthStore();

  // Initialize user data when Privy authentication changes
  useEffect(() => {
    if (!ready) return;

    const initializeUser = async () => {
      if (authenticated && privyUser) {
        setLoading(true);
        try {
          // Check if user has Farcaster linked
          const farcasterAccount = privyUser.linkedAccounts.find(
            (account: any) => account.type === 'farcaster'
          );

          if (farcasterAccount) {
            const fid = farcasterAccount.fid;
            setFarcasterId(fid.toString());

            // Get or create user in our database
            let dbUser = await userService.getUserByFarcasterId(fid.toString());

            if (!dbUser) {
              // Get Farcaster profile data
              const farcasterUser = await neynarService.getUserByFid(fid);
              
              if (farcasterUser) {
                // Create new user with Farcaster data
                dbUser = await userService.createUser({
                  userId: uuidv4(),
                  farcasterId: fid.toString(),
                  displayName: farcasterUser.display_name || farcasterUser.username,
                  bio: farcasterUser.bio?.text || '',
                  interests: [],
                  courses: [],
                  avatar: farcasterUser.pfp_url,
                });
              }
            }

            if (dbUser) {
              setUser(dbUser);
              setAuthenticated(true);
            }
          } else {
            // User doesn't have Farcaster linked
            setAuthenticated(false);
            setUser(null);
          }

          setPrivyUser(privyUser);
        } catch (error) {
          console.error('Failed to initialize user:', error);
          toast.error('Failed to load user data');
        } finally {
          setLoading(false);
        }
      } else {
        // User is not authenticated
        setAuthenticated(false);
        setUser(null);
        setFarcasterId(null);
        setPrivyUser(null);
        setLoading(false);
      }
    };

    initializeUser();
  }, [ready, authenticated, privyUser, setUser, setAuthenticated, setLoading, setFarcasterId, setPrivyUser]);

  const loginWithFarcaster = useCallback(async () => {
    try {
      setLoading(true);
      await login();
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Login failed. Please try again.');
      setLoading(false);
    }
  }, [login, setLoading]);

  const linkFarcasterAccount = useCallback(async () => {
    try {
      setLoading(true);
      await linkFarcaster();
      toast.success('Farcaster account linked successfully!');
    } catch (error) {
      console.error('Failed to link Farcaster:', error);
      toast.error('Failed to link Farcaster account');
    } finally {
      setLoading(false);
    }
  }, [linkFarcaster, setLoading]);

  const unlinkFarcasterAccount = useCallback(async () => {
    try {
      setLoading(true);
      await unlinkFarcaster();
      toast.success('Farcaster account unlinked');
    } catch (error) {
      console.error('Failed to unlink Farcaster:', error);
      toast.error('Failed to unlink Farcaster account');
    } finally {
      setLoading(false);
    }
  }, [unlinkFarcaster, setLoading]);

  const updateProfile = useCallback(async (updates: Partial<typeof user>) => {
    if (!user) return;

    try {
      setLoading(true);
      const updatedUser = await userService.updateUser(user.userId, updates);
      setUser(updatedUser);
      toast.success('Profile updated successfully!');
      return updatedUser;
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user, setUser, setLoading]);

  const logout = useCallback(async () => {
    try {
      await privyLogout();
      storeLogout();
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Logout failed');
    }
  }, [privyLogout, storeLogout]);

  const refreshUser = useCallback(async () => {
    if (!farcasterId) return;

    try {
      setLoading(true);
      const dbUser = await userService.getUserByFarcasterId(farcasterId);
      if (dbUser) {
        setUser(dbUser);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    } finally {
      setLoading(false);
    }
  }, [farcasterId, setUser, setLoading]);

  return {
    // State
    user,
    isAuthenticated: ready && isAuthenticated,
    isLoading: !ready || isLoading,
    farcasterId,
    privyUser,
    ready,

    // Actions
    loginWithFarcaster,
    logout,
    linkFarcasterAccount,
    unlinkFarcasterAccount,
    updateProfile,
    refreshUser,

    // Computed
    hasFarcaster: !!farcasterId,
    isProfileComplete: user && user.interests.length > 0 && user.courses.length > 0,
  };
}
