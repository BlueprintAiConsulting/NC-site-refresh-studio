import { MapPin, Clock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
// import heroBg from "@/assets/hero-church-sunset.webp";
import siteConfig, { formatFullAddress } from "@/lib/siteConfig";
import { useGalleryImages } from "@/hooks/useGalleryImages";

export function Hero() {
  const { data: heroImages } = useGalleryImages("hero");
  const heroImage = heroImages?.[0];
  const heroImageUrl = heroImage?.src ?? siteConfig.heroImage.url;
  const heroImageAlt = heroImage?.alt ?? siteConfig.heroImage.alt ?? "";
  const featuredServices = siteConfig.serviceTimes.filter((service) =>
    service.name.toLowerCase().includes("service"),
  );

  return (
    <section className="relative min-h-[85vh] flex items-center">
      {/* Background image - vibrant and visible */}
      <div 
        className="absolute inset-0 bg-cover bg-no-repeat"
        style={{ 
          backgroundImage: `url(${heroImageUrl})`,
          backgroundPosition: '55% 40%'
        }}
        aria-hidden="true"
      />
      {/* Very light overlay - 10-15% opacity to preserve vibrancy */}
      <div className="absolute inset-0 bg-black/10" />
      {/* Enhanced text scrim for better readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />
      
      <div className="container max-w-5xl mx-auto px-5 relative z-10 py-16 md:py-24">
        {/* Main content with text scrim for readability */}
        <div className="max-w-2xl">
          {/* Text container with subtle dark scrim - 25% opacity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="bg-black/35 backdrop-blur-[4px] rounded-xl p-6 md:p-8 mb-6 border border-white/10"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-4 text-white drop-shadow-2xl"
              style={{
                textShadow: '0 0 30px rgba(0, 0, 0, 0.8), 0 2px 8px rgba(0, 0, 0, 0.6), 0 0 20px rgba(228, 0, 43, 0.3)'
              }}
            >
              You're welcome here.
            </h1>
            
            <p className="text-lg md:text-xl text-white/95 max-w-xl leading-relaxed drop-shadow-lg"
              style={{
                textShadow: '0 1px 4px rgba(0, 0, 0, 0.8), 0 0 15px rgba(0, 0, 0, 0.4)'
              }}
            >
              Join us this Sunday for worship. We're a community rooted in faith, 
              growing together, and open to all.
            </p>
          </motion.div>

          {/* Service times */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-8 mb-8"
          >
            {featuredServices.map((service) => (
              <div key={`${service.name}-${service.time}`} className="flex items-center gap-2 text-white drop-shadow-lg font-medium"
                style={{
                  textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)'
                }}
              >
                <Clock className="w-4 h-4 text-white drop-shadow" />
                <span>
                  <strong>{service.time}</strong> {service.name.replace(" Service", "")}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Primary CTA with scrim */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col sm:flex-row gap-3 mb-8"
          >
            <a href="#plan" className="btn-primary">
              Plan a Visit
              <ArrowRight className="w-4 h-4" />
            </a>
            <a href="#watch" className="btn-secondary bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30">
              Watch Online
            </a>
          </motion.div>

          {/* Location */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex items-start gap-2 text-sm text-white/95 drop-shadow-lg font-medium"
            style={{
              textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)'
            }}
          >
            <MapPin className="w-4 h-4 mt-0.5 shrink-0 drop-shadow" />
            <span>{formatFullAddress()}</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
