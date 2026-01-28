import { CheckCircle2 } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "./animations/FadeIn";

const beliefPoints = [
  "We accept the Apostle’s Creed as our orthodox beliefs.",
  "God is one God in Three Persons: Father, Son, and Holy Spirit.",
  "Jesus was both human and divine.",
  "The Bible is the inspired Word of God and contains all instruction for salvation.",
  "Without exception, all persons are sinners and fallen from original righteousness.",
  "God’s grace is available for all, and all have freewill to accept or deny Him.",
  "Salvation is by way of Jesus Christ through His teaching, His atoning death, His resurrection, and His promised return.",
  "Salvation is by God’s grace, through faith, and not by any works of humans, although good works are a natural result of our love for God.",
  "We recognize two sacraments: Holy Communion and Baptism.",
  "Methodists recognize that prevenient, justifying, and sanctifying grace denote God’s gift for living the full Christian life.",
];

export function WhatWeBelieve() {
  return (
    <section id="beliefs" className="section-church border-t border-border">
      <div className="container max-w-5xl mx-auto px-5">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">What We Believe</h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="text-muted-foreground text-lg mb-10 max-w-2xl">
            A brief summary of the faith that guides and shapes our community.
          </p>
        </FadeIn>

        <StaggerContainer className="grid gap-4">
          {beliefPoints.map((belief) => (
            <StaggerItem key={belief}>
              <div className="card-church flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  {belief}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
