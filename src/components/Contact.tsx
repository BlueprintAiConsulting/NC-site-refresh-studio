import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "./animations/FadeIn";

export function Contact() {
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
                href="tel:717-764-0252" 
                className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-secondary transition-colors"
              >
                <Phone className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">717-764-0252</p>
                  <p className="text-sm text-muted-foreground">Call the church office</p>
                </div>
              </a>
            </StaggerItem>
            
            <StaggerItem>
              <a 
                href="mailto:newcreation25@comcast.net" 
                className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-secondary transition-colors"
              >
                <Mail className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium break-all">newcreation25@comcast.net</p>
                  <p className="text-sm text-muted-foreground">Send us an email</p>
                </div>
              </a>
            </StaggerItem>

            <StaggerItem>
              <div className="flex items-start gap-4 p-4 rounded-lg border border-border">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">3005 Emig Mill Road</p>
                  <p className="text-muted-foreground">Dover, PA 17315</p>
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
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Traditional Service</span>
                  <span className="font-medium">8:00 AM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sunday School</span>
                  <span className="font-medium">9:15 AM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contemporary Service</span>
                  <span className="font-medium">10:30 AM</span>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
