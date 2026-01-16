import { Heart, Users, ExternalLink } from "lucide-react";

export function Ministries() {
  return (
    <section id="ministries" className="section-church bg-card border-t border-border">
      <div className="container max-w-6xl mx-auto px-5">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">Ministries & Support</h2>
        <p className="text-muted-foreground max-w-2xl mb-8">
          Clear pathways to help people take the next step and find support.
        </p>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          {/* GriefShare */}
          <div className="card-church">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
              style={{ background: 'hsl(var(--accent-soft))' }}
            >
              <Heart className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-base mb-2">GriefShare</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Support and encouragement for those walking through loss.
            </p>
            <div className="text-xs text-muted-foreground mb-4">
              <strong className="text-foreground">Typical format:</strong> 13-week sessions • 
              <strong className="text-foreground"> Thursdays</strong> 3:30–5:00 PM • 
              <strong className="text-foreground"> Cost:</strong> $20 (scholarships available)
            </div>
            <a href="#contact" className="btn-primary">Request Info</a>
          </div>

          {/* DivorceCare */}
          <div className="card-church">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
              style={{ background: 'hsl(var(--accent-soft))' }}
            >
              <Heart className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-base mb-2">DivorceCare</h3>
            <p className="text-sm text-muted-foreground mb-3">
              A Christ-centered program for those experiencing separation or divorce.
            </p>
            <div className="text-xs text-muted-foreground mb-4">
              <strong className="text-foreground">Status:</strong> Not currently offered (we can help you find a nearby group).
            </div>
            <a 
              href="https://www.divorcecare.org/" 
              target="_blank" 
              rel="noreferrer" 
              className="btn-secondary inline-flex items-center gap-2"
            >
              Find a Group <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Men's Alliance */}
        <div className="card-church">
          <div className="flex items-start gap-4">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'hsl(var(--accent-soft))' }}
            >
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-base mb-2">Men's Alliance</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Brotherhood, growth, and accountability in a welcoming group.
              </p>
              <div className="text-xs text-muted-foreground mb-4">
                <strong className="text-foreground">Meets:</strong> Tuesdays at 6:30 PM • Outdoor workout + devotional
              </div>
              <a href="#contact" className="btn-primary">Join Us</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
