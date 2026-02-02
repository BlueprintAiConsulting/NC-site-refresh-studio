import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Ministries } from "@/components/Ministries";
import { FadeIn } from "@/components/animations/FadeIn";
import { useGalleryImages } from "@/hooks/useGalleryImages";
import siteConfig from "@/lib/siteConfig";

const MinistriesPage = () => {
  const { data: heroImages } = useGalleryImages("hero-ministries");
  const heroImageUrl = heroImages?.[0]?.src ?? siteConfig.heroImage.url;
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Page Hero */}
        <section className="relative section-church pt-32 pb-12">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImageUrl})` }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-black/40" aria-hidden="true" />
          <div className="container max-w-5xl mx-auto px-5">
            <FadeIn>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 text-white drop-shadow">
                Ministries & Programs
              </h1>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="text-lg md:text-xl text-white/90 max-w-3xl">
                Discover opportunities to connect, grow, and serve at New Creation Community Church. 
                Whether you're looking for support, fellowship, or ways to make a difference, 
                there's a place for you here.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Ministries Section */}
        <Ministries />
      </main>
      <Footer />
    </>
  );
};

export default MinistriesPage;
