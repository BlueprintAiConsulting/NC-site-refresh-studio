import { Baby, Heart, Clock, Shield, GraduationCap, Phone } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "./animations/FadeIn";

const features = [
  {
    icon: Heart,
    title: "Nurturing Environment",
    description: "A loving, Christ-centered atmosphere where children feel safe and valued.",
  },
  {
    icon: GraduationCap,
    title: "Age-Appropriate Learning",
    description: "Curriculum designed to foster spiritual, social, and academic growth.",
  },
  {
    icon: Shield,
    title: "Safe & Secure",
    description: "Background-checked staff and secure check-in/check-out procedures.",
  },
  {
    icon: Clock,
    title: "Flexible Scheduling",
    description: "Full-time and part-time options to fit your family's needs.",
  },
];

export function LittleLights() {
  return (
    <section id="little-lights" className="section-church border-t border-border">
      <div className="container max-w-5xl mx-auto px-5">
        <FadeIn>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Baby className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-semibold">Little Lights Learning Center</h2>
          </div>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="text-muted-foreground text-lg mb-12 max-w-2xl">
            A nurturing preschool and childcare program for children ages 6 weeks to 5 years.
          </p>
        </FadeIn>

        <StaggerContainer className="grid sm:grid-cols-2 gap-6 mb-8">
          {features.map((item) => (
            <StaggerItem key={item.title}>
              <div className="card-church h-full">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeIn delay={0.3}>
          <div className="card-church bg-secondary/50">
            <h3 className="font-semibold text-lg mb-4">Programs Offered</h3>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div>
                <h4 className="font-medium mb-2">Infant Care</h4>
                <p className="text-sm text-muted-foreground">Ages 6 weeks - 12 months</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Toddler Program</h4>
                <p className="text-sm text-muted-foreground">Ages 1 - 2 years</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Preschool</h4>
                <p className="text-sm text-muted-foreground">Ages 3 - 4 years</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Pre-K</h4>
                <p className="text-sm text-muted-foreground">Ages 4 - 5 years</p>
              </div>
            </div>
            
            <div className="border-t border-border pt-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary" />
                <span className="text-sm">Contact us for enrollment information</span>
              </div>
              <a href="#contact" className="btn-primary">
                Schedule a Tour
              </a>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
