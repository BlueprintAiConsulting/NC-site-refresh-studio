import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "#plan", label: "Plan a Visit" },
  { href: "#ministries", label: "Ministries" },
  { href: "#events", label: "Events" },
  { href: "#watch", label: "Watch" },
  { href: "#give", label: "Give" },
  { href: "#contact", label: "Contact" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="container max-w-6xl mx-auto px-5">
        <nav className="flex items-center justify-between py-3" role="navigation" aria-label="Primary">
          <a href="#top" className="flex items-center gap-3 min-w-0">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
              style={{ background: 'var(--gold-gradient)', boxShadow: '0 8px 20px hsl(39 51% 36% / 0.25)' }}
              aria-hidden="true"
            >
              NC
            </div>
            <div className="flex flex-col min-w-0">
              <strong className="text-sm font-semibold truncate">New Creation</strong>
              <span className="text-xs text-muted-foreground">Community Church</span>
            </div>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Site">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="link-nav">
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a href="#plan" className="btn-primary hidden sm:inline-flex">
              Plan a Visit
            </a>
            <button
              className="md:hidden btn-secondary !px-3"
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile drawer */}
        {isOpen && (
          <div id="mobile-menu" className="md:hidden border-t border-border py-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block py-3 text-muted-foreground hover:text-foreground border-b border-border last:border-0"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a href="#plan" className="btn-primary w-full mt-4" onClick={() => setIsOpen(false)}>
              Plan a Visit
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
