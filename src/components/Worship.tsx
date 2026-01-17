import { Youtube, Facebook, ExternalLink, Music, Clock } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "./animations/FadeIn";

export function Worship() {
  return (
    <section id="worship" className="section-church border-t border-border">
      <div className="container max-w-5xl mx-auto px-5">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">Worship</h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="text-muted-foreground text-lg mb-12 max-w-2xl">
            Join us for uplifting worship experiences in-person or online.
          </p>
        </FadeIn>

        {/* Service Times */}
        <FadeIn delay={0.15}>
          <div className="card-church mb-8 max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Sunday Service Times</h3>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-secondary/50 rounded-lg">
                <p className="font-semibold text-lg">8:00 AM</p>
                <p className="text-sm text-muted-foreground">Traditional Service</p>
              </div>
              <div className="text-center p-4 bg-secondary/50 rounded-lg">
                <p className="font-semibold text-lg">9:15 AM</p>
                <p className="text-sm text-muted-foreground">Sunday School</p>
              </div>
              <div className="text-center p-4 bg-secondary/50 rounded-lg">
                <p className="font-semibold text-lg">10:30 AM</p>
                <p className="text-sm text-muted-foreground">Contemporary Service</p>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Worship Style */}
        <FadeIn delay={0.2}>
          <div className="card-church mb-8 max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Music className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">What to Expect</h3>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              Our traditional service features classic hymns and organ music, while our contemporary 
              service includes a full worship band with modern songs. Both services include a 
              relevant message from Scripture and opportunities for prayer.
            </p>
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Childcare available</strong> during all services for ages 0-4.
            </p>
          </div>
        </FadeIn>

        {/* Watch Online */}
        <FadeIn delay={0.25}>
          <h3 className="font-semibold text-lg mb-4">Watch Online</h3>
        </FadeIn>
        <StaggerContainer className="grid sm:grid-cols-2 gap-6 max-w-2xl">
          <StaggerItem>
            <a 
              href="https://www.youtube.com/@newcreationcommunitychurch4561" 
              target="_blank" 
              rel="noreferrer"
              className="card-church hover:border-primary/30 transition-colors group block h-full"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Youtube className="w-5 h-5 text-primary" />
                </div>
                <span className="font-semibold">YouTube</span>
                <ExternalLink className="w-3 h-3 text-muted-foreground ml-auto group-hover:text-primary transition-colors" />
              </div>
              <p className="text-sm text-muted-foreground">
                Live at 8:00 AM and 10:30 AM services
              </p>
            </a>
          </StaggerItem>

          <StaggerItem>
            <a 
              href="https://www.facebook.com/profile.php?id=100064726481440" 
              target="_blank" 
              rel="noreferrer"
              className="card-church hover:border-primary/30 transition-colors group block h-full"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Facebook className="w-5 h-5 text-primary" />
                </div>
                <span className="font-semibold">Facebook</span>
                <ExternalLink className="w-3 h-3 text-muted-foreground ml-auto group-hover:text-primary transition-colors" />
              </div>
              <p className="text-sm text-muted-foreground">
                Live for 10:30 AM contemporary service
              </p>
            </a>
          </StaggerItem>
        </StaggerContainer>
      </div>
    </section>
  );
}
