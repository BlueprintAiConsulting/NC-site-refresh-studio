import { FileText, Download, Calendar } from "lucide-react";
import { FadeIn } from "./animations/FadeIn";
import newslettersData from "@/content/newsletters.json";

export function Newsletter() {
  // Get the latest featured newsletter
  const latestNewsletter = newslettersData.newsletters.find((n) => n.featured) 
    || newslettersData.newsletters[0];

  if (!latestNewsletter) {
    return null;
  }

  return (
    <section id="newsletter" className="section-church bg-gradient-to-br from-primary/5 to-secondary/30 border-y border-border">
      <div className="container max-w-5xl mx-auto px-5">
        <FadeIn>
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">Church Newsletter</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Stay informed about what's happening in our community
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="max-w-3xl mx-auto">
            <div className="card-church bg-card hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                {/* Icon/Image */}
                <div className="shrink-0">
                  <div className="w-20 h-20 rounded-xl bg-primary/10 flex items-center justify-center">
                    <FileText className="w-10 h-10 text-primary" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center gap-2 justify-center md:justify-start text-sm text-muted-foreground mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>{latestNewsletter.month} {latestNewsletter.year}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{latestNewsletter.title}</h3>
                  {latestNewsletter.description && (
                    <p className="text-muted-foreground text-sm mb-4">
                      {latestNewsletter.description}
                    </p>
                  )}
                </div>

                {/* Download Button */}
                <div className="shrink-0">
                  <a
                    href={latestNewsletter.pdfUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </a>
                </div>
              </div>
            </div>

            {/* Archive Link - Show if more than one newsletter */}
            {newslettersData.newsletters.length > 1 && (
              <div className="text-center mt-6">
                <a
                  href="#newsletter-archive"
                  className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                >
                  View past newsletters
                </a>
              </div>
            )}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
