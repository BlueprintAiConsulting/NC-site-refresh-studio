import { ExternalLink } from "lucide-react";
import { FadeIn } from "./animations/FadeIn";

export function Give() {
  return (
    <section id="give" className="section-church bg-secondary/50 border-t border-border">
      <div className="container max-w-5xl mx-auto px-5">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">Give</h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="text-muted-foreground text-lg mb-12 max-w-2xl">
            Your generosity supports the mission and ministries of New Creation.
          </p>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="max-w-md">
            <div className="card-church">
              <a 
                href="https://paypal.me/nccc3005" 
                target="_blank" 
                rel="noreferrer"
                className="btn-primary w-full justify-center mb-4"
              >
                Give Online <ExternalLink className="w-4 h-4" />
              </a>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Secure giving through PayPal
              </p>
              <div className="border-t border-border pt-4">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Other ways to give:</strong><br />
                  In-person during Sunday services, or contact the church office.
                </p>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
