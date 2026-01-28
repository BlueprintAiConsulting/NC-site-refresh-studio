import { useCallback, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { 
  Upload, 
  Image as ImageIcon, 
  X,
  Loader2,
  ArrowLeft,
  Trash2,
  Crop
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { uploadPhotos } from '@/lib/storage';
import { supabase } from '@/integrations/supabase/client';
import Cropper from 'react-easy-crop';

interface SelectedFile {
  file: File;
  previewUrl: string;
  croppedFile?: File;
  croppedPreviewUrl?: string;
}

type CropArea = { width: number; height: number; x: number; y: number };

const cropAspectOptions = [
  { label: 'Free', value: 'free' },
  { label: 'Square', value: '1' },
  { label: 'Landscape 4:3', value: '1.3333' },
  { label: 'Portrait 3:4', value: '0.75' },
];

export default function AdminPhotos() {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [category, setCategory] = useState('gallery');
  const [altTexts, setAltTexts] = useState<Record<number, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cropIndex, setCropIndex] = useState<number | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(null);
  const [cropAspect, setCropAspect] = useState<string>('1');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const mapped = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setSelectedFiles((prev) => [...prev, ...mapped]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => {
      const next = [...prev];
      const removed = next.splice(index, 1)[0];
      if (removed) {
        URL.revokeObjectURL(removed.previewUrl);
        if (removed.croppedPreviewUrl) {
          URL.revokeObjectURL(removed.croppedPreviewUrl);
        }
      }
      return next;
    });
    setAltTexts((prev) => {
      const updated = { ...prev };
      delete updated[index];
      return updated;
    });
  };

  const onCropComplete = useCallback((_: CropArea, croppedArea: CropArea) => {
    setCroppedAreaPixels(croppedArea);
  }, []);

  const createImage = (url: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  const getCroppedFile = async (imageSrc: string, pixelCrop: CropArea, fileName: string) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Unable to crop image');

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise<File>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Unable to crop image'));
          return;
        }
        resolve(new File([blob], fileName, { type: blob.type }));
      }, 'image/jpeg', 0.92);
    });
  };

  const applyCrop = async () => {
    if (cropIndex === null || !croppedAreaPixels) return;
    const target = selectedFiles[cropIndex];
    if (!target) return;

    try {
      const croppedFile = await getCroppedFile(target.previewUrl, croppedAreaPixels, target.file.name);
      const croppedPreviewUrl = URL.createObjectURL(croppedFile);
      setSelectedFiles((prev) => {
        const next = [...prev];
        const current = next[cropIndex];
        if (current?.croppedPreviewUrl) {
          URL.revokeObjectURL(current.croppedPreviewUrl);
        }
        next[cropIndex] = {
          ...current,
          croppedFile,
          croppedPreviewUrl,
        };
        return next;
      });
      setCropIndex(null);
    } catch (error) {
      console.error('Crop error:', error);
      toast({
        title: 'Crop failed',
        description: 'Unable to crop this image. Please try again.',
        variant: 'destructive',
      });
    }
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
      const uploadResults = await uploadPhotos(
        selectedFiles.map((item) => item.croppedFile ?? item.file),
        category
      );

      // Save to database
      const photoRecords = uploadResults.map((result, index) => ({
        src: result.url,
        alt: altTexts[index] || selectedFiles[index].file.name.replace(/\.[^/.]+$/, ''),
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

      selectedFiles.forEach((file) => {
        URL.revokeObjectURL(file.previewUrl);
        if (file.croppedPreviewUrl) {
          URL.revokeObjectURL(file.croppedPreviewUrl);
        }
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
                        <SelectItem value="mission">Mission Bubble</SelectItem>
                        <SelectItem value="vision">Vision Bubble</SelectItem>
                        <SelectItem value="values">Values Bubble</SelectItem>
                        <SelectItem value="worship-bubble-1">Worship Bubble 1</SelectItem>
                        <SelectItem value="worship-bubble-2">Worship Bubble 2</SelectItem>
                        <SelectItem value="worship-bubble-3">Worship Bubble 3</SelectItem>
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
                        {selectedFiles.map((item, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square rounded-lg border bg-muted overflow-hidden">
                              <img
                                src={item.croppedPreviewUrl ?? item.previewUrl}
                                alt={item.file.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="absolute bottom-2 left-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="secondary"
                                size="sm"
                                className="flex-1"
                                onClick={() => {
                                  setCropIndex(index);
                                  setCrop({ x: 0, y: 0 });
                                  setZoom(1);
                                  setCroppedAreaPixels(null);
                                }}
                              >
                                <Crop className="w-4 h-4 mr-1" />
                                Crop
                              </Button>
                              {item.croppedFile && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1"
                                  onClick={() => {
                                    setSelectedFiles((prev) => {
                                      const next = [...prev];
                                      const current = next[index];
                                      if (current?.croppedPreviewUrl) {
                                        URL.revokeObjectURL(current.croppedPreviewUrl);
                                      }
                                      next[index] = {
                                        ...current,
                                        croppedFile: undefined,
                                        croppedPreviewUrl: undefined,
                                      };
                                      return next;
                                    });
                                  }}
                                >
                                  Reset
                                </Button>
                              )}
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
                              {item.file.name}
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
      <Dialog open={cropIndex !== null} onOpenChange={(open) => !open && setCropIndex(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crop image</DialogTitle>
            <DialogDescription>
              Adjust the crop to fit your section. Use square crops for bubble images.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative h-[360px] w-full bg-muted rounded-lg overflow-hidden">
              {cropIndex !== null && selectedFiles[cropIndex] && (
                <Cropper
                  image={selectedFiles[cropIndex].previewUrl}
                  crop={crop}
                  zoom={zoom}
                  aspect={cropAspect === 'free' ? undefined : Number(cropAspect)}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-[1fr_200px] sm:items-center">
              <div className="space-y-2">
                <Label>Zoom</Label>
                <Slider
                  value={[zoom]}
                  min={1}
                  max={3}
                  step={0.1}
                  onValueChange={(value) => setZoom(value[0] ?? 1)}
                />
              </div>
              <div className="space-y-2">
                <Label>Aspect</Label>
                <Select value={cropAspect} onValueChange={setCropAspect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select aspect" />
                  </SelectTrigger>
                  <SelectContent>
                    {cropAspectOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCropIndex(null)}>
                Cancel
              </Button>
              <Button onClick={applyCrop}>Apply Crop</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
