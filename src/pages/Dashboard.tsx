import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useUserStats } from '@/hooks/useUserStats';
import { useToast } from '@/hooks/use-toast';
import UserUploads from '@/components/UserUploads';
import { Loader2, LogOut, User, Mail, Calendar, Gift, Upload, Download } from 'lucide-react';

const Dashboard = () => {
  const { user, loading, signOut } = useAuth();
  const { stats, loading: statsLoading, claimDailyCredits } = useUserStats();
  const { toast } = useToast();

  // Redirect if not authenticated
  if (!user && !loading) {
    return <Navigate to="/auth" replace />;
  }

  const handleSignOut = async () => {
    const { error } = await signOut();
    
    if (error) {
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out successfully",
        description: "You have been logged out.",
      });
    }
  };

  const handleClaimCredits = async () => {
    const result = await claimDailyCredits();
    
    if (result.error) {
      toast({
        title: "Cannot claim credits",
        description: result.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Credits claimed!",
        description: "You received 5 free credits for today.",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen cosmic-bg flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen cosmic-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold gem-purple mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Welcome to your EchoVerse profile</p>
          </div>

          {/* Profile Card */}
          <Card className="glass">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage 
                    src={user?.user_metadata?.avatar_url} 
                    alt={user?.user_metadata?.full_name || user?.email || 'User'} 
                  />
                  <AvatarFallback className="text-2xl">
                    {user?.user_metadata?.full_name 
                      ? getInitials(user.user_metadata.full_name)
                      : user?.email?.[0]?.toUpperCase() || 'U'
                    }
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-2xl">
                {user?.user_metadata?.full_name || 'User'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* User Details */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                  <User className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">User ID</p>
                    <p className="text-sm text-muted-foreground font-mono">{user?.id}</p>
                  </div>
                </div>

                {user?.created_at && (
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Member Since</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(user.created_at)}
                      </p>
                    </div>
                  </div>
                )}

                {user?.user_metadata?.provider && (
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                    <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-xs text-primary-foreground font-bold">
                        {user.user_metadata.provider[0]?.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">Sign-in Provider</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {user.user_metadata.provider}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="pt-4 space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Credits Card */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Credits & Rewards
                <Badge variant="secondary" className="bg-primary/20 text-primary">
                  {statsLoading ? '...' : stats.credits} credits
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 rounded-lg bg-gradient-to-r from-primary/10 to-primary/20">
                <Gift className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="font-semibold">Daily Free Credits</p>
                <p className="text-sm text-muted-foreground mb-3">
                  Claim 5 free credits every day!
                </p>
                <Button
                  onClick={handleClaimCredits}
                  size="sm"
                  disabled={statsLoading}
                  className="w-full"
                >
                  <Gift className="h-4 w-4 mr-2" />
                  Claim Today's Credits
                </Button>
              </div>
              
              <div className="text-xs text-center text-muted-foreground">
                Use credits to download premium wallpapers and unlock exclusive content
              </div>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card className="glass">
            <CardHeader>
              <CardTitle>Account Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 rounded-lg bg-muted/30">
                  <Upload className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-primary">
                    {statsLoading ? '...' : stats.uploadsCount}
                  </p>
                  <p className="text-sm text-muted-foreground">Wallpapers Uploaded</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/30">
                  <Download className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-primary">
                    {statsLoading ? '...' : stats.totalDownloads}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Downloads</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Uploads */}
          <UserUploads />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;