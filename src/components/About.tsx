import { Heart, Target, BookOpen } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "./animations/FadeIn";
import { useGalleryImages } from "@/hooks/useGalleryImages";
import missionImg from "@/assets/hero-church-sunset.webp";
import visionImg from "@/assets/grow-bible-study.jpg";
import valuesImg from "@/assets/grow-small-groups.jpg";

export function About() {
  const { data: missionImages } = useGalleryImages("mission");
  const { data: visionImages } = useGalleryImages("vision");
  const { data: valuesImages } = useGalleryImages("values");

  const missionImage = missionImages?.[0]?.src || missionImg;
  const visionImage = visionImages?.[0]?.src || visionImg;
  const valuesImage = valuesImages?.[0]?.src || valuesImg;

  return (
    <section
      id="about"
      className="section-church py-16 md:py-24 border-t border-border relative overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -right-16 top-10 h-64 w-64 rounded-full overflow-hidden opacity-20">
          <img src={visionImage} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="absolute -left-20 bottom-10 h-56 w-56 rounded-full overflow-hidden opacity-15">
          <img src={missionImage} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(228,0,43,0.06),transparent_40%),radial-gradient(circle_at_85%_80%,rgba(228,0,43,0.08),transparent_45%)]" />
      </div>
      <div className="container max-w-5xl mx-auto px-5 relative">
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
              <div className="relative aspect-square w-full max-w-[360px] rounded-full overflow-hidden flex items-center justify-center text-center p-6">
                <img
                  src={missionImage}
                  alt="Church gathering"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/65" />
                <div className="relative z-10 text-white text-glow">
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
              <div className="relative aspect-square w-full max-w-[360px] rounded-full overflow-hidden flex items-center justify-center text-center p-6">
                <img
                  src={visionImage}
                  alt="Bible study group"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/65" />
                <div className="relative z-10 text-white text-glow">
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
              <div className="relative aspect-square w-full max-w-[360px] rounded-full overflow-hidden flex items-center justify-center text-center p-6">
                <img
                  src={valuesImage}
                  alt="Small group fellowship"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/65" />
                <div className="relative z-10 text-white text-glow">
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

      </div>
    </section>
  );
}
