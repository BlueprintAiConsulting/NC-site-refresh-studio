import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import churchLogo from "@/assets/church-logo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavItem {
  label: string;
  href?: string;
  isAnchor?: boolean;
  children?: { href: string; label: string; isAnchor?: boolean }[];
}

const navItems: NavItem[] = [
  {
    label: "About",
    children: [
      { href: "#about", label: "Our Story", isAnchor: true },
      { href: "/leadership", label: "Leadership", isAnchor: false },
      { href: "/ministries", label: "Ministries", isAnchor: false },
    ],
  },
  {
    label: "Worship",
    children: [
      { href: "#worship", label: "Service Times", isAnchor: true },
      { href: "#worship", label: "Watch Online", isAnchor: true },
    ],
  },
  {
    label: "Grow",
    children: [
      { href: "#grow", label: "Bible Studies", isAnchor: true },
      { href: "#grow", label: "Small Groups", isAnchor: true },
      { href: "#grow", label: "Youth Ministry", isAnchor: true },
    ],
  },
  {
    label: "Serve",
    children: [
      { href: "#serve", label: "Volunteer", isAnchor: true },
      { href: "#serve", label: "Outreach", isAnchor: true },
      { href: "#serve", label: "Missions", isAnchor: true },
    ],
  },
  {
    label: "Connect",
    children: [
      { href: "#connect", label: "Join a Group", isAnchor: true },
      { href: "#events", label: "Events", isAnchor: true },
      { href: "#gallery", label: "Gallery", isAnchor: true },
      { href: "#contact", label: "Contact Us", isAnchor: true },
    ],
  },
  { href: "#give", label: "Give", isAnchor: true },
  { href: "/newsletters", label: "Newsletters", isAnchor: false },
  { href: "#room-reservations", label: "Rooms", isAnchor: true },
  
  { href: "/admin/login", label: "Admin", isAnchor: false },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";

  const getAnchorTo = (href: string) => {
    const hash = href.startsWith("#") ? href : `#${href}`;
    return isHomePage ? { hash } : { pathname: "/", hash };
  };

  const handleAnchorNavigation = (href: string) => {
    const hash = href.startsWith("#") ? href : `#${href}`;
    const id = hash.replace("#", "");

    if (isHomePage) {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      window.history.pushState(null, "", hash);
    } else {
      navigate({ pathname: "/", hash });
    }
  };

  const renderNavItem = (item: NavItem) => {
    if (item.children) {
      const isExpanded = openDropdown === item.label;
      return (
        <DropdownMenu
          key={item.label}
          open={isExpanded}
          onOpenChange={(open) => setOpenDropdown(open ? item.label : null)}
        >
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="link-nav flex items-center gap-1 outline-none text-white hover:text-white/80"
              onMouseEnter={() => setOpenDropdown(item.label)}
            >
              {item.label}
              <ChevronDown className="w-3 h-3" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="bg-background border border-border shadow-lg z-[100]"
            onMouseLeave={() => setOpenDropdown(null)}
          >
            {item.children.map((child) =>
              child.isAnchor ? (
                <DropdownMenuItem
                  key={child.href + child.label}
                  className="cursor-pointer"
                  onSelect={(event) => {
                    event.preventDefault();
                    setOpenDropdown(null);
                    handleAnchorNavigation(child.href);
                  }}
                >
                  {child.label}
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem key={child.href + child.label} asChild>
                  <Link
                    to={child.href}
                    className="cursor-pointer"
                    onClick={() => setOpenDropdown(null)}
                  >
                    {child.label}
                  </Link>
                </DropdownMenuItem>
              )
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return item.isAnchor ? (
      <Link key={item.href} to={getAnchorTo(item.href!)} className="link-nav text-white hover:text-white/80">
        {item.label}
      </Link>
    ) : (
      <Link key={item.href} to={item.href!} className="link-nav text-white hover:text-white/80">
        {item.label}
      </Link>
    );
  };

  const renderMobileItem = (item: NavItem) => {
    if (item.children) {
      const isExpanded = openDropdown === item.label;
      return (
        <div key={item.label}>
          <button
            className="flex items-center justify-between w-full py-3 px-2 text-white font-medium hover:bg-slate-800 rounded-lg transition-colors"
            onClick={() => setOpenDropdown(isExpanded ? null : item.label)}
          >
            {item.label}
            <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
          </button>
          {isExpanded && (
            <div className="pl-4 space-y-1">
              {item.children.map((child) =>
                child.isAnchor ? (
                  <Link
                    key={child.href + child.label}
                    to={getAnchorTo(child.href)}
                    className="block py-2 px-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {child.label}
                  </Link>
                ) : (
                  <Link
                    key={child.href + child.label}
                    to={child.href}
                    className="block py-2 px-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {child.label}
                  </Link>
                )
              )}
            </div>
          )}
        </div>
      );
    }

    return item.isAnchor ? (
      <Link
        key={item.href}
        to={getAnchorTo(item.href!)}
        className="block py-3 px-2 text-white font-medium hover:bg-slate-800 rounded-lg transition-colors"
        onClick={() => setIsOpen(false)}
      >
        {item.label}
      </Link>
    ) : (
      <Link
        key={item.href}
        to={item.href!}
        className="block py-3 px-2 text-white font-medium hover:bg-slate-800 rounded-lg transition-colors"
        onClick={() => setIsOpen(false)}
      >
        {item.label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900 backdrop-blur-sm border-b border-border">
      <div className="container max-w-5xl mx-auto px-5">
        <nav className="flex items-center justify-between h-16" role="navigation" aria-label="Primary">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src={churchLogo} alt="New Creation Community Church" className="w-16 h-16 object-contain drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]" />
            <div className="flex flex-col">
              <span className="text-base font-semibold leading-tight text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>New Creation</span>
              <span className="text-xs text-slate-300 leading-tight tracking-wide uppercase" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Community Church</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Site">
            {navItems.map(renderNavItem)}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 -mr-2 text-white hover:text-white/80 transition-colors"
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
            {navItems.map(renderMobileItem)}
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
