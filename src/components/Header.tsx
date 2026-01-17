import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { UMCLogo } from "./UMCLogo";

const navLinks = [
  { href: "#about", label: "About", isAnchor: true },
  { href: "#worship", label: "Worship", isAnchor: true },
  { href: "#grow", label: "Grow", isAnchor: true },
  { href: "#serve", label: "Serve", isAnchor: true },
  { href: "#connect", label: "Connect", isAnchor: true },
  { href: "#give", label: "Give", isAnchor: true },
  { href: "#merch", label: "Merch", isAnchor: true },
  { href: "#room-reservations", label: "Room Reservations", isAnchor: true },
  { href: "#little-lights", label: "Little Lights", isAnchor: true },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const getHref = (link: typeof navLinks[0]) => {
    if (link.isAnchor && !isHomePage) {
      return `/${link.href}`;
    }
    return link.href;
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container max-w-5xl mx-auto px-5">
        <nav className="flex items-center justify-between h-16" role="navigation" aria-label="Primary">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <UMCLogo size={32} />
            <div className="flex flex-col">
              <span className="text-sm font-semibold leading-tight">New Creation</span>
              <span className="text-xs text-muted-foreground leading-tight">Community Church</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Site">
            {navLinks.map((link) => (
              link.isAnchor ? (
                <a key={link.href} href={getHref(link)} className="link-nav">
                  {link.label}
                </a>
              ) : (
                <Link key={link.href} to={link.href} className="link-nav">
                  {link.label}
                </Link>
              )
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
              link.isAnchor ? (
                <a
                  key={link.href}
                  href={getHref(link)}
                  className="block py-3 px-2 text-foreground font-medium hover:bg-secondary rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  to={link.href}
                  className="block py-3 px-2 text-foreground font-medium hover:bg-secondary rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              )
            ))}
            <div className="pt-4">
              <a 
                href={isHomePage ? "#plan" : "/#plan"}
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
