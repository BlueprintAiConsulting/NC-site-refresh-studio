import { MapPin, Clock, Phone, Mail, Youtube, Facebook } from "lucide-react";

export function Hero() {
  return (
    <section 
      className="py-16 md:py-20 border-b border-border"
      style={{ background: 'var(--hero-gradient)' }}
    >
      <div className="container max-w-6xl mx-auto px-5">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 items-start">
          {/* Left content */}
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
              Welcome
            </p>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-4">
              Come as you are. You are welcome here.
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mb-5">
              Join us this Sunday. Traditional service at <strong className="text-foreground">8:00 AM</strong> and 
              contemporary service at <strong className="text-foreground">10:30 AM</strong>. 
              Sunday School at <strong className="text-foreground">9:15 AM</strong> for adults and children. 
              We are located at <strong className="text-foreground">3005 Emig Mill Road, Dover PA 17315</strong>.
            </p>

            {/* Pills */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="pill"><span className="pill-dot" aria-hidden="true" />GriefShare support</span>
              <span className="pill"><span className="pill-dot" aria-hidden="true" />Men's Alliance</span>
              <span className="pill"><span className="pill-dot" aria-hidden="true" />Watch online</span>
              <span className="pill"><span className="pill-dot" aria-hidden="true" />Give online</span>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mb-6">
              <a href="#plan" className="btn-primary">Plan a Visit</a>
              <a href="#watch" className="btn-secondary">Watch Online</a>
              <a href="#give" className="btn-secondary">Give</a>
            </div>

            {/* Callout */}
            <div className="callout-box">
              <strong className="text-sm">New here?</strong>
              <span className="text-sm text-muted-foreground ml-1">
                Start with "Plan a Visit." We'll help you feel comfortable on your first Sunday.
              </span>
            </div>
          </div>

          {/* Quick details card */}
          <aside className="card-church" aria-label="Quick details">
            <h3 className="font-semibold text-base mb-3">Service Times</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary shrink-0" />
                <span><strong className="text-foreground">8:00 AM</strong> Traditional</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary shrink-0" />
                <span><strong className="text-foreground">9:15 AM</strong> Sunday School</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary shrink-0" />
                <span><strong className="text-foreground">10:30 AM</strong> Contemporary</span>
              </div>
            </div>

            <div className="h-px bg-border my-4" />

            <h3 className="font-semibold text-base mb-3">Contact</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <a href="tel:717-764-0252" className="hover:text-foreground transition-colors">717-764-0252</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <a href="mailto:newcreation25@comcast.net" className="hover:text-foreground transition-colors break-all">
                  newcreation25@comcast.net
                </a>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>3005 Emig Mill Road, Dover PA 17315</span>
              </div>
            </div>

            <div className="h-px bg-border my-4" />

            <a href="#plan" className="btn-primary w-full">Let us know you're coming</a>
            
            <p className="text-xs text-muted-foreground mt-3 flex items-center gap-2">
              <Youtube className="w-4 h-4" />
              <Facebook className="w-4 h-4" />
              <span>Live streaming available</span>
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
