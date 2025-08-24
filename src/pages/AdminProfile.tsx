import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, User, Shield, CheckCircle, XCircle, Eye, Trash2 } from 'lucide-react';

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

const AdminProfile = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<WallpaperSubmission[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  // Admin email - only this user can access the admin dashboard
  const ADMIN_EMAIL = 'happyshops786@gmail.com';

  // Check if current user is admin
  const isAdmin = user?.email === ADMIN_EMAIL;

  // Redirect if not admin
  if (!loading && (!user || !isAdmin)) {
    toast({
      title: "Access Denied",
      description: "You are not authorized to access this page.",
      variant: "destructive",
    });
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    if (isAdmin) {
      fetchSubmissions();
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

      // Refresh submissions
      fetchSubmissions();
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
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('wallpapers')
        .remove([filePath]);

      if (storageError) console.warn('Storage deletion error:', storageError);

      // Delete from database
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
    } catch (error) {
      console.error('Error deleting submission:', error);
      toast({
        title: "Error",
        description: "Failed to delete submission",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500/20 text-green-600">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/20 text-red-600">Rejected</Badge>;
      case 'pending':
      default:
        return <Badge className="bg-yellow-500/20 text-yellow-600">Pending</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen cosmic-bg flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen cosmic-bg py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Admin Profile Info */}
        <Card className="glass mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 gem-purple">
              <Shield className="h-6 w-6" />
              <span>Admin Dashboard</span>
            </CardTitle>
            <CardDescription>
              Manage wallpaper submissions and user content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{user?.email}</h3>
                <p className="text-sm text-muted-foreground">Administrator</p>
                <Badge className="mt-1 bg-purple-500/20 text-purple-600">Admin Access</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Verification Panel */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Wallpaper Submissions</span>
              <Button onClick={fetchSubmissions} variant="outline" size="sm">
                Refresh
              </Button>
            </CardTitle>
            <CardDescription>
              Review and moderate user-submitted wallpapers
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingSubmissions ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : submissions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No submissions found
              </p>
            ) : (
              <div className="space-y-4">
                {submissions.map((submission) => (
                  <div key={submission.id} className="border border-border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium">{submission.title}</h4>
                          {getStatusBadge(submission.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {submission.description}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>Category: {submission.category}</span>
                          <span>Submitted: {new Date(submission.created_at).toLocaleDateString()}</span>
                          {submission.tags.length > 0 && (
                            <span>Tags: {submission.tags.join(', ')}</span>
                          )}
                        </div>
                      </div>
                      <div className="ml-4">
                        <img 
                          src={submission.file_url} 
                          alt={submission.title}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => window.open(submission.file_url, '_blank')}
                          variant="outline"
                          size="sm"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button
                          onClick={() => deleteSubmission(submission.id, submission.file_path)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                      
                      {submission.status === 'pending' && (
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => updateSubmissionStatus(submission.id, 'rejected')}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:bg-red-50"
                          >
                            <XCircle className="h-3 w-3 mr-1" />
                            Reject
                          </Button>
                          <Button
                            onClick={() => updateSubmissionStatus(submission.id, 'approved')}
                            variant="outline"
                            size="sm"
                            className="text-green-600 hover:bg-green-50"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Approve
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminProfile;