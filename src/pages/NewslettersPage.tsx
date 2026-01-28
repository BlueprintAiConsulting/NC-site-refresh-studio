import { useEffect, useMemo, useState } from "react";
import { FileText, Download, Calendar, ArrowLeft, Loader2 } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations/FadeIn";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import newslettersData from "@/content/newsletters.json";
import { supabase } from "@/integrations/supabase/client";

interface NewsletterDisplay {
  id: string;
  title: string;
  month: string;
  year: string;
  date: string;
  pdfUrl: string;
  featured: boolean;
  description?: string | null;
}

export default function NewslettersPage() {
  const [newsletters, setNewsletters] = useState<NewsletterDisplay[]>(newslettersData.newsletters);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewsletters = async () => {
      const { data, error } = await supabase
        .from("newsletters" as any)
        .select("id, title, month, year, date, pdf_url, featured, description")
        .order("date", { ascending: false });

      if (!error && data && data.length > 0) {
        setNewsletters(
          (data as any[]).map((item) => ({
            id: item.id,
            title: item.title,
            month: item.month,
            year: item.year,
            date: item.date,
            pdfUrl: item.pdf_url,
            featured: item.featured ?? false,
            description: item.description,
          }))
        );
      }

      setLoading(false);
    };

    void fetchNewsletters();
  }, []);

  const sortedNewsletters = useMemo(
    () => [...newsletters].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [newsletters]
  );

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-primary/10 to-background py-20 md:py-28">
          <div className="container mx-auto px-4 max-w-6xl">
            <FadeIn>
              <Button
                asChild
                variant="ghost"
                className="mb-6"
              >
                <a href="/#newsletter" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </a>
              </Button>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6">
                Newsletter Archive
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl">
                Browse our collection of past newsletters to stay informed about church
                activities, events, and community updates.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Newsletters Grid */}
        <section className="section-church">
          <div className="container mx-auto px-4 max-w-6xl">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedNewsletters.map((newsletter) => (
                  <StaggerItem key={newsletter.id}>
                    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-3">
                          <FileText className="h-10 w-10 text-primary" />
                          {newsletter.featured && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                              Latest
                            </span>
                          )}
                        </div>
                        <CardTitle className="text-xl">
                          {newsletter.title}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {newsletter.month} {newsletter.year}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col justify-between">
                        <p className="text-sm text-muted-foreground mb-4">
                          {newsletter.description}
                        </p>
                        <div className="flex flex-col gap-2">
                          <Button asChild size="sm">
                            <a
                              href={newsletter.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              View PDF
                            </a>
                          </Button>
                          <Button asChild variant="outline" size="sm">
                            <a
                              href={newsletter.pdfUrl}
                              download
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            )}

            {sortedNewsletters.length === 0 && (
              <FadeIn>
                <Card className="max-w-2xl mx-auto">
                  <CardContent className="py-12 text-center">
                    <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-semibold mb-2">No Newsletters Yet</h3>
                    <p className="text-muted-foreground">
                      Check back soon for our latest church newsletters
                    </p>
                  </CardContent>
                </Card>
              </FadeIn>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
