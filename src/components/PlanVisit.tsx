import { Phone, Mail, MapPin } from "lucide-react";
import { useState, FormEvent } from "react";

export function PlanVisit() {
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Form is a placeholder - in production, connect to a form service
    alert("Form submission is a placeholder. Please call 717-764-0252 or email newcreation25@comcast.net.");
  };

  return (
    <section id="plan" className="section-church border-t border-border">
      <div className="container max-w-6xl mx-auto px-5">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">Plan a Visit</h2>
        <p className="text-muted-foreground max-w-2xl mb-8">
          Everything you need for a first visit. Call or email, or keep it simple and just show up.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Location card */}
          <div className="card-church">
            <h3 className="font-semibold text-base mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              Location
            </h3>
            <p className="text-sm font-medium mb-4">3005 Emig Mill Road, Dover PA 17315</p>

            <div className="relative h-64 md:h-80 rounded-xl overflow-hidden border border-border bg-muted">
              <iframe
                title="Church location map"
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

          {/* Contact card */}
          <div className="card-church">
            <h3 className="font-semibold text-base mb-3">Contact</h3>
            <p className="text-xs text-muted-foreground mb-4">Fastest way to reach the church office:</p>

            <div className="space-y-3 mb-6">
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
            </div>

            <div className="h-px bg-border my-5" />

            <h3 className="font-semibold text-base mb-2">Quick Message</h3>
            <p className="text-xs text-muted-foreground mb-4">
              This form is a placeholder. For now, call or email us directly.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label htmlFor="name" className="text-sm font-medium mb-1 block">Name</label>
                <input
                  id="name"
                  type="text"
                  className="form-input"
                  placeholder="Your name"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="email" className="text-sm font-medium mb-1 block">Email</label>
                <input
                  id="email"
                  type="email"
                  className="form-input"
                  placeholder="you@example.com"
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="message" className="text-sm font-medium mb-1 block">Question (optional)</label>
                <textarea
                  id="message"
                  className="form-input resize-y"
                  rows={3}
                  placeholder="Anything you'd like to ask?"
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                />
              </div>
              <button type="submit" className="btn-primary w-full">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
