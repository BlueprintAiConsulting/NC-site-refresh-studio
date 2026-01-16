import { Youtube, Facebook, ExternalLink } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "./animations/FadeIn";

export function Watch() {
  return (
    <section id="watch" className="section-church border-t border-border">
      <div className="container max-w-5xl mx-auto px-5">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">Watch Online</h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="text-muted-foreground text-lg mb-12 max-w-2xl">
            Join us live or catch up on recent services.
          </p>
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
