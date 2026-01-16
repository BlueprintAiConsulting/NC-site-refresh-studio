import { Car, Music, Users } from "lucide-react";

const steps = [
  {
    icon: Car,
    title: "Arrive",
    subtitle: "Easy parking on site.",
    description: "Come through the main entrance. Dress is casual.",
  },
  {
    icon: Music,
    title: "Worship",
    subtitle: "Two service styles.",
    description: "Traditional at 8:00 AM and contemporary at 10:30 AM.",
  },
  {
    icon: Users,
    title: "Connect",
    subtitle: "Groups and support.",
    description: "Ministries, care groups, and ways to serve the community.",
  },
];

export function WhatToExpect() {
  return (
    <section id="expect" className="section-church bg-card border-t border-border">
      <div className="container max-w-6xl mx-auto px-5">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">What to Expect</h2>
        <p className="text-muted-foreground max-w-2xl mb-8">
          A welcoming environment, clear next steps, and space to connect with others at your own pace.
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          {steps.map((step) => (
            <div key={step.title} className="card-church">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: 'hsl(var(--accent-soft))' }}
              >
                <step.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-base mb-1">{step.title}</h3>
              <p className="text-xs text-muted-foreground mb-2">{step.subtitle}</p>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
