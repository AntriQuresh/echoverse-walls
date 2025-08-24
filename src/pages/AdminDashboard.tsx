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
  User, 
  Shield, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Trash2,
  BarChart3,
  FileImage,
  UserCheck,
  Clock,
  Menu,
  X,
  Upload,
  Download,
  Users
} from 'lucide-react';
import { 
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar
} from '@/components/ui/sidebar';

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

const AdminSidebar = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'pending', label: 'Pending Requests', icon: Clock },
    { id: 'approved', label: 'Approved Wallpapers', icon: CheckCircle },
    { id: 'profiles', label: 'Profile Requests', icon: UserCheck },
    { id: 'settings', label: 'Settings', icon: Shield },
  ];

  return (
    <Sidebar className="w-64 border-r border-border/50 bg-gradient-to-b from-background to-background/80">
      <SidebarContent className="p-4">
        <div className="mb-8">
          <h2 className="text-xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Admin Dashboard
          </h2>
          <p className="text-sm text-muted-foreground mt-1">EchoVerse Management</p>
        </div>
        
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full justify-start transition-all duration-300 rounded-xl hover:bg-primary/10 ${
                      activeSection === item.id 
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    <span className="font-medium">{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

const DashboardMetricsCards = ({ metrics }: { metrics: DashboardMetrics }) => {
  const cards = [
    {
      title: 'Total Wallpapers',
      value: metrics.totalWallpapers,
      icon: FileImage,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Approved',
      value: metrics.totalApproved,
      icon: CheckCircle,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Pending Review',
      value: metrics.totalPending,
      icon: Clock,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      title: 'Total Creators',
      value: metrics.totalCreators,
      icon: Users,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <Card key={card.title} className="glass border-border/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">{card.title}</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  {card.value}
                </p>
              </div>
              <div className={`${card.bgColor} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                <card.icon className={`h-6 w-6 bg-gradient-to-r ${card.color} bg-clip-text text-transparent`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const PendingRequestsSection = ({ submissions, onUpdateStatus, onDelete }: {
  submissions: WallpaperSubmission[];
  onUpdateStatus: (id: string, status: 'approved' | 'rejected') => void;
  onDelete: (id: string, filePath: string) => void;
}) => {
  const pendingSubmissions = submissions.filter(s => s.status === 'pending');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Pending Requests</h2>
        <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-600">
          {pendingSubmissions.length} pending
        </Badge>
      </div>
      
      {pendingSubmissions.length === 0 ? (
        <Card className="glass border-border/50">
          <CardContent className="p-12 text-center">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No pending requests</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingSubmissions.map((submission) => (
            <Card key={submission.id} className="glass border-border/50 group hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
              <CardContent className="p-0">
                <div className="relative aspect-video overflow-hidden rounded-t-lg">
                  <img 
                    src={submission.file_url} 
                    alt={submission.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="font-semibold text-white text-sm mb-1">{submission.title}</h3>
                    <p className="text-white/80 text-xs">{submission.category}</p>
                  </div>
                </div>
                
                <div className="p-4 space-y-3">
                  <div className="text-xs text-muted-foreground">
                    Submitted: {new Date(submission.created_at).toLocaleDateString()}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => onUpdateStatus(submission.id, 'approved')}
                      size="sm"
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => onUpdateStatus(submission.id, 'rejected')}
                      size="sm"
                      variant="outline"
                      className="flex-1 border-red-500/50 text-red-600 hover:bg-red-50"
                    >
                      <XCircle className="h-3 w-3 mr-1" />
                      Reject
                    </Button>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => window.open(submission.file_url, '_blank')}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button
                      onClick={() => onDelete(submission.id, submission.file_path)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:bg-red-50 border-red-500/50"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const ApprovedWallpapersSection = ({ submissions }: { submissions: WallpaperSubmission[] }) => {
  const approvedSubmissions = submissions.filter(s => s.status === 'approved');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Approved Wallpapers</h2>
        <Badge variant="secondary" className="bg-green-500/20 text-green-600">
          {approvedSubmissions.length} approved
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {approvedSubmissions.map((submission) => (
          <Card key={submission.id} className="glass border-border/50 group hover:shadow-lg transition-all duration-300">
            <CardContent className="p-0">
              <div className="relative aspect-square overflow-hidden rounded-t-lg">
                <img 
                  src={submission.file_url} 
                  alt={submission.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3">
                <h4 className="font-medium text-sm truncate">{submission.title}</h4>
                <p className="text-xs text-muted-foreground">{submission.category}</p>
                <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                  <span>{new Date(submission.created_at).toLocaleDateString()}</span>
                  <div className="flex items-center">
                    <Download className="h-3 w-3 mr-1" />
                    {Math.floor(Math.random() * 1000)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const ProfileRequestsSection = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Profile Hosting Requests</h2>
      <Card className="glass border-border/50">
        <CardContent className="p-12 text-center">
          <UserCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground mb-2">Profile hosting feature coming soon</p>
          <p className="text-sm text-muted-foreground">Creators will be able to request profile hosting for their portfolios</p>
        </CardContent>
      </Card>
    </div>
  );
};

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
  const [activeSection, setActiveSection] = useState('dashboard');

  // Admin email - only this user can access the admin dashboard
  const ADMIN_EMAIL = 'happyshops786@gmail.com';

  // Check if current user is admin
  const isAdmin = user?.email === ADMIN_EMAIL;

  // Redirect if not admin
  if (!loading && (!user || !isAdmin)) {
    toast({
      title: "Unauthorized Access",
      description: "You are not authorized to access the admin dashboard.",
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
        description: "Failed to fetch submissions",
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
        description: `Submission ${status} successfully`,
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
    if (!confirm('Are you sure you want to delete this submission?')) return;

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
        description: "Submission deleted successfully",
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
      <div className="min-h-screen cosmic-bg flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-foreground via-primary to-purple-500 bg-clip-text text-transparent">
                Welcome back, Admin
              </h1>
              <p className="text-muted-foreground">Manage your EchoVerse platform</p>
            </div>
            <DashboardMetricsCards metrics={metrics} />
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-yellow-500" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {submissions.slice(0, 5).map((submission) => (
                      <div key={submission.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                        <img src={submission.file_url} alt="" className="w-8 h-8 rounded object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{submission.title}</p>
                          <p className="text-xs text-muted-foreground">{submission.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Approval Rate</span>
                      <span className="font-semibold">
                        {metrics.totalWallpapers > 0 
                          ? Math.round((metrics.totalApproved / metrics.totalWallpapers) * 100)
                          : 0}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Active Creators</span>
                      <span className="font-semibold">{metrics.totalCreators}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Pending Review</span>
                      <span className="font-semibold">{metrics.totalPending}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case 'pending':
        return (
          <PendingRequestsSection 
            submissions={submissions}
            onUpdateStatus={updateSubmissionStatus}
            onDelete={deleteSubmission}
          />
        );
      case 'approved':
        return <ApprovedWallpapersSection submissions={submissions} />;
      case 'profiles':
        return <ProfileRequestsSection />;
      case 'settings':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Settings</h2>
            <Card className="glass border-border/50">
              <CardHeader>
                <CardTitle>Admin Configuration</CardTitle>
                <CardDescription>Manage platform settings and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Auto-approve verified creators</p>
                      <p className="text-sm text-muted-foreground">Automatically approve submissions from verified creators</p>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email notifications</p>
                      <p className="text-sm text-muted-foreground">Receive email alerts for new submissions</p>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full cosmic-bg">
        <div className="flex w-full">
          <AdminSidebar />
          
          <div className="flex-1 flex flex-col">
            {/* Top Navigation */}
            <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-md">
              <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center space-x-4">
                  <SidebarTrigger className="lg:hidden" />
                  <div className="hidden sm:block">
                    <nav className="flex space-x-1">
                      {[
                        { id: 'dashboard', label: 'Dashboard' },
                        { id: 'pending', label: 'Pending' },
                        { id: 'approved', label: 'Approved' },
                        { id: 'profiles', label: 'Profiles' },
                      ].map((item) => (
                        <Button
                          key={item.id}
                          variant={activeSection === item.id ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setActiveSection(item.id)}
                          className="text-sm"
                        >
                          {item.label}
                        </Button>
                      ))}
                    </nav>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={fetchSubmissions}
                    variant="outline"
                    size="sm"
                    disabled={loadingSubmissions}
                    className="hidden sm:flex"
                  >
                    {loadingSubmissions ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Refresh'
                    )}
                  </Button>
                  
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-purple-500 flex items-center justify-center">
                      <Shield className="h-4 w-4 text-white" />
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-sm font-medium">Admin</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
              <div className="container mx-auto px-6 py-8 max-w-7xl">
                {renderContent()}
              </div>
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;