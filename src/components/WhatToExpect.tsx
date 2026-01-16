import { Clock, Users, Heart } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "./animations/FadeIn";

const expectations = [
  {
    icon: Clock,
    title: "Arrive & Settle In",
    description: "Easy parking on site. Come through the main entrance — dress is casual, coffee is available.",
  },
  {
    icon: Heart,
    title: "Worship Together",
    description: "Traditional service at 8:00 AM features hymns and liturgy. Contemporary at 10:30 AM offers modern worship music.",
  },
  {
    icon: Users,
    title: "Connect at Your Pace",
    description: "Sunday School at 9:15 AM for all ages. Stay for fellowship, or slip out quietly — no pressure.",
  },
];

export function WhatToExpect() {
  return (
    <section id="expect" className="section-church bg-secondary/50 border-t border-border">
      <div className="container max-w-5xl mx-auto px-5">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">What to Expect</h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="text-muted-foreground text-lg mb-12 max-w-2xl">
            Your first visit should feel comfortable, not overwhelming.
          </p>
        </FadeIn>

        <StaggerContainer className="grid md:grid-cols-3 gap-6">
          {expectations.map((item) => (
            <StaggerItem key={item.title}>
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
