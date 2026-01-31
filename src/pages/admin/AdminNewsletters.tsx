import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
  FileText, 
  Upload, 
  Download, 
  Trash2, 
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Loader2,
  Pencil
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/useAuth';

interface NewsletterRecord {
  id: string;
  title: string;
  month: string;
  year: string;
  date: string;
  description: string | null;
  pdf_url: string;
  pdf_path: string;
  featured: boolean;
}

interface NewsletterPayload {
  title: string;
  month: string;
  year: string;
  date: string;
  description: string | null;
  pdf_url: string;
  pdf_path: string;
  featured: boolean;
  created_by?: string | null;
}

export default function AdminNewsletters() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAdmin } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newsletters, setNewsletters] = useState<NewsletterRecord[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingPath, setEditingPath] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    month: '',
    year: new Date().getFullYear().toString(),
    description: '',
    featured: false,
  });

  const fetchNewsletters = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('newsletters' as never)
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Failed to load newsletters:', error);
      toast({
        title: 'Unable to load newsletters',
        description: 'Please try again in a moment.',
        variant: 'destructive',
      });
    } else {
      setNewsletters((data ?? []) as unknown as NewsletterRecord[]);
    }

    setIsLoading(false);
  }, [toast]);

  useEffect(() => {
    void fetchNewsletters();
  }, [fetchNewsletters]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast({
          title: 'Invalid file type',
          description: 'Please select a PDF file.',
          variant: 'destructive',
        });
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: 'File too large',
          description: 'File size must be less than 10MB.',
          variant: 'destructive',
        });
        return;
      }
      setSelectedFile(file);
      toast({
        title: 'File selected',
        description: file.name,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAdmin) {
      toast({
        title: 'Admin access required',
        description: 'Your account does not have permission to manage newsletters.',
        variant: 'destructive',
      });
      return;
    }

    if (!selectedFile && !editingId) {
      toast({
        title: 'Missing PDF',
        description: 'Please select a PDF file to upload.',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.title || !formData.month || !formData.year) {
      toast({
        title: 'Missing required fields',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const parsedDate = new Date(`${formData.month} 1, ${formData.year}`);
    if (Number.isNaN(parsedDate.getTime())) {
      toast({
        title: 'Invalid month/year',
        description: 'Please provide a valid month and year.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);

    try {
      let pdfUrl = '';
      let pdfPath = '';

      if (selectedFile) {
        const safeName = selectedFile.name.replace(/[^a-zA-Z0-9.-]/g, '-').toLowerCase();
        const filePath = `${formData.year}/${Date.now()}-${safeName}`;

        const { error: uploadError } = await supabase.storage
          .from('newsletters')
          .upload(filePath, selectedFile, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('newsletters')
          .getPublicUrl(filePath);

        pdfUrl = publicUrl;
        pdfPath = filePath;
      } else if (editingId && editingPath) {
        const { data: { publicUrl } } = supabase.storage
          .from('newsletters')
          .getPublicUrl(editingPath);
        pdfUrl = publicUrl;
        pdfPath = editingPath;
      }

      if (!pdfUrl || !pdfPath) {
        throw new Error('Missing PDF upload details');
      }

      if (formData.featured) {
        await supabase
          .from('newsletters' as never)
          .update({ featured: false })
          .neq('id', editingId ?? '');
      }

      const payload: NewsletterPayload = {
        title: formData.title.trim(),
        month: formData.month.trim(),
        year: formData.year.trim(),
        date: parsedDate.toISOString().split('T')[0],
        description: formData.description.trim() || null,
        pdf_url: pdfUrl,
        pdf_path: pdfPath,
        featured: formData.featured,
        created_by: user?.id ?? null,
      };

      const { error } = editingId
        ? await supabase.from('newsletters' as never).update(payload).eq('id', editingId)
        : await supabase.from('newsletters' as never).insert(payload);

      if (error) throw error;

      toast({
        title: editingId ? 'Newsletter updated' : 'Newsletter uploaded',
        description: 'Your newsletter has been saved.',
      });

      // Reset form
      setFormData({
        title: '',
        month: '',
        year: new Date().getFullYear().toString(),
        description: '',
        featured: false,
      });
      setSelectedFile(null);
      setEditingId(null);
      setEditingPath(null);
      if (e.target instanceof HTMLFormElement) {
        e.target.reset();
      }
      await fetchNewsletters();
    } catch (error) {
      console.error('Upload error:', error);
      const message = error instanceof Error ? error.message : 'Failed to upload newsletter';
      toast({
        title: 'Failed to upload newsletter',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const sortedNewsletters = useMemo(
    () => [...newsletters].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [newsletters]
  );

  const handleEdit = (newsletter: NewsletterRecord) => {
    setEditingId(newsletter.id);
    setEditingPath(newsletter.pdf_path);
    setSelectedFile(null);
    setFormData({
      title: newsletter.title,
      month: newsletter.month,
      year: newsletter.year,
      description: newsletter.description ?? '',
      featured: newsletter.featured,
    });
  };

  const handleDelete = async (newsletter: NewsletterRecord) => {
    const shouldDelete = window.confirm('Delete this newsletter? This cannot be undone.');
    if (!shouldDelete) return;

    try {
      if (newsletter.pdf_path) {
        const { error: storageError } = await supabase
          .storage
          .from('newsletters')
          .remove([newsletter.pdf_path]);
        if (storageError) throw storageError;
      }

      const { error: dbError } = await supabase
        .from('newsletters' as never)
        .delete()
        .eq('id', newsletter.id);

      if (dbError) throw dbError;

      toast({
        title: 'Newsletter deleted',
        description: 'The newsletter has been removed.',
      });
      await fetchNewsletters();
    } catch (error) {
      console.error('Delete error:', error);
      const message = error instanceof Error ? error.message : 'Failed to delete newsletter';
      toast({
        title: 'Failed to delete newsletter',
        description: message,
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-32 pb-20 bg-muted/30">
        <div className="container max-w-6xl mx-auto px-5">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/admin/dashboard')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl md:text-4xl font-semibold mb-2">Newsletter Management</h1>
            <p className="text-muted-foreground">
              Upload and manage church newsletters
            </p>
          </div>

          <Tabs defaultValue="upload" className="space-y-6">
            <TabsList>
              <TabsTrigger value="upload">
                <Upload className="w-4 h-4 mr-2" />
                Upload Newsletter
              </TabsTrigger>
              <TabsTrigger value="manage">
                <FileText className="w-4 h-4 mr-2" />
                Manage Newsletters
              </TabsTrigger>
            </TabsList>

            {/* Upload Tab */}
            <TabsContent value="upload">
              <Card>
                <CardHeader>
                  <CardTitle>Upload New Newsletter</CardTitle>
                  <CardDescription>
                    Upload a PDF newsletter and add details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* File Upload */}
                    <div className="space-y-2">
                      <Label htmlFor="newsletter-file">
                        Newsletter PDF {!editingId && <span className="text-destructive">*</span>}
                      </Label>
                      <div className="flex items-center gap-4">
                        <Input
                          id="newsletter-file"
                          type="file"
                          accept=".pdf"
                          onChange={handleFileChange}
                          className="cursor-pointer"
                        />
                        {selectedFile && (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Max file size: 10MB. PDF format only.
                      </p>
                      {editingId && (
                        <p className="text-xs text-muted-foreground">
                          Leave empty to keep the existing PDF.
                        </p>
                      )}
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                      <Label htmlFor="title">
                        Title <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="title"
                        placeholder="e.g., January 2026 Newsletter"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>

                    {/* Month & Year */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="month">
                          Month <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="month"
                          placeholder="e.g., January"
                          value={formData.month}
                          onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="year">
                          Year <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="year"
                          type="number"
                          placeholder="2026"
                          value={formData.year}
                          onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Brief description of this newsletter's content"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch
                        id="featured"
                        checked={formData.featured}
                        onCheckedChange={(value) => setFormData({ ...formData, featured: value })}
                      />
                      <Label htmlFor="featured">Mark as featured</Label>
                    </div>

                    <Button type="submit" disabled={isUploading || !isAdmin} className="w-full">
                      {isUploading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          {editingId ? 'Update Newsletter' : 'Upload Newsletter'}
                        </>
                      )}
                    </Button>
                    {editingId && (
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          setEditingId(null);
                          setEditingPath(null);
                          setSelectedFile(null);
                          setFormData({
                            title: '',
                            month: '',
                            year: new Date().getFullYear().toString(),
                            description: '',
                            featured: false,
                          });
                        }}
                      >
                        Cancel Editing
                      </Button>
                    )}
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Manage Tab */}
            <TabsContent value="manage">
              <div className="space-y-4">
                {isLoading ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-muted-foreground" />
                      <p className="text-muted-foreground">Loading newsletters...</p>
                    </CardContent>
                  </Card>
                ) : sortedNewsletters.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">No newsletters uploaded yet</p>
                    </CardContent>
                  </Card>
                ) : (
                  sortedNewsletters.map((newsletter) => (
                    <Card key={newsletter.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-xl">{newsletter.title}</CardTitle>
                              {newsletter.featured && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                                  Featured
                                </span>
                              )}
                            </div>
                            <CardDescription className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {newsletter.month} {newsletter.year}
                            </CardDescription>
                            {newsletter.description && (
                              <p className="text-sm text-muted-foreground pt-2">
                                {newsletter.description}
                              </p>
                            )}
                          </div>
                          <FileText className="w-10 h-10 text-primary" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          <Button asChild variant="outline" size="sm">
                            <a
                              href={newsletter.pdf_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              View PDF
                            </a>
                          </Button>
                          <Button asChild variant="outline" size="sm">
                            <a href={newsletter.pdf_url} download>
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </a>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(newsletter)}
                          >
                            <Pencil className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDelete(newsletter)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </>
  );
}
