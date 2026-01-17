import { Users, Calendar, Coffee, MessageCircle } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "./animations/FadeIn";

const connectWays = [
  {
    icon: Coffee,
    title: "First-Time Guest?",
    description: "Stop by our Welcome Center after any service. We'd love to meet you and answer your questions.",
  },
  {
    icon: Users,
    title: "Join a Small Group",
    description: "Find community in a group that fits your schedule and interests.",
  },
  {
    icon: Calendar,
    title: "Attend an Event",
    description: "Check our calendar for upcoming fellowship events and activities.",
  },
  {
    icon: MessageCircle,
    title: "Prayer Requests",
    description: "Share your prayer needs with our caring community.",
  },
];

export function Connect() {
  return (
    <section id="connect" className="section-church bg-secondary/50 border-t border-border">
      <div className="container max-w-5xl mx-auto px-5">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">Connect</h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="text-muted-foreground text-lg mb-12 max-w-2xl">
            We believe life is better together. Find your place in our community.
          </p>
        </FadeIn>

        <StaggerContainer className="grid sm:grid-cols-2 gap-6 mb-8">
          {connectWays.map((item) => (
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
          <div className="card-church max-w-2xl mx-auto text-center">
            <h3 className="font-semibold text-lg mb-2">Stay in the Loop</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Follow us on social media and subscribe to our newsletter for updates on events, 
              sermon series, and ways to get involved.
            </p>
            <a href="#contact" className="btn-primary">
              Contact Us
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
