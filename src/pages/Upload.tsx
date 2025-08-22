import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload as UploadIcon, Loader2, Image as ImageIcon } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
}

const Upload = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [tags, setTags] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [error, setError] = useState('');

  // Redirect if not authenticated
  if (!user && !loading) {
    return <Navigate to="/auth" replace />;
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    // Mock categories for now until types are regenerated
    const mockCategories = [
      { id: '1', name: 'Nature', slug: 'nature' },
      { id: '2', name: 'Anime', slug: 'anime' },
      { id: '3', name: 'Abstract', slug: 'abstract' },
      { id: '4', name: 'Cars', slug: 'cars' },
      { id: '5', name: 'Gaming', slug: 'gaming' },
      { id: '6', name: 'Technology', slug: 'technology' },
      { id: '7', name: 'Space', slug: 'space' },
      { id: '8', name: 'Minimal', slug: 'minimal' },
    ];
    setCategories(mockCategories);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setError('');
      } else {
        setError('Please select a valid image file');
      }
    }
  };

  const uploadFile = async (file: File, path: string) => {
    const { data, error } = await supabase.storage
      .from('wallpapers')
      .upload(path, file);

    if (error) throw error;
    return data;
  };

  const getPublicUrl = (path: string) => {
    const { data } = supabase.storage
      .from('wallpapers')
      .getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setError('');

    if (!selectedFile || !title || !categoryId) {
      setError('Please fill in all required fields and select an image');
      setIsUploading(false);
      return;
    }

    try {
      // Upload file to storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user?.id}/${fileName}`;

      await uploadFile(selectedFile, filePath);
      const imageUrl = getPublicUrl(filePath);

      // For now, just show success - database operations will be added later
      toast({
        title: "Upload successful!",
        description: "Your wallpaper has been uploaded to storage. Database integration coming soon!",
      });

      // Reset form
      setTitle('');
      setDescription('');
      setCategoryId('');
      setTags('');
      setSelectedFile(null);
      setPreviewUrl('');

    } catch (error: any) {
      setError(error.message);
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    }

    setIsUploading(false);
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
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 gem-purple">
              <UploadIcon className="h-6 w-6" />
              <span>Upload Wallpaper</span>
            </CardTitle>
            <CardDescription>
              Share your amazing wallpapers with the EchoVerse community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* File Upload */}
              <div className="space-y-2">
                <Label htmlFor="file">Image File *</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:bg-muted/50 transition-colors">
                  {previewUrl ? (
                    <div className="space-y-4">
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="max-h-40 mx-auto rounded-lg"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => document.getElementById('file')?.click()}
                      >
                        Change Image
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Click to select an image or drag and drop
                      </p>
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => document.getElementById('file')?.click()}
                      >
                        Select Image
                      </Button>
                    </div>
                  )}
                  <input
                    id="file"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter wallpaper title"
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={categoryId} onValueChange={setCategoryId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your wallpaper (optional)"
                  rows={3}
                />
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Enter tags separated by commas (e.g., nature, landscape, mountains)"
                />
                <p className="text-xs text-muted-foreground">
                  Separate multiple tags with commas
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <UploadIcon className="mr-2 h-4 w-4" />
                    Upload Wallpaper
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Upload;