updates
import { Youtube, Facebook } from "lucide-react";
import { FadeIn } from "../animations/FadeIn";
import siteConfig from "@/content/site-config.json";

export function SocialMediaSection() {
  const socialLinks = siteConfig.socialMedia;

  return (
    <section id="social" className="section-church bg-muted/30">
      <div className="container max-w-5xl mx-auto px-5">
        <FadeIn>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">Stay Connected</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Follow us on social media to stay updated on events, sermons, and community news.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="flex flex-wrap justify-center gap-6">
            {/* YouTube */}
            {socialLinks.youtube && (
              <a
                href={socialLinks.youtube}
                target="_blank"
                rel="noreferrer"
                className="card-church flex items-center gap-4 px-8 py-6 hover:shadow-lg transition-shadow group"
              >
                <div className="w-12 h-12 rounded-lg bg-[#FF0000]/10 flex items-center justify-center group-hover:bg-[#FF0000]/20 transition-colors">
                  <Youtube className="w-6 h-6 text-[#FF0000]" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-lg">YouTube</h3>
                  <p className="text-sm text-muted-foreground">Watch sermons & events</p>
                </div>
              </a>
            )}

            {/* Facebook */}
            {socialLinks.facebook && (
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noreferrer"
                className="card-church flex items-center gap-4 px-8 py-6 hover:shadow-lg transition-shadow group"
              >
                <div className="w-12 h-12 rounded-lg bg-[#1877F2]/10 flex items-center justify-center group-hover:bg-[#1877F2]/20 transition-colors">
                  <Facebook className="w-6 h-6 text-[#1877F2]" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-lg">Facebook</h3>
                  <p className="text-sm text-muted-foreground">Join our community</p>
                </div>
              </a>
            )}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
