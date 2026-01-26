import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "./animations/FadeIn";
import siteConfig, { formatAddressLines } from "@/lib/siteConfig";

export function Contact() {
  const [streetLine, cityLine] = formatAddressLines();

  return (
    <section id="contact" className="section-church border-t border-border">
      <div className="container max-w-5xl mx-auto px-5">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">Contact</h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="text-muted-foreground text-lg mb-12 max-w-2xl">
            Questions or prayer requests? We'd love to hear from you.
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl">
          {/* Contact details */}
          <StaggerContainer className="space-y-4">
            <StaggerItem>
              <a 
                href={`tel:${siteConfig.church.contact.phone}`} 
                className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-secondary transition-colors"
              >
                <Phone className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">{siteConfig.church.contact.phone}</p>
                  <p className="text-sm text-muted-foreground">Call the church office</p>
                </div>
              </a>
            </StaggerItem>
            
            <StaggerItem>
              <a 
                href={`mailto:${siteConfig.church.contact.email}`} 
                className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-secondary transition-colors"
              >
                <Mail className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium break-all">{siteConfig.church.contact.email}</p>
                  <p className="text-sm text-muted-foreground">Send us an email</p>
                </div>
              </a>
            </StaggerItem>

            <StaggerItem>
              <div className="flex items-start gap-4 p-4 rounded-lg border border-border">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">{streetLine}</p>
                  <p className="text-muted-foreground">{cityLine}</p>
                </div>
              </div>
            </StaggerItem>
          </StaggerContainer>

          {/* Service times */}
          <FadeIn delay={0.3} direction="right">
            <div className="card-church">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-lg">Service Times</h3>
              </div>
              <div className="space-y-3">
                {siteConfig.serviceTimes.map((service) => (
                  <div key={`${service.name}-${service.time}`} className="flex justify-between">
                    <span className="text-muted-foreground">{service.name}</span>
                    <span className="font-medium">{service.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
