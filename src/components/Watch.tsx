import { Youtube, Facebook, ExternalLink } from "lucide-react";

export function Watch() {
  return (
    <section id="watch" className="section-church bg-card border-t border-border">
      <div className="container max-w-6xl mx-auto px-5">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">Watch Online</h2>
        <p className="text-muted-foreground max-w-2xl mb-8">
          Join live or watch recent services.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {/* YouTube */}
          <div className="card-church">
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'hsl(var(--accent-soft))' }}
              >
                <Youtube className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-base">YouTube</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Live at 8:00 AM and also used for the 10:30 AM service.
            </p>
            <a 
              href="https://www.youtube.com/@newcreationcommunitychurch4561" 
              target="_blank" 
              rel="noreferrer"
              className="btn-primary inline-flex items-center gap-2"
            >
              Open YouTube <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Facebook */}
          <div className="card-church">
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'hsl(var(--accent-soft))' }}
              >
                <Facebook className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-base">Facebook</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Live for the 10:30 AM contemporary service.
            </p>
            <a 
              href="https://www.facebook.com/profile.php?id=100064726481440" 
              target="_blank" 
              rel="noreferrer"
              className="btn-primary inline-flex items-center gap-2"
            >
              Open Facebook <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
