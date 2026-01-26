import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Upload, 
  Download, 
  Trash2, 
  ArrowLeft,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';
import newslettersData from '@/content/newsletters.json';

export default function AdminNewsletters() {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    month: '',
    year: new Date().getFullYear().toString(),
    description: '',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Please select a PDF file');
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
      toast.success(`Selected: ${file.name}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast.error('Please select a PDF file');
      return;
    }

    if (!formData.title || !formData.month || !formData.year) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsUploading(true);

    try {
      // In a real implementation, you would:
      // 1. Upload the PDF to your server/storage
      // 2. Update the newsletters.json file via API
      
      toast.info('Upload feature coming soon!', {
        description: 'For now, manually upload PDFs to public/newsletters/ and update newsletters.json',
        duration: 5000,
      });

      // Reset form
      setFormData({
        title: '',
        month: '',
        year: new Date().getFullYear().toString(),
        description: '',
      });
      setSelectedFile(null);
      if (e.target instanceof HTMLFormElement) {
        e.target.reset();
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload newsletter');
    } finally {
      setIsUploading(false);
    }
  };

  const sortedNewsletters = [...newslettersData.newsletters].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

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
                        Newsletter PDF <span className="text-destructive">*</span>
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

                    <Button type="submit" disabled={isUploading} className="w-full">
                      {isUploading ? (
                        <>Uploading...</>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Newsletter
                        </>
                      )}
                    </Button>
                  </form>

                  {/* Manual Upload Instructions */}
                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2 text-blue-900 dark:text-blue-100">
                      📝 Manual Upload Instructions
                    </h4>
                    <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
                      <li>Upload your PDF to <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">public/newsletters/</code></li>
                      <li>Name it following the pattern: <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">january-2026.pdf</code></li>
                      <li>Edit <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">src/content/newsletters.json</code></li>
                      <li>Add a new entry with the PDF path and details</li>
                      <li>Set <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">"featured": true</code> for the latest newsletter</li>
                    </ol>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Manage Tab */}
            <TabsContent value="manage">
              <div className="space-y-4">
                {sortedNewsletters.length === 0 ? (
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
                              href={newsletter.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              View PDF
                            </a>
                          </Button>
                          <Button asChild variant="outline" size="sm">
                            <a href={newsletter.pdfUrl} download>
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </a>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => {
                              toast.info('Delete feature coming soon!', {
                                description: 'Manually remove from newsletters.json for now',
                              });
                            }}
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
