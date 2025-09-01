import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload as UploadIcon, Loader2, User, Globe, Camera } from 'lucide-react';

const ProfileSubmission = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form states
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [bannerPreview, setBannerPreview] = useState<string>('');
  const [socialLinks, setSocialLinks] = useState({
    twitter: '',
    instagram: '',
    behance: '',
    dribbble: ''
  });
  const [error, setError] = useState('');

  // Redirect if not authenticated
  if (!user && !loading) {
    return <Navigate to="/auth" replace />;
  }

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setAvatarFile(file);
        const url = URL.createObjectURL(file);
        setAvatarPreview(url);
        setError('');
      } else {
        setError('Please select a valid image file for avatar');
      }
    }
  };

  const handleBannerSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setBannerFile(file);
        const url = URL.createObjectURL(file);
        setBannerPreview(url);
        setError('');
      } else {
        setError('Please select a valid image file for banner');
      }
    }
  };

  const uploadFile = async (file: File, bucket: string, path: string) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file);

    if (error) throw error;
    return data;
  };

  const getPublicUrl = (bucket: string, path: string) => {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (!displayName.trim()) {
      setError('Display name is required');
      setIsSubmitting(false);
      return;
    }

    try {
      let avatarUrl = '';
      let bannerUrl = '';

      // Upload avatar if provided
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `avatar-${Date.now()}.${fileExt}`;
        const filePath = `${user?.id}/${fileName}`;
        
        await uploadFile(avatarFile, 'profiles', filePath);
        avatarUrl = getPublicUrl('profiles', filePath);
      }

      // Upload banner if provided
      if (bannerFile) {
        const fileExt = bannerFile.name.split('.').pop();
        const fileName = `banner-${Date.now()}.${fileExt}`;
        const filePath = `${user?.id}/${fileName}`;
        
        await uploadFile(bannerFile, 'profiles', filePath);
        bannerUrl = getPublicUrl('profiles', filePath);
      }

      // Check if profile already exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      const profileData = {
        user_id: user?.id,
        display_name: displayName.trim(),
        bio: bio.trim() || null,
        website_url: websiteUrl.trim() || null,
        avatar_url: avatarUrl || null,
        banner_url: bannerUrl || null,
        social_links: socialLinks,
        status: 'pending'
      };

      let dbError;
      if (existingProfile) {
        // Update existing profile
        const { error } = await supabase
          .from('profiles')
          .update(profileData)
          .eq('user_id', user?.id);
        dbError = error;
      } else {
        // Insert new profile
        const { error } = await supabase
          .from('profiles')
          .insert(profileData);
        dbError = error;
      }

      if (dbError) {
        console.error("Database error:", dbError);
        throw new Error("Failed to save profile details");
      }

      toast({
        title: "Profile submitted!",
        description: "Your profile has been submitted for review!",
      });

      // Reset form
      setDisplayName('');
      setBio('');
      setWebsiteUrl('');
      setSocialLinks({ twitter: '', instagram: '', behance: '', dribbble: '' });
      setAvatarFile(null);
      setBannerFile(null);
      setAvatarPreview('');
      setBannerPreview('');

    } catch (error: any) {
      setError(error.message);
      toast({
        title: "Submission failed",
        description: error.message,
        variant: "destructive",
      });
    }

    setIsSubmitting(false);
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
              <User className="h-6 w-6" />
              <span>Submit Creator Profile</span>
            </CardTitle>
            <CardDescription>
              Create your creator profile to showcase your work in the EchoVerse community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Banner Upload */}
              <div className="space-y-2">
                <Label htmlFor="banner">Profile Banner</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:bg-muted/50 transition-colors">
                  {bannerPreview ? (
                    <div className="space-y-4">
                      <img 
                        src={bannerPreview} 
                        alt="Banner Preview" 
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => document.getElementById('banner')?.click()}
                      >
                        Change Banner
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Camera className="h-12 w-12 mx-auto text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Click to select a banner image
                      </p>
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => document.getElementById('banner')?.click()}
                      >
                        Select Banner
                      </Button>
                    </div>
                  )}
                  <input
                    id="banner"
                    type="file"
                    accept="image/*"
                    onChange={handleBannerSelect}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Avatar Upload */}
              <div className="space-y-2">
                <Label htmlFor="avatar">Profile Avatar</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:bg-muted/50 transition-colors">
                  {avatarPreview ? (
                    <div className="space-y-4">
                      <img 
                        src={avatarPreview} 
                        alt="Avatar Preview" 
                        className="w-24 h-24 rounded-full mx-auto object-cover"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => document.getElementById('avatar')?.click()}
                      >
                        Change Avatar
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <User className="h-12 w-12 mx-auto text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Click to select an avatar image
                      </p>
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => document.getElementById('avatar')?.click()}
                      >
                        Select Avatar
                      </Button>
                    </div>
                  )}
                  <input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarSelect}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Display Name */}
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name *</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your display name"
                  required
                />
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself and your work"
                  rows={4}
                />
              </div>

              {/* Website URL */}
              <div className="space-y-2">
                <Label htmlFor="website">Website URL</Label>
                <Input
                  id="website"
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://your-website.com"
                />
              </div>

              {/* Social Links */}
              <div className="space-y-4">
                <Label>Social Links</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="twitter" className="text-sm">Twitter</Label>
                    <Input
                      id="twitter"
                      value={socialLinks.twitter}
                      onChange={(e) => setSocialLinks(prev => ({ ...prev, twitter: e.target.value }))}
                      placeholder="@username"
                    />
                  </div>
                  <div>
                    <Label htmlFor="instagram" className="text-sm">Instagram</Label>
                    <Input
                      id="instagram"
                      value={socialLinks.instagram}
                      onChange={(e) => setSocialLinks(prev => ({ ...prev, instagram: e.target.value }))}
                      placeholder="@username"
                    />
                  </div>
                  <div>
                    <Label htmlFor="behance" className="text-sm">Behance</Label>
                    <Input
                      id="behance"
                      value={socialLinks.behance}
                      onChange={(e) => setSocialLinks(prev => ({ ...prev, behance: e.target.value }))}
                      placeholder="username"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dribbble" className="text-sm">Dribbble</Label>
                    <Input
                      id="dribbble"
                      value={socialLinks.dribbble}
                      onChange={(e) => setSocialLinks(prev => ({ ...prev, dribbble: e.target.value }))}
                      placeholder="username"
                    />
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <UploadIcon className="mr-2 h-4 w-4" />
                    Submit Profile
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

export default ProfileSubmission;