import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/useAuth';
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
import ministriesData from '@/content/ministries.json';

interface SelectedFile {
  file: File;
  previewUrl: string;
  croppedFile?: File;
  croppedPreviewUrl?: string;
}

type CropArea = { width: number; height: number; x: number; y: number };

interface GalleryImageRecord {
  id: string;
  src: string;
  alt: string;
  category: string;
  created_at: string;
}

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
  const [cropTarget, setCropTarget] = useState<
    | { mode: 'new'; index: number }
    | { mode: 'existing'; image: GalleryImageRecord; scope: 'gallery' | 'ministry' }
    | null
  >(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(null);
  const [cropAspect, setCropAspect] = useState<string>('1');
  const [galleryImages, setGalleryImages] = useState<GalleryImageRecord[]>([]);
  const [ministryImages, setMinistryImages] = useState<GalleryImageRecord[]>([]);
  const [galleryCategory, setGalleryCategory] = useState('gallery');
  const [ministryCategory, setMinistryCategory] = useState('education');
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [loadingMinistry, setLoadingMinistry] = useState(false);

  const ministryCategories = Array.from(
    new Set(ministriesData.ministries.map((ministry) => ministry.category))
  );

  const getStoragePathFromUrl = (url: string) => {
    try {
      const { pathname } = new URL(url);
      const marker = '/storage/v1/object/public/gallery/';
      const index = pathname.indexOf(marker);
      if (index === -1) return null;
      return decodeURIComponent(pathname.substring(index + marker.length));
    } catch {
      return null;
    }
  };

  const fetchImagesByCategory = async (targetCategory: string) => {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .eq('category', targetCategory)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data ?? []) as GalleryImageRecord[];
  };

  useEffect(() => {
    const loadGallery = async () => {
      setLoadingGallery(true);
      try {
        const data = await fetchImagesByCategory(galleryCategory);
        setGalleryImages(data);
      } catch (error) {
        console.error('Gallery load error:', error);
        toast({
          title: 'Unable to load gallery images',
          description: 'Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoadingGallery(false);
      }
    };
    void loadGallery();
  }, [galleryCategory, toast]);

  useEffect(() => {
    const loadMinistry = async () => {
      setLoadingMinistry(true);
      try {
        const data = await fetchImagesByCategory(ministryCategory);
        setMinistryImages(data);
      } catch (error) {
        console.error('Ministry load error:', error);
        toast({
          title: 'Unable to load ministry images',
          description: 'Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoadingMinistry(false);
      }
    };
    void loadMinistry();
  }, [ministryCategory, toast]);

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
    if (!cropTarget || !croppedAreaPixels) return;

    try {
      if (cropTarget.mode === 'new') {
        const target = selectedFiles[cropTarget.index];
        if (!target) return;
        const croppedFile = await getCroppedFile(target.previewUrl, croppedAreaPixels, target.file.name);
        const croppedPreviewUrl = URL.createObjectURL(croppedFile);
        setSelectedFiles((prev) => {
          const next = [...prev];
          const current = next[cropTarget.index];
          if (current?.croppedPreviewUrl) {
            URL.revokeObjectURL(current.croppedPreviewUrl);
          }
          next[cropTarget.index] = {
            ...current,
            croppedFile,
            croppedPreviewUrl,
          };
          return next;
        });
      } else {
        const image = cropTarget.image;
        const path = getStoragePathFromUrl(image.src);
        if (!path) throw new Error('Unable to locate storage path for image');
        const croppedFile = await getCroppedFile(image.src, croppedAreaPixels, `cropped-${image.id}.jpg`);
        const { error: uploadError } = await supabase.storage
          .from('gallery')
          .upload(path, croppedFile, { cacheControl: '3600', upsert: true });
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('gallery')
          .getPublicUrl(path);

        const { error: dbError } = await supabase
          .from('gallery_images')
          .update({ src: publicUrl })
          .eq('id', image.id);
        if (dbError) throw dbError;

        if (cropTarget.scope === 'gallery') {
          setGalleryImages((prev) => prev.map((item) => (item.id === image.id ? { ...item, src: publicUrl } : item)));
        } else {
          setMinistryImages((prev) => prev.map((item) => (item.id === image.id ? { ...item, src: publicUrl } : item)));
        }
      }

      setCropTarget(null);
    } catch (error) {
      console.error('Crop error:', error);
      toast({
        title: 'Crop failed',
        description: 'Unable to crop this image. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleUpload = async (overrideCategory?: string) => {
    const activeCategory = overrideCategory ?? category;
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
        activeCategory
      );

      // Save to database
      const photoRecords = uploadResults.map((result, index) => ({
        src: result.url,
        alt: altTexts[index] || selectedFiles[index].file.name.replace(/\.[^/.]+$/, ''),
        category: activeCategory,
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

  const renderUploadPanel = (targetCategory: string, title: string, description: string) => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor={`photos-${targetCategory}`}>Select Photos</Label>
          <div className="flex gap-2">
            <Input
              id={`photos-${targetCategory}`}
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
                  <div className="mt-2 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      type="button"
                      onClick={() => {
                        setCropTarget({ mode: 'new', index });
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
                        variant="secondary"
                        size="sm"
                        className="flex-1"
                        type="button"
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

        <Button
          type="button"
          onClick={() => handleUpload(targetCategory)}
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
              Upload to {targetCategory}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );

  const handleDeleteImage = async (image: GalleryImageRecord, scope: 'gallery' | 'ministry') => {
    const confirmDelete = window.confirm('Delete this image? This cannot be undone.');
    if (!confirmDelete) return;

    try {
      const path = getStoragePathFromUrl(image.src);
      if (path) {
        const { error: storageError } = await supabase
          .storage
          .from('gallery')
          .remove([path]);
        if (storageError) throw storageError;
      }

      const { error: dbError } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', image.id);

      if (dbError) throw dbError;

      toast({
        title: 'Image deleted',
        description: 'The image has been removed.',
      });

      if (scope === 'gallery') {
        setGalleryImages((prev) => prev.filter((item) => item.id !== image.id));
      } else {
        setMinistryImages((prev) => prev.filter((item) => item.id !== image.id));
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: 'Unable to delete image',
        description: 'Please try again later.',
        variant: 'destructive',
      });
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
                        <SelectItem value="grow-childrens-sunday-school">Grow: Children's Sunday School</SelectItem>
                        <SelectItem value="grow-adult-class">Grow: Adult Class</SelectItem>
                        <SelectItem value="grow-nursery">Grow: Nursery</SelectItem>
                        <SelectItem value="grow-jr-church">Grow: Jr Church</SelectItem>
                        <SelectItem value="additional-ministry-prayer-group">Ministry Bubble: Prayer Group</SelectItem>
                        <SelectItem value="additional-ministry-griefshare">Ministry Bubble: GriefShare</SelectItem>
                        <SelectItem value="additional-ministry-mens-alliance">Ministry Bubble: Men's Alliance</SelectItem>
                        <SelectItem value="additional-ministry-womens-alliance">Ministry Bubble: Women's Alliance</SelectItem>
                        <SelectItem value="additional-ministry-women-in-community">Ministry Bubble: Women in Community</SelectItem>
                        <SelectItem value="additional-ministry-womens-bible-study">Ministry Bubble: Women's Bible Study</SelectItem>
                        <SelectItem value="additional-ministry-secret-sister">Ministry Bubble: Secret Sister</SelectItem>
                        <SelectItem value="staff-pastor-blanca">Staff: Pastor Blanca Baker</SelectItem>
                        <SelectItem value="staff-marsha-snyder">Staff: Marsha Snyder</SelectItem>
                        <SelectItem value="staff-mike-krall">Staff: Mike Krall</SelectItem>
                        <SelectItem value="staff-ministers">Staff: Ministers of the Gospel</SelectItem>
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
                                type="button"
                                onClick={() => {
                                  setCropTarget({ mode: 'new', index });
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
                                  type="button"
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
                            <div className="mt-2 flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                type="button"
                                onClick={() => {
                                  setCropTarget({ mode: 'new', index });
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
                                  variant="secondary"
                                  size="sm"
                                  className="flex-1"
                                  type="button"
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
                    onClick={() => handleUpload()}
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
                  <div className="space-y-6">
                    {renderUploadPanel(
                      galleryCategory,
                      `Upload to ${galleryCategory}`,
                      'Add new images to the selected gallery category.'
                    )}
                    <div className="max-w-xs">
                      <Label htmlFor="gallery-category">Category</Label>
                      <Select value={galleryCategory} onValueChange={setGalleryCategory}>
                        <SelectTrigger id="gallery-category">
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
                          <SelectItem value="grow-childrens-sunday-school">Grow: Children's Sunday School</SelectItem>
                          <SelectItem value="grow-adult-class">Grow: Adult Class</SelectItem>
                          <SelectItem value="grow-nursery">Grow: Nursery</SelectItem>
                          <SelectItem value="grow-jr-church">Grow: Jr Church</SelectItem>
                          <SelectItem value="additional-ministry-prayer-group">Ministry Bubble: Prayer Group</SelectItem>
                          <SelectItem value="additional-ministry-griefshare">Ministry Bubble: GriefShare</SelectItem>
                          <SelectItem value="additional-ministry-mens-alliance">Ministry Bubble: Men's Alliance</SelectItem>
                          <SelectItem value="additional-ministry-womens-alliance">Ministry Bubble: Women's Alliance</SelectItem>
                          <SelectItem value="additional-ministry-women-in-community">Ministry Bubble: Women in Community</SelectItem>
                          <SelectItem value="additional-ministry-womens-bible-study">Ministry Bubble: Women's Bible Study</SelectItem>
                          <SelectItem value="additional-ministry-secret-sister">Ministry Bubble: Secret Sister</SelectItem>
                          <SelectItem value="staff-pastor-blanca">Staff: Pastor Blanca Baker</SelectItem>
                          <SelectItem value="staff-marsha-snyder">Staff: Marsha Snyder</SelectItem>
                          <SelectItem value="staff-mike-krall">Staff: Mike Krall</SelectItem>
                          <SelectItem value="staff-ministers">Staff: Ministers of the Gospel</SelectItem>
                          <SelectItem value="worship-bubble-1">Worship Bubble 1</SelectItem>
                          <SelectItem value="worship-bubble-2">Worship Bubble 2</SelectItem>
                          <SelectItem value="worship-bubble-3">Worship Bubble 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {loadingGallery ? (
                      <div className="flex justify-center py-12">
                        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                      </div>
                    ) : galleryImages.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No images in this category yet.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {galleryImages.map((image) => (
                          <div key={image.id} className="relative group">
                            <div className="aspect-square rounded-lg border bg-muted overflow-hidden">
                              <img
                                src={image.src}
                                alt={image.alt}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="mt-2 flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                type="button"
                                onClick={() => {
                                  setCropTarget({ mode: 'existing', image, scope: 'gallery' });
                                  setCrop({ x: 0, y: 0 });
                                  setZoom(1);
                                  setCroppedAreaPixels(null);
                                }}
                              >
                                <Crop className="w-4 h-4 mr-1" />
                                Crop
                              </Button>
                            </div>
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleDeleteImage(image, 'gallery')}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                            <p className="text-xs text-muted-foreground mt-2 truncate">
                              {image.alt || 'Gallery image'}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
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
                  <div className="space-y-6">
                    {renderUploadPanel(
                      ministryCategory,
                      `Upload to ${ministryCategory}`,
                      'Add new images for the selected ministry category.'
                    )}
                    <div className="max-w-xs">
                      <Label htmlFor="ministry-category">Ministry Category</Label>
                      <Select value={ministryCategory} onValueChange={setMinistryCategory}>
                        <SelectTrigger id="ministry-category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {ministryCategories.map((ministry) => (
                            <SelectItem key={ministry} value={ministry}>
                              {ministry.charAt(0).toUpperCase() + ministry.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {loadingMinistry ? (
                      <div className="flex justify-center py-12">
                        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                      </div>
                    ) : ministryImages.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No images for this ministry yet.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {ministryImages.map((image) => (
                          <div key={image.id} className="relative group">
                            <div className="aspect-square rounded-lg border bg-muted overflow-hidden">
                              <img
                                src={image.src}
                                alt={image.alt}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="mt-2 flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                type="button"
                                onClick={() => {
                                  setCropTarget({ mode: 'existing', image, scope: 'ministry' });
                                  setCrop({ x: 0, y: 0 });
                                  setZoom(1);
                                  setCroppedAreaPixels(null);
                                }}
                              >
                                <Crop className="w-4 h-4 mr-1" />
                                Crop
                              </Button>
                            </div>
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleDeleteImage(image, 'ministry')}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                            <p className="text-xs text-muted-foreground mt-2 truncate">
                              {image.alt || 'Ministry image'}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
      <Dialog open={cropTarget !== null} onOpenChange={(open) => !open && setCropTarget(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crop image</DialogTitle>
            <DialogDescription>
              Adjust the crop to fit your section. Use square crops for bubble images.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative h-[360px] w-full bg-muted rounded-lg overflow-hidden">
              {cropTarget && (
                <Cropper
                  image={
                    cropTarget.mode === 'new'
                      ? selectedFiles[cropTarget.index]?.previewUrl
                      : cropTarget.image.src
                  }
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
              <Button variant="outline" onClick={() => setCropTarget(null)}>
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
