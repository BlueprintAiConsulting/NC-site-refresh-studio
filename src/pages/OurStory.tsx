import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FadeIn } from "@/components/animations/FadeIn";
import { OurStorySection } from "@/components/sections/OurStorySection";
import { WhatWeBelieve } from "@/components/WhatWeBelieve";

const OurStory = () => {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Header />
      <main id="main">
        <section className="py-16 md:py-24 border-b border-border">
          <div className="container max-w-5xl mx-auto px-5">
            <FadeIn>
              <h1 className="text-4xl md:text-5xl font-semibold mb-6">Our Story</h1>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="text-lg text-muted-foreground max-w-2xl">
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
