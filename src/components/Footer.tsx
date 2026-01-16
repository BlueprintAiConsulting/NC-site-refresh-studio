import { Youtube, Facebook } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-10 border-t border-border bg-card">
      <div className="container max-w-6xl mx-auto px-5">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs"
                style={{ background: 'var(--gold-gradient)' }}
              >
                NC
              </div>
              <strong className="text-sm">New Creation</strong>
            </div>
            <p className="text-sm text-muted-foreground">
              3005 Emig Mill Road<br />
              Dover PA 17315
            </p>
          </div>

          {/* Service Times */}
          <div>
            <strong className="text-sm block mb-3">Service Times</strong>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>8:00 AM Traditional</p>
              <p>9:15 AM Sunday School</p>
              <p>10:30 AM Contemporary</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <strong className="text-sm block mb-3">Quick Links</strong>
            <div className="text-sm space-y-1">
              <a href="#plan" className="block text-muted-foreground hover:text-foreground transition-colors">Plan a Visit</a>
              <a href="#ministries" className="block text-muted-foreground hover:text-foreground transition-colors">Ministries</a>
              <a href="#watch" className="block text-muted-foreground hover:text-foreground transition-colors">Watch</a>
              <a href="#give" className="block text-muted-foreground hover:text-foreground transition-colors">Give</a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <strong className="text-sm block mb-3">Contact</strong>
            <div className="text-sm text-muted-foreground space-y-1">
              <a href="tel:717-764-0252" className="block hover:text-foreground transition-colors">717-764-0252</a>
              <a href="mailto:newcreation25@comcast.net" className="block hover:text-foreground transition-colors break-all">newcreation25@comcast.net</a>
            </div>
            <div className="flex gap-3 mt-4">
              <a 
                href="https://www.youtube.com/@newcreationcommunitychurch4561" 
                target="_blank" 
                rel="noreferrer"
                className="w-9 h-9 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a 
                href="https://www.facebook.com/profile.php?id=100064726481440" 
                target="_blank" 
                rel="noreferrer"
                className="w-9 h-9 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground">
            © {currentYear} New Creation Community Church
          </p>
        </div>
      </div>
    </footer>
  );
}
