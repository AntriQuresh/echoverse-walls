import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Navigate } from 'react-router-dom';
import { Loader2, Upload, Image, User, Eye, Download } from 'lucide-react';

interface UserWallpaper {
  id: string;
  title: string;
  file_url: string;
  category: string;
  status: string;
  created_at: string;
  description?: string;
  tags?: string[];
}

interface UserProfile {
  id: string;
  display_name?: string;
  bio?: string;
  status: string;
  created_at: string;
  avatar_url?: string;
}

interface UserStats {
  totalUploads: number;
  approvedUploads: number;
  pendingUploads: number;
  rejectedUploads: number;
  hasProfile: boolean;
  profileStatus?: string;
}

const UserDashboard = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [wallpapers, setWallpapers] = useState<UserWallpaper[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats>({
    totalUploads: 0,
    approvedUploads: 0,
    pendingUploads: 0,
    rejectedUploads: 0,
    hasProfile: false,
  });
  const [loadingData, setLoadingData] = useState(false);

  // Redirect if not authenticated
  if (!loading && !user) {
    return <Navigate to="/auth" replace />;
  }

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    setLoadingData(true);
    try {
      // Fetch user's wallpapers
      const { data: wallpapersData, error: wallpapersError } = await supabase
        .from('wallpapers')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (wallpapersError) throw wallpapersError;
      setWallpapers((wallpapersData || []) as UserWallpaper[]);

      // Fetch user's profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (profileError && profileError.code !== 'PGRST116') throw profileError;
      setUserProfile(profileData as UserProfile | null);

      // Calculate stats
      const wallpapers = wallpapersData || [];
      const totalUploads = wallpapers.length;
      const approvedUploads = wallpapers.filter(w => w.status === 'approved').length;
      const pendingUploads = wallpapers.filter(w => w.status === 'pending').length;
      const rejectedUploads = wallpapers.filter(w => w.status === 'rejected').length;

      setStats({
        totalUploads,
        approvedUploads,
        pendingUploads,
        rejectedUploads,
        hasProfile: !!profileData,
        profileStatus: profileData?.status,
      });

    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch your dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoadingData(false);
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen cosmic-bg flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/20 text-green-400';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'rejected':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="min-h-screen cosmic-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold cosmic-text">Your Dashboard</h1>
            <p className="text-xl text-muted-foreground">
              Welcome back, {user?.email}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="cosmic-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Uploads</CardTitle>
                <Upload className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUploads}</div>
              </CardContent>
            </Card>

            <Card className="cosmic-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved</CardTitle>
                <Eye className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">{stats.approvedUploads}</div>
              </CardContent>
            </Card>

            <Card className="cosmic-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Loader2 className="h-4 w-4 text-yellow-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-400">{stats.pendingUploads}</div>
              </CardContent>
            </Card>

            <Card className="cosmic-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Profile Status</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  {stats.hasProfile ? (
                    <Badge className={getStatusBadgeColor(stats.profileStatus || 'pending')}>
                      {stats.profileStatus}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">No profile</span>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Section */}
          <Card className="cosmic-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Creator Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userProfile ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{userProfile.display_name || 'Unnamed Profile'}</h3>
                      <p className="text-sm text-muted-foreground">{userProfile.bio || 'No bio provided'}</p>
                    </div>
                    <Badge className={getStatusBadgeColor(userProfile.status)}>
                      {userProfile.status}
                    </Badge>
                  </div>
                  {userProfile.status === 'rejected' && (
                    <p className="text-sm text-red-400">
                      Your profile was rejected. Please update and resubmit for review.
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">You haven't created a creator profile yet</p>
                  <Button asChild>
                    <a href="/profile-submission">Create Profile</a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Wallpapers Section */}
          <Card className="cosmic-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                Your Wallpapers ({wallpapers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {wallpapers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wallpapers.map((wallpaper) => (
                    <Card key={wallpaper.id} className="overflow-hidden">
                      <div className="aspect-video relative">
                        <img
                          src={wallpaper.file_url}
                          alt={wallpaper.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge className={getStatusBadgeColor(wallpaper.status)}>
                            {wallpaper.status}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold truncate">{wallpaper.title}</h3>
                        <p className="text-sm text-muted-foreground capitalize">{wallpaper.category}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Submitted: {new Date(wallpaper.created_at).toLocaleDateString()}
                        </p>
                        {wallpaper.status === 'rejected' && (
                          <p className="text-xs text-red-400 mt-2">
                            This wallpaper was rejected and won't appear in public galleries.
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Image className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">You haven't uploaded any wallpapers yet</p>
                  <Button asChild>
                    <a href="/upload">Upload Wallpaper</a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg">
              <a href="/upload" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload New Wallpaper
              </a>
            </Button>
            {!stats.hasProfile && (
              <Button asChild variant="outline" size="lg">
                <a href="/profile-submission" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Create Profile
                </a>
              </Button>
            )}
            <Button asChild variant="outline" size="lg">
              <a href="/explore" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Explore Gallery
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;