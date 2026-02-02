import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FadeIn } from "@/components/animations/FadeIn";
import { OurStorySection } from "@/components/sections/OurStorySection";
import { WhatWeBelieve } from "@/components/WhatWeBelieve";
import { useGalleryImages } from "@/hooks/useGalleryImages";
import siteConfig from "@/lib/siteConfig";

const OurStory = () => {
  const { data: heroImages } = useGalleryImages("hero-our-story");
  const heroImageUrl = heroImages?.[0]?.src ?? siteConfig.heroImage.url;
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Header />
      <main id="main">
        <section className="relative py-16 md:py-24 border-b border-border">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImageUrl})` }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-black/40" aria-hidden="true" />
          <div className="container max-w-5xl mx-auto px-5 relative">
            <FadeIn>
              <h1 className="text-4xl md:text-5xl font-semibold mb-6 text-white drop-shadow">Our Story</h1>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="text-lg text-white/90 max-w-2xl">
                Discover how God has shaped our church family and the beliefs that guide us.
              </p>
            </FadeIn>
          </div>
        </section>
        <OurStorySection />
        <WhatWeBelieve />
      </main>
      <Footer />
    </>
  );
};

export default OurStory;
