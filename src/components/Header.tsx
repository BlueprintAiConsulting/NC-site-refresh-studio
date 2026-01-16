import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "#plan", label: "Plan a Visit" },
  { href: "#ministries", label: "Ministries" },
  { href: "#watch", label: "Watch" },
  { href: "#give", label: "Give" },
  { href: "#contact", label: "Contact" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container max-w-5xl mx-auto px-5">
        <nav className="flex items-center justify-between h-16" role="navigation" aria-label="Primary">
          {/* Logo */}
          <a href="#top" className="flex items-center gap-3">
            <div 
              className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm"
              aria-hidden="true"
            >
              NC
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold leading-tight">New Creation</span>
              <span className="text-xs text-muted-foreground leading-tight">Community Church</span>
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

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 -mr-2 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>

        {/* Mobile drawer */}
        {isOpen && (
          <div id="mobile-menu" className="md:hidden border-t border-border py-4 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block py-3 px-2 text-foreground font-medium hover:bg-secondary rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-4">
              <a 
                href="#plan" 
                className="btn-primary w-full justify-center" 
                onClick={() => setIsOpen(false)}
              >
                Plan a Visit
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}