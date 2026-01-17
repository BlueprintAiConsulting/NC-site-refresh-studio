import { HandHeart, Music, Baby, UtensilsCrossed, Megaphone, Users } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "./animations/FadeIn";
import worshipTeamImg from "@/assets/serve-worship-team.jpg";

const serveOpportunities = [
  {
    icon: Music,
    title: "Worship Team",
    description: "Use your musical gifts to lead others in worship.",
    image: worshipTeamImg,
  },
  {
    icon: Baby,
    title: "Children's Ministry",
    description: "Help nurture the faith of our youngest members.",
  },
  {
    icon: UtensilsCrossed,
    title: "Hospitality",
    description: "Welcome guests and help with fellowship events.",
  },
  {
    icon: Megaphone,
    title: "Tech & Media",
    description: "Support our services with sound, video, and livestreaming.",
  },
  {
    icon: HandHeart,
    title: "Outreach",
    description: "Serve our community through local mission projects.",
  },
  {
    icon: Users,
    title: "Care Teams",
    description: "Provide meals, visits, and support to those in need.",
  },
];

export function Serve() {
  return (
    <section id="serve" className="section-church border-t border-border">
      <div className="container max-w-5xl mx-auto px-5">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">Serve</h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="text-muted-foreground text-lg mb-12 max-w-2xl">
            Discover your gifts and make a difference by serving others.
          </p>
        </FadeIn>

        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {serveOpportunities.map((item) => (
            <StaggerItem key={item.title}>
              <div className="card-church h-full overflow-hidden p-0">
                {item.image ? (
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                ) : (
                  <div className="h-40 bg-muted/50 flex items-center justify-center">
                    <item.icon className="w-12 h-12 text-muted-foreground/50" />
                  </div>
                )}
                <div className="p-6">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeIn delay={0.4}>
          <div className="mt-8 text-center">
            <a href="#contact" className="btn-primary">
              Sign Up to Serve
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
