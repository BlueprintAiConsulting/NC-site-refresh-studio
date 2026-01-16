import { Phone, Mail, MapPin, Loader2, CheckCircle } from "lucide-react";
import { useState, FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function PlanVisit() {
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!formState.name || !formState.email) {
      toast({
        title: "Required fields missing",
        description: "Please enter your name and email.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke("send-contact-email", {
        body: {
          name: formState.name,
          email: formState.email,
          message: formState.message,
        },
      });

      if (error) throw error;

      setIsSubmitted(true);
      setFormState({ name: "", email: "", message: "" });
      toast({
        title: "Message sent!",
        description: "Thank you for reaching out. We'll get back to you soon.",
      });
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again or contact us directly at 717-764-0252.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
              Send us a message and we'll get back to you soon.
            </p>

            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle className="w-12 h-12 text-primary mb-4" />
                <h4 className="font-semibold text-lg mb-2">Message Sent!</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Thank you for reaching out. We'll get back to you soon.
                </p>
                <button 
                  onClick={() => setIsSubmitted(false)} 
                  className="btn-secondary"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label htmlFor="name" className="text-sm font-medium mb-1 block">Name *</label>
                  <input
                    id="name"
                    type="text"
                    className="form-input"
                    placeholder="Your name"
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    disabled={isSubmitting}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="text-sm font-medium mb-1 block">Email *</label>
                  <input
                    id="email"
                    type="email"
                    className="form-input"
                    placeholder="you@example.com"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    disabled={isSubmitting}
                    required
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
                    disabled={isSubmitting}
                  />
                </div>
                <button 
                  type="submit" 
                  className="btn-primary w-full flex items-center justify-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Submit"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
