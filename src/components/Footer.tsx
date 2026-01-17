import { Youtube, Facebook } from "lucide-react";
import churchLogo from "@/assets/church-logo.png";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 border-t border-border bg-secondary/30">
      <div className="container max-w-5xl mx-auto px-5">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={churchLogo} alt="New Creation Community Church" className="w-14 h-14 object-contain" />
              <div className="flex flex-col">
                <span className="font-semibold leading-tight">New Creation</span>
                <span className="text-xs text-muted-foreground">Community Church</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              3005 Emig Mill Road<br />
              Dover, PA 17315
            </p>
          </div>

          {/* Service Times */}
          <div>
            <h4 className="font-semibold mb-4">Sundays</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>8:00 AM Traditional</p>
              <p>9:15 AM Sunday School</p>
              <p>10:30 AM Contemporary</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <div className="text-sm space-y-2">
              <a href="#plan" className="block text-muted-foreground hover:text-foreground transition-colors">Plan a Visit</a>
              <a href="#ministries" className="block text-muted-foreground hover:text-foreground transition-colors">Ministries</a>
              <a href="#watch" className="block text-muted-foreground hover:text-foreground transition-colors">Watch</a>
              <a href="#give" className="block text-muted-foreground hover:text-foreground transition-colors">Give</a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="text-sm text-muted-foreground space-y-2 mb-4">
              <a href="tel:717-764-0252" className="block hover:text-foreground transition-colors">717-764-0252</a>
              <a href="mailto:newcreation25@comcast.net" className="block hover:text-foreground transition-colors break-all">newcreation25@comcast.net</a>
            </div>
            <div className="flex gap-2">
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

        <div className="pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground">
            © {currentYear} New Creation Community Church
          </p>
        </div>
      </div>
    </footer>
  );
}