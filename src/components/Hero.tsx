import { MapPin, Clock, ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="py-16 md:py-24 lg:py-32">
      <div className="container max-w-5xl mx-auto px-5">
        {/* Main content - centered, focused */}
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 text-foreground">
            You're welcome here.
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed">
            Join us this Sunday for worship. We're a community rooted in faith, 
            growing together, and open to all.
          </p>

          {/* Service times - clear, scannable */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mb-10 text-muted-foreground">
            <div className="service-time">
              <Clock className="w-4 h-4 text-primary" />
              <span><strong>8:00 AM</strong> Traditional</span>
            </div>
            <div className="service-time">
              <Clock className="w-4 h-4 text-primary" />
              <span><strong>10:30 AM</strong> Contemporary</span>
            </div>
          </div>

          {/* Primary CTA */}
          <div className="flex flex-col sm:flex-row gap-3 mb-10">
            <a href="#plan" className="btn-primary">
              Plan a Visit
              <ArrowRight className="w-4 h-4" />
            </a>
            <a href="#watch" className="btn-secondary">
              Watch Online
            </a>
          </div>

          {/* Location - subtle, accessible */}
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
            <span>3005 Emig Mill Road, Dover PA 17315</span>
          </div>
        </div>
      </div>
    </section>
  );
}