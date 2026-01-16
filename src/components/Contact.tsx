import { Phone, Mail, MapPin } from "lucide-react";

export function Contact() {
  return (
    <section id="contact" className="section-church bg-card border-t border-border">
      <div className="container max-w-6xl mx-auto px-5">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">Contact</h2>
        <p className="text-muted-foreground max-w-2xl mb-8">
          Questions or prayer requests? Reach out and we will respond.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Church office */}
          <div className="card-church">
            <h3 className="font-semibold text-base mb-4">Church Office</h3>
            <div className="space-y-3">
              <a 
                href="tel:717-764-0252" 
                className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-secondary transition-colors"
              >
                <Phone className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">717-764-0252</span>
              </a>
              <a 
                href="mailto:newcreation25@comcast.net" 
                className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-secondary transition-colors"
              >
                <Mail className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium break-all">newcreation25@comcast.net</span>
              </a>
              <div className="flex items-start gap-3 p-3 rounded-xl border border-border">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">3005 Emig Mill Road, Dover PA 17315</span>
              </div>
            </div>
          </div>

          {/* Directions */}
          <div className="card-church">
            <h3 className="font-semibold text-base mb-4">Directions</h3>
            <div className="relative h-64 md:h-72 rounded-xl overflow-hidden border border-border bg-muted">
              <iframe
                title="Church directions map"
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps?q=3005%20Emig%20Mill%20Road%20Dover%20PA%2017315&output=embed"
              />
            </div>
            <a 
              href="https://www.google.com/maps/dir/?api=1&destination=3005+Emig+Mill+Road+Dover+PA+17315" 
              target="_blank" 
              rel="noreferrer"
              className="btn-secondary w-full mt-4"
            >
              Get Directions
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
