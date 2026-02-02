import { MapPin, Clock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
// import heroBg from "@/assets/hero-church-sunset.webp";
import siteConfig, { formatFullAddress } from "@/lib/siteConfig";

export function Hero() {
  const featuredServices = siteConfig.serviceTimes.filter((service) =>
    service.name.toLowerCase().includes("service"),
  );

  return (
    <section className="relative min-h-[85vh] flex items-center">
      {/* Background image - vibrant and visible */}
      <div 
        className="absolute inset-0 bg-cover bg-no-repeat"
        style={{ 
          backgroundImage: `url(${siteConfig.heroImage.url})`,
          backgroundPosition: '55% 40%'
        }}
        aria-hidden="true"
      />
      {/* Very light overlay - 10-15% opacity to preserve vibrancy */}
      <div className="absolute inset-0 bg-black/10" />
      
      <div className="container max-w-5xl mx-auto px-5 relative z-10 py-16 md:py-24">
        {/* Main content with text scrim for readability */}
        <div className="max-w-2xl">
          {/* Text container with subtle dark scrim - 25% opacity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="bg-black/25 backdrop-blur-[2px] rounded-xl p-6 md:p-8 mb-6"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-4 text-white drop-shadow-lg">
              You're welcome here.
            </h1>
            
            <p className="text-lg md:text-xl text-white/90 max-w-xl leading-relaxed drop-shadow-md">
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
              <div key={`${service.name}-${service.time}`} className="flex items-center gap-2 text-white drop-shadow-md">
                <Clock className="w-4 h-4 text-white" />
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
            className="flex items-start gap-2 text-sm text-white/90 drop-shadow-md"
          >
            <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{formatFullAddress()}</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
