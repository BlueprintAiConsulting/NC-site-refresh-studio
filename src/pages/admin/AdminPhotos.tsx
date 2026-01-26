import { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { 
  Upload, 
  Image as ImageIcon, 
  X,
  Loader2,
  ArrowLeft,
  Trash2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { uploadPhotos } from '@/lib/storage';
import { supabase } from '@/integrations/supabase/client';

export default function AdminPhotos() {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [category, setCategory] = useState('gallery');
  const [altTexts, setAltTexts] = useState<Record<number, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: 'No files selected',
        description: 'Please select at least one file to upload',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);

    try {
      // Upload to Supabase Storage
      const uploadResults = await uploadPhotos(selectedFiles, category);

      // Save to database
      const photoRecords = uploadResults.map((result, index) => ({
        src: result.url,
        alt: altTexts[index] || selectedFiles[index].name.replace(/\.[^/.]+$/, ''),
        category: category,
      }));

      const { error: dbError } = await supabase
        .from('gallery_images')
        .insert(photoRecords);

      if (dbError) throw dbError;

      toast({
        title: 'Success',
        description: `${selectedFiles.length} photo(s) uploaded successfully`,
      });

      setSelectedFiles([]);
      setAltTexts({});
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading your photos',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-32 pb-20 bg-muted/30">
        <div className="container max-w-7xl mx-auto px-5">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link to="/admin/dashboard">
              <Button variant="outline" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold">Photo Gallery Management</h1>
              <p className="text-muted-foreground">Upload and manage church photos</p>
            </div>
          </div>

          <Tabs defaultValue="upload" className="space-y-6">
            <TabsList>
              <TabsTrigger value="upload">Upload Photos</TabsTrigger>
              <TabsTrigger value="gallery">Manage Gallery</TabsTrigger>
              <TabsTrigger value="ministries">Ministry Photos</TabsTrigger>
            </TabsList>

            {/* Upload Tab */}
            <TabsContent value="upload">
              <Card>
                <CardHeader>
                  <CardTitle>Upload New Photos</CardTitle>
                  <CardDescription>
                    Select one or more images to upload to the photo gallery
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Category Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gallery">General Gallery</SelectItem>
                        <SelectItem value="worship">Worship</SelectItem>
                        <SelectItem value="community">Community</SelectItem>
                        <SelectItem value="youth">Youth</SelectItem>
                        <SelectItem value="outreach">Outreach</SelectItem>
                        <SelectItem value="events">Events</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* File Input */}
                  <div className="space-y-2">
                    <Label htmlFor="photos">Select Photos</Label>
                    <div className="flex gap-2">
                      <Input
                        id="photos"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileSelect}
                        ref={fileInputRef}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Browse
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Supported formats: JPG, PNG, WebP. Max 5MB per file.
                    </p>
                  </div>

                  {/* Selected Files Preview */}
                  {selectedFiles.length > 0 && (
                    <div className="space-y-3">
                      <Label>Selected Files ({selectedFiles.length})</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {selectedFiles.map((file, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square rounded-lg border bg-muted overflow-hidden">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={file.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeFile(index)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                            <p className="text-xs text-muted-foreground mt-1 truncate">
                              {file.name}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Upload Button */}
                  <Button
                    onClick={handleUpload}
                    disabled={uploading || selectedFiles.length === 0}
                    className="w-full"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload {selectedFiles.length > 0 ? `${selectedFiles.length} Photo(s)` : 'Photos'}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Gallery Management Tab */}
            <TabsContent value="gallery">
              <Card>
                <CardHeader>
                  <CardTitle>Photo Gallery</CardTitle>
                  <CardDescription>
                    Manage existing photos in the gallery
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-muted-foreground">
                    <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Gallery management coming soon</p>
                    <p className="text-sm mt-2">
                      Photos will be loaded from Supabase or assets folder
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Ministry Photos Tab */}
            <TabsContent value="ministries">
              <Card>
                <CardHeader>
                  <CardTitle>Ministry Photos</CardTitle>
                  <CardDescription>
                    Upload photos for specific ministries
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-muted-foreground">
                    <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Ministry photo management coming soon</p>
                    <p className="text-sm mt-2">
                      Upload photos directly to ministries
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </>
  );
}
