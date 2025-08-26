import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Loader2, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Trash2,
  BarChart3,
  FileImage,
  UserCheck,
  Clock,
  Users,
  TrendingUp,
  Activity,
  Settings,
  Download,
  Star,
  Sparkles
} from 'lucide-react';

interface WallpaperSubmission {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  file_url: string;
  file_path: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface DashboardMetrics {
  totalWallpapers: number;
  totalApproved: number;
  totalPending: number;
  totalCreators: number;
}

const StatsCard = ({ title, value, icon: Icon, trend, color }: {
  title: string;
  value: number;
  icon: any;
  trend?: string;
  color: string;
}) => (
  <Card className="admin-glass hover:shadow-xl transition-all duration-500 group overflow-hidden relative">
    <div className={`absolute inset-0 bg-gradient-to-r ${color} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}></div>
    <CardContent className="p-6 relative z-10">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold font-['Poppins'] bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            {value.toLocaleString()}
          </p>
          {trend && (
            <p className="text-xs text-emerald-400 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-2xl bg-gradient-to-r ${color} group-hover:scale-110 transition-transform duration-500`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const PendingWallpaperCard = ({ submission, onApprove, onReject, onDelete }: {
  submission: WallpaperSubmission;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDelete: (id: string, filePath: string) => void;
}) => (
  <Card className="admin-glass group hover:scale-[1.02] transition-all duration-500 overflow-hidden">
    <div className="relative aspect-[4/3] overflow-hidden">
      <img 
        src={submission.file_url} 
        alt={submission.title}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      <div className="absolute top-3 right-3">
        <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
          Pending
        </Badge>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="font-semibold text-white text-lg font-['Poppins'] mb-1 truncate">
          {submission.title}
        </h3>
        <p className="text-white/80 text-sm capitalize">{submission.category}</p>
        <p className="text-white/60 text-xs mt-1">
          {new Date(submission.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </p>
      </div>
    </div>
    
    <CardContent className="p-4 space-y-3">
      <div className="flex gap-2">
        <Button
          onClick={() => onApprove(submission.id)}
          size="sm"
          className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white border-0 shadow-lg hover:shadow-emerald-500/25"
        >
          <CheckCircle className="h-3 w-3 mr-1" />
          Approve
        </Button>
        <Button
          onClick={() => onReject(submission.id)}
          size="sm"
          variant="outline"
          className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
        >
          <XCircle className="h-3 w-3 mr-1" />
          Reject
        </Button>
      </div>
      
      <div className="flex gap-2">
        <Button
          onClick={() => window.open(submission.file_url, '_blank')}
          variant="outline"
          size="sm"
          className="flex-1 border-primary/30 text-primary hover:bg-primary/10"
        >
          <Eye className="h-3 w-3 mr-1" />
          Preview
        </Button>
        <Button
          onClick={() => onDelete(submission.id, submission.file_path)}
          variant="outline"
          size="sm"
          className="text-red-400 hover:bg-red-500/10 border-red-500/30"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </CardContent>
  </Card>
);

const RecentActivityCard = ({ submissions }: { submissions: WallpaperSubmission[] }) => (
  <Card className="admin-glass">
    <CardHeader>
      <CardTitle className="flex items-center font-['Poppins']">
        <Activity className="h-5 w-5 mr-2 text-blue-400" />
        Recent Activity
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      {submissions.slice(0, 6).map((submission) => (
        <div key={submission.id} className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/5 transition-colors duration-300 group">
          <div className="relative">
            <img 
              src={submission.file_url} 
              alt="" 
              className="w-10 h-10 rounded-lg object-cover"
            />
            <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
              submission.status === 'approved' ? 'bg-green-500' : 
              submission.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
            }`}></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
              {submission.title}
            </p>
            <p className="text-xs text-muted-foreground capitalize">
              {submission.status} • {submission.category}
            </p>
          </div>
          <Badge 
            variant="secondary" 
            className={`text-xs ${
              submission.status === 'approved' ? 'bg-green-500/20 text-green-400' : 
              submission.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 
              'bg-red-500/20 text-red-400'
            }`}
          >
            {submission.status}
          </Badge>
        </div>
      ))}
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<WallpaperSubmission[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalWallpapers: 0,
    totalApproved: 0,
    totalPending: 0,
    totalCreators: 0,
  });
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  // Admin email - only this user can access the admin dashboard
  const ADMIN_EMAIL = 'happyshops786@gmail.com';

  // Check if current user is admin
  const isAdmin = user?.email === ADMIN_EMAIL;

  // Redirect if not admin
  if (!loading && (!user || !isAdmin)) {
    toast({
      title: "Access Denied",
      description: "You don't have permission to access the admin dashboard.",
      variant: "destructive",
    });
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    if (isAdmin) {
      fetchSubmissions();
      fetchMetrics();
    }
  }, [isAdmin]);

  const fetchSubmissions = async () => {
    setLoadingSubmissions(true);
    try {
      const { data, error } = await supabase
        .from('wallpapers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmissions((data || []) as WallpaperSubmission[]);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch wallpaper submissions",
        variant: "destructive",
      });
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const fetchMetrics = async () => {
    try {
      const { data: wallpapers, error } = await supabase
        .from('wallpapers')
        .select('status, user_id');

      if (error) throw error;

      const totalWallpapers = wallpapers?.length || 0;
      const totalApproved = wallpapers?.filter(w => w.status === 'approved').length || 0;
      const totalPending = wallpapers?.filter(w => w.status === 'pending').length || 0;
      const uniqueCreators = new Set(wallpapers?.map(w => w.user_id)).size;

      setMetrics({
        totalWallpapers,
        totalApproved,
        totalPending,
        totalCreators: uniqueCreators,
      });
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  const updateSubmissionStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('wallpapers')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Wallpaper ${status} successfully`,
      });

      fetchSubmissions();
      fetchMetrics();
    } catch (error) {
      console.error('Error updating submission:', error);
      toast({
        title: "Error",
        description: "Failed to update submission",
        variant: "destructive",
      });
    }
  };

  const deleteSubmission = async (id: string, filePath: string) => {
    if (!confirm('Are you sure you want to delete this wallpaper? This action cannot be undone.')) return;

    try {
      const { error: storageError } = await supabase.storage
        .from('wallpapers')
        .remove([filePath]);

      if (storageError) console.warn('Storage deletion error:', storageError);

      const { error: dbError } = await supabase
        .from('wallpapers')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "Wallpaper deleted successfully",
      });

      fetchSubmissions();
      fetchMetrics();
    } catch (error) {
      console.error('Error deleting submission:', error);
      toast({
        title: "Error",
        description: "Failed to delete submission",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen admin-bg flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const pendingSubmissions = submissions.filter(s => s.status === 'pending');

  return (
    <div className="min-h-screen admin-bg">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 border-b border-white/10 admin-glass">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold font-['Poppins'] bg-gradient-to-r from-foreground via-primary to-purple-400 bg-clip-text text-transparent">
                    EchoVerse Admin
                  </h1>
                  <p className="text-xs text-muted-foreground">Content Management Dashboard</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                Admin Access
              </Badge>
              <div className="text-right">
                <p className="text-sm font-medium">Welcome back</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold font-['Poppins'] bg-gradient-to-r from-foreground via-primary to-purple-400 bg-clip-text text-transparent">
            Dashboard Overview
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Manage wallpaper submissions, monitor platform stats, and ensure quality content for your users.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Wallpapers"
            value={metrics.totalWallpapers}
            icon={FileImage}
            trend="+12% this month"
            color="from-blue-500 to-cyan-500"
          />
          <StatsCard
            title="Approved"
            value={metrics.totalApproved}
            icon={CheckCircle}
            trend="+8% this week"
            color="from-emerald-500 to-green-500"
          />
          <StatsCard
            title="Pending Review"
            value={metrics.totalPending}
            icon={Clock}
            color="from-yellow-500 to-orange-500"
          />
          <StatsCard
            title="Active Creators"
            value={metrics.totalCreators}
            icon={Users}
            trend="+5 new creators"
            color="from-purple-500 to-pink-500"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Pending Requests - Takes 2/3 of the space */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold font-['Poppins'] flex items-center">
                <Clock className="h-6 w-6 mr-2 text-yellow-500" />
                Pending Wallpaper Requests
              </h3>
              <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">
                {pendingSubmissions.length} pending
              </Badge>
            </div>

            {loadingSubmissions ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="admin-glass rounded-xl h-96 animate-pulse"></div>
                ))}
              </div>
            ) : pendingSubmissions.length === 0 ? (
              <Card className="admin-glass">
                <CardContent className="p-12 text-center">
                  <Star className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h4 className="text-lg font-medium mb-2">All caught up! 🎉</h4>
                  <p className="text-muted-foreground">No pending wallpaper requests to review.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pendingSubmissions.map((submission) => (
                  <PendingWallpaperCard
                    key={submission.id}
                    submission={submission}
                    onApprove={(id) => updateSubmissionStatus(id, 'approved')}
                    onReject={(id) => updateSubmissionStatus(id, 'rejected')}
                    onDelete={deleteSubmission}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar - Takes 1/3 of the space */}
          <div className="space-y-6">
            <RecentActivityCard submissions={submissions} />
            
            {/* Quick Actions */}
            <Card className="admin-glass">
              <CardHeader>
                <CardTitle className="flex items-center font-['Poppins']">
                  <Settings className="h-5 w-5 mr-2 text-purple-400" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
                <Button variant="outline" className="w-full justify-start border-purple-500/30 text-purple-400 hover:bg-purple-500/10">
                  <UserCheck className="h-4 w-4 mr-2" />
                  Manage Users
                </Button>
                <Button variant="outline" className="w-full justify-start border-primary/30 text-primary hover:bg-primary/10">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;