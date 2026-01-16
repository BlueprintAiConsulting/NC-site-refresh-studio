import { Phone, Mail, MapPin, Loader2, CheckCircle } from "lucide-react";
import { useState, FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { FadeIn } from "./animations/FadeIn";

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
      <div className="container max-w-5xl mx-auto px-5">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">Plan Your Visit</h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="text-muted-foreground text-lg mb-12 max-w-2xl">
            Everything you need for your first Sunday. Call ahead, or just show up.
          </p>
        </FadeIn>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Location & Map */}
          <FadeIn delay={0.2} direction="left">
            <div className="space-y-6">
              <div className="card-church">
                <h3 className="font-semibold text-lg mb-4">Location</h3>
                <div className="flex items-start gap-3 mb-6">
                  <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium">3005 Emig Mill Road</p>
                    <p className="text-muted-foreground">Dover, PA 17315</p>
                  </div>
                </div>

                <div className="relative h-48 rounded-lg overflow-hidden border border-border bg-muted mb-4">
                  <iframe
                    title="Church location"
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
                  className="btn-secondary w-full justify-center"
                >
                  Get Directions
                </a>
              </div>

              {/* Contact info */}
              <div className="card-church">
                <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
                <div className="space-y-3">
                  <a 
                    href="tel:717-764-0252" 
                    className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-secondary transition-colors"
                  >
                    <Phone className="w-4 h-4 text-primary" />
                    <span className="font-medium">717-764-0252</span>
                  </a>
                  <a 
                    href="mailto:newcreation25@comcast.net" 
                    className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-secondary transition-colors"
                  >
                    <Mail className="w-4 h-4 text-primary" />
                    <span className="font-medium break-all">newcreation25@comcast.net</span>
                  </a>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Contact form */}
          <FadeIn delay={0.3} direction="right">
            <div className="card-church">
              <h3 className="font-semibold text-lg mb-2">Let Us Know You're Coming</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Optional, but it helps us prepare a warm welcome for you.
              </p>

              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckCircle className="w-12 h-12 text-primary mb-4" />
                  <h4 className="font-semibold text-xl mb-2">We Got Your Message</h4>
                  <p className="text-muted-foreground mb-6">
                    Looking forward to seeing you Sunday.
                  </p>
                  <button 
                    onClick={() => setIsSubmitted(false)} 
                    className="btn-secondary"
                  >
                    Send Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="text-sm font-medium mb-2 block">Name *</label>
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
                    <label htmlFor="email" className="text-sm font-medium mb-2 block">Email *</label>
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
                    <label htmlFor="message" className="text-sm font-medium mb-2 block">Questions (optional)</label>
                    <textarea
                      id="message"
                      className="form-input resize-y"
                      rows={3}
                      placeholder="Anything you'd like us to know?"
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      disabled={isSubmitting}
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="btn-primary w-full justify-center"
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
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
