import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface UserStats {
  uploadsCount: number;
  totalDownloads: number;
  credits: number;
  lastClaimed: string | null;
}

export const useUserStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    uploadsCount: 0,
    totalDownloads: 0,
    credits: 0,
    lastClaimed: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserStats();
    }
  }, [user]);

  const fetchUserStats = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Get user data from users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('credits, last_claimed')
        .eq('id', user.id)
        .single();

      if (userError && userError.code !== 'PGRST116') {
        console.error('Error fetching user data:', userError);
      }

      // Get uploads count
      const { count: uploadsCount, error: uploadsError } = await supabase
        .from('wallpapers')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (uploadsError) {
        console.error('Error fetching uploads count:', uploadsError);
      }

      setStats({
        uploadsCount: uploadsCount || 0,
        totalDownloads: Math.floor(Math.random() * 1000), // Mock for now
        credits: userData?.credits || 0,
        lastClaimed: userData?.last_claimed || null,
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const claimDailyCredits = async () => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const now = new Date();
      const today = now.toDateString();
      const lastClaimedDate = stats.lastClaimed ? new Date(stats.lastClaimed).toDateString() : null;

      if (lastClaimedDate === today) {
        return { error: 'Credits already claimed today' };
      }

      const { error } = await supabase
        .from('users')
        .update({
          credits: (stats.credits || 0) + 5,
          last_claimed: now.toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      // Refresh stats
      await fetchUserStats();
      
      return { success: true };
    } catch (error) {
      console.error('Error claiming daily credits:', error);
      return { error: 'Failed to claim credits' };
    }
  };

  return {
    stats,
    loading,
    refreshStats: fetchUserStats,
    claimDailyCredits,
  };
};