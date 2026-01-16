import { MapPin, Clock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";

export function Hero() {
  return (
    <section className="relative min-h-[70vh] flex items-center">
      {/* Background image with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/70" />
      
      <div className="container max-w-5xl mx-auto px-5 relative z-10 py-16 md:py-24">
        {/* Main content - left aligned for contrast with image */}
        <div className="max-w-2xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 text-foreground"
          >
            You're welcome here.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl leading-relaxed"
          >
            Join us this Sunday for worship. We're a community rooted in faith, 
            growing together, and open to all.
          </motion.p>

          {/* Service times - clear, scannable */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-8 mb-10"
          >
            <div className="service-time">
              <Clock className="w-4 h-4 text-primary" />
              <span><strong>8:00 AM</strong> Traditional</span>
            </div>
            <div className="service-time">
              <Clock className="w-4 h-4 text-primary" />
              <span><strong>10:30 AM</strong> Contemporary</span>
            </div>
          </motion.div>

          {/* Primary CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col sm:flex-row gap-3 mb-10"
          >
            <a href="#plan" className="btn-primary">
              Plan a Visit
              <ArrowRight className="w-4 h-4" />
            </a>
            <a href="#watch" className="btn-secondary bg-background/80 backdrop-blur-sm">
              Watch Online
            </a>
          </motion.div>

          {/* Location - subtle, accessible */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex items-start gap-2 text-sm text-muted-foreground"
          >
            <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
            <span>3005 Emig Mill Road, Dover PA 17315</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
