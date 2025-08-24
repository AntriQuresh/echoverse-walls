import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Upload, Eye, Clock, CheckCircle, XCircle, Trash2 } from 'lucide-react';

interface UserWallpaper {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  file_url: string;
  file_path: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const UserUploads = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploads, setUploads] = useState<UserWallpaper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserUploads();
    }
  }, [user]);

  const fetchUserUploads = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('wallpapers')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUploads(data || []);
    } catch (error) {
      console.error('Error fetching user uploads:', error);
      toast({
        title: "Error",
        description: "Failed to fetch your uploads",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteUpload = async (id: string, filePath: string) => {
    if (!confirm('Are you sure you want to delete this wallpaper?')) return;

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
        .eq('id', id)
        .eq('user_id', user?.id); // Extra security check

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "Wallpaper deleted successfully",
      });

      fetchUserUploads();
    } catch (error) {
      console.error('Error deleting wallpaper:', error);
      toast({
        title: "Error",
        description: "Failed to delete wallpaper",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge className="bg-green-500/20 text-green-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-500/20 text-red-600">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      case 'pending':
      default:
        return (
          <Badge className="bg-yellow-500/20 text-yellow-600">
            <Clock className="h-3 w-3 mr-1" />
            Pending Review
          </Badge>
        );
    }
  };

  if (!user) return null;

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <Upload className="h-5 w-5 mr-2" />
            Your Uploads
          </span>
          <Button
            onClick={fetchUserUploads}
            variant="outline"
            size="sm"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Refresh'
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : uploads.length === 0 ? (
          <div className="text-center py-8">
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground mb-4">
              You haven't uploaded any wallpapers yet
            </p>
            <Button variant="outline" onClick={() => window.location.href = '/upload'}>
              Upload Your First Wallpaper
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {uploads.map((upload) => (
              <div key={upload.id} className="border border-border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-medium">{upload.title}</h4>
                      {getStatusBadge(upload.status)}
                    </div>
                    {upload.description && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {upload.description}
                      </p>
                    )}
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>Category: {upload.category}</span>
                      <span>Uploaded: {new Date(upload.created_at).toLocaleDateString()}</span>
                      {upload.tags.length > 0 && (
                        <span>Tags: {upload.tags.join(', ')}</span>
                      )}
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <img 
                      src={upload.file_url} 
                      alt={upload.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => window.open(upload.file_url, '_blank')}
                      variant="outline"
                      size="sm"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button
                      onClick={() => deleteUpload(upload.id, upload.file_path)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                  
                  {upload.status === 'pending' && (
                    <div className="text-xs text-muted-foreground">
                      Waiting for admin approval
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserUploads;