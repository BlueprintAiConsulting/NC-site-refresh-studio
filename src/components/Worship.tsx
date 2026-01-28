import { Youtube, Facebook, ExternalLink, Music, Clock, Radio, Sparkles } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "./animations/FadeIn";
import siteConfig from "@/lib/siteConfig";
import { useGalleryImages } from "@/hooks/useGalleryImages";
import worshipBubbleOne from "@/assets/hero-church-sunset.webp";
import worshipBubbleTwo from "@/assets/grow-discipleship.jpg";
import worshipBubbleThree from "@/assets/grow-sunday-school.jpg";

export function Worship() {
  const { data: bubbleOneImages } = useGalleryImages("worship-bubble-1");
  const { data: bubbleTwoImages } = useGalleryImages("worship-bubble-2");
  const { data: bubbleThreeImages } = useGalleryImages("worship-bubble-3");

  const bubbleImages = [
    bubbleOneImages?.[0]?.src || worshipBubbleOne,
    bubbleTwoImages?.[0]?.src || worshipBubbleTwo,
    bubbleThreeImages?.[0]?.src || worshipBubbleThree,
  ];

  const worshipBubbles = [
    {
      title: "Traditional Worship",
      description: "Classic hymns and a reflective atmosphere at 8:00 AM.",
      icon: Music,
    },
    {
      title: "Contemporary Worship",
      description: "Modern worship band and Scripture-centered teaching at 10:30 AM.",
      icon: Sparkles,
    },
    {
      title: "Watch Online",
      description: "Join services live or catch up anytime on YouTube.",
      icon: Radio,
    },
  ];

  return (
    <section
      id="worship"
      className="section-church py-16 md:py-24 border-t border-border relative overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute right-8 bottom-12 h-72 w-72 rounded-full overflow-hidden opacity-15">
          <img src={bubbleImages[1]} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="absolute -left-16 top-6 h-52 w-52 rounded-full overflow-hidden opacity-20">
          <img src={bubbleImages[0]} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(228,0,43,0.08),transparent_45%),radial-gradient(circle_at_20%_80%,rgba(175,41,46,0.06),transparent_45%)]" />
      </div>
      <div className="container max-w-5xl mx-auto px-5 relative">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">Worship</h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="text-muted-foreground text-lg mb-12 max-w-2xl">
            Join us for uplifting worship experiences in-person or online.
          </p>
        </FadeIn>

        {/* Worship Bubbles */}
        <StaggerContainer className="grid md:grid-cols-3 gap-6 mb-12" staggerDelay={0.08}>
          {worshipBubbles.map((bubble, index) => {
            const Icon = bubble.icon;
            return (
              <StaggerItem key={bubble.title}>
                <div className="card-church h-full flex flex-col items-center">
                  <div className="relative aspect-square w-full max-w-[240px] rounded-full overflow-hidden flex items-center justify-center text-center p-6">
                    <img
                      src={bubbleImages[index]}
                      alt={bubble.title}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/55" />
                    <div className="relative z-10 text-white text-glow">
                      <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center mx-auto mb-3">
                        <Icon className="w-5 h-5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]" />
                      </div>
                      <h3 className="font-semibold text-base mb-2">{bubble.title}</h3>
                      <p className="text-sm leading-relaxed text-white/90">{bubble.description}</p>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

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
              {siteConfig.serviceTimes.map((service) => (
                <div key={`${service.name}-${service.time}`} className="text-center p-4 bg-secondary/50 rounded-lg">
                  <p className="font-semibold text-lg">{service.time}</p>
                  <p className="text-sm text-muted-foreground">{service.name}</p>
                </div>
              ))}
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
        <StaggerContainer className="grid sm:grid-cols-3 gap-6 max-w-3xl">
          {/* Live Stream - Featured */}
          <StaggerItem>
            <a 
              href={siteConfig.socialMedia.liveStream}
              target="_blank" 
              rel="noreferrer"
              className="card-church hover:border-primary/30 transition-colors group block h-full bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Radio className="w-5 h-5 text-primary" />
                </div>
                <span className="font-semibold">Stream Live</span>
                <ExternalLink className="w-3 h-3 text-muted-foreground ml-auto group-hover:text-primary transition-colors" />
              </div>
              <p className="text-sm text-muted-foreground">
                Watch services live on YouTube
              </p>
            </a>
          </StaggerItem>

          <StaggerItem>
            <a 
              href={siteConfig.socialMedia.youtube}
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
                Past sermons & services
              </p>
            </a>
          </StaggerItem>

          <StaggerItem>
            <a 
              href={siteConfig.socialMedia.facebook}
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
                Join our community online
              </p>
            </a>
          </StaggerItem>
        </StaggerContainer>
      </div>
    </section>
  );
}
