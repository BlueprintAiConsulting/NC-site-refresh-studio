import { Heart, Target, BookOpen } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "./animations/FadeIn";
import missionImg from "@/assets/hero-church-sunset.webp";
import visionImg from "@/assets/grow-bible-study.jpg";
import valuesImg from "@/assets/grow-small-groups.jpg";

export function About() {
  return (
    <section id="about" className="section-church border-t border-border">
      <div className="container max-w-5xl mx-auto px-5">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">About Us</h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="text-muted-foreground text-lg mb-12 max-w-2xl">
            Discover who we are and what drives our community of faith.
          </p>
        </FadeIn>

        <StaggerContainer className="grid md:grid-cols-3 gap-6 mb-12">
          <StaggerItem>
            <div className="card-church h-full flex flex-col items-center">
              <div className="relative aspect-square w-full max-w-[260px] rounded-full overflow-hidden flex items-center justify-center text-center p-6">
                <img
                  src={missionImg}
                  alt="Church gathering"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/55" />
                <div className="relative z-10 text-white">
                  <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center mx-auto mb-3">
                    <Target className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Our Mission</h3>
                  <p className="text-sm leading-relaxed text-white/90">
                    To connect people with God and each other, empowering every person to grow in faith,
                    serve with purpose, and share the love of Christ in our community and beyond.
                  </p>
                </div>
              </div>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="card-church h-full flex flex-col items-center">
              <div className="relative aspect-square w-full max-w-[260px] rounded-full overflow-hidden flex items-center justify-center text-center p-6">
                <img
                  src={visionImg}
                  alt="Bible study group"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/55" />
                <div className="relative z-10 text-white">
                  <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center mx-auto mb-3">
                    <Heart className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Our Vision</h3>
                  <p className="text-sm leading-relaxed text-white/90">
                    A vibrant community where everyone experiences genuine belonging, discovers their
                    God-given gifts, and becomes equipped to make a lasting difference in the world.
                  </p>
                </div>
              </div>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="card-church h-full flex flex-col items-center">
              <div className="relative aspect-square w-full max-w-[260px] rounded-full overflow-hidden flex items-center justify-center text-center p-6">
                <img
                  src={valuesImg}
                  alt="Small group fellowship"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/55" />
                <div className="relative z-10 text-white">
                  <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Our Values</h3>
                  <p className="text-sm leading-relaxed text-white/90">
                    We are rooted in Scripture, passionate about worship, committed to authentic
                    relationships, and dedicated to serving others with compassion and grace.
                  </p>
                </div>
              </div>
            </div>
          </StaggerItem>
        </StaggerContainer>

        {/* History section */}
        <FadeIn delay={0.3}>
          <div className="card-church bg-secondary/50">
            <h3 className="font-semibold text-xl mb-4">Our Story</h3>
            <div className="prose prose-sm max-w-none text-muted-foreground">
              <p className="mb-4 leading-relaxed">
                New Creation Community Church was founded with a simple vision: to create a welcoming 
                space where people from all walks of life could encounter God's transforming love. 
                What began as a small gathering of faithful believers has grown into a vibrant 
                community dedicated to worship, discipleship, and service.
              </p>
              <p className="mb-4 leading-relaxed">
                Over the years, we have seen countless lives changed through the power of the Gospel. 
                From our support ministries like GriefShare to our weekly worship gatherings, we 
                remain committed to meeting people where they are and walking alongside them on 
                their spiritual journey.
              </p>
              <p className="leading-relaxed">
                Today, we continue to grow as a family of faith, united by our shared commitment 
                to loving God, loving people, and making disciples. Whether you're seeking community, 
                exploring faith for the first time, or looking for a place to call home, you are 
                welcome here.
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
