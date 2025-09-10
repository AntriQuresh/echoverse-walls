import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Upload, CheckCircle } from 'lucide-react';

const TestUpload = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [formData, setFormData] = useState({
    title: 'Test Wallpaper ' + Date.now(),
    description: 'This is a test wallpaper upload to verify the admin dashboard functionality.',
    category: 'Abstract',
    tags: ['test', 'admin', 'verification']
  });

  const handleTestUpload = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to upload",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      console.log('Creating test wallpaper submission...');
      
      // Verify user is authenticated
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
      if (userError || !currentUser) {
        throw new Error("User not authenticated");
      }
      
      // Create a test entry directly in the database (no actual file upload)
      const { data, error } = await supabase
        .from('wallpapers')
        .insert({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          tags: formData.tags,
          file_url: 'https://images.unsplash.com/photo-1558979158-65a1eaa08691?w=800',
          file_path: 'test/sample-wallpaper.jpg',
          status: 'pending',
          user_id: currentUser.id,
          uploaded_by: currentUser.id  // Set uploaded_by to current user
        })
        .select()
        .single();

      if (error) {
        console.error('Upload error:', error);
        throw error;
      }

      console.log('Test wallpaper created:', data);
      setUploaded(true);
      
      toast({
        title: "Success",
        description: "Test wallpaper uploaded successfully! Check the admin dashboard.",
      });

    } catch (error: any) {
      console.error('Error uploading test wallpaper:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload test wallpaper",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  if (!user) {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Please sign in to test wallpaper upload</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Test Wallpaper Upload
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Abstract">Abstract</SelectItem>
              <SelectItem value="Anime">Anime</SelectItem>
              <SelectItem value="Gaming">Gaming</SelectItem>
              <SelectItem value="Cars">Cars</SelectItem>
              <SelectItem value="Marvel">Marvel</SelectItem>
              <SelectItem value="Minimal">Minimal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="pt-4">
          {uploaded ? (
            <div className="text-center space-y-2">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
              <p className="text-green-600 font-medium">Test upload successful!</p>
              <p className="text-sm text-muted-foreground">
                Check the admin dashboard to see the pending request.
              </p>
              <Button
                variant="outline"
                onClick={() => setUploaded(false)}
                className="mt-2"
              >
                Upload Another Test
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleTestUpload}
              disabled={uploading}
              className="w-full"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating Test Upload...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Create Test Upload
                </>
              )}
            </Button>
          )}
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <p><strong>User ID:</strong> {user.id}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Note:</strong> This creates a test database entry with a sample image URL.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestUpload;