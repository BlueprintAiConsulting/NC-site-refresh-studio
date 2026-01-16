import { Heart, Users, ExternalLink } from "lucide-react";

const ministries = [
  {
    icon: Heart,
    title: "GriefShare",
    description: "A 13-week support group for those walking through loss. Thursdays, 3:30–5:00 PM.",
    detail: "$20 registration (scholarships available)",
    cta: { label: "Request Info", href: "#contact" },
  },
  {
    icon: Users,
    title: "Men's Alliance",
    description: "Brotherhood, growth, and accountability. Outdoor workout followed by devotional.",
    detail: "Tuesdays at 6:30 PM",
    cta: { label: "Join Us", href: "#contact" },
  },
];

export function Ministries() {
  return (
    <section id="ministries" className="section-church bg-secondary/50 border-t border-border">
      <div className="container max-w-5xl mx-auto px-5">
        <h2 className="text-3xl md:text-4xl font-semibold mb-4">Ministries & Support</h2>
        <p className="text-muted-foreground text-lg mb-12 max-w-2xl">
          Ways to connect, grow, and find support at your own pace.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {ministries.map((ministry) => (
            <div key={ministry.title} className="card-church">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <ministry.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{ministry.title}</h3>
              <p className="text-muted-foreground text-sm mb-2">{ministry.description}</p>
              <p className="text-sm font-medium mb-4">{ministry.detail}</p>
              <a href={ministry.cta.href} className="btn-primary">
                {ministry.cta.label}
              </a>
            </div>
          ))}
        </div>

        {/* DivorceCare note */}
        <div className="card-church">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-lg mb-1">DivorceCare</h3>
              <p className="text-muted-foreground text-sm">
                Not currently offered here, but we can help you find a nearby group.
              </p>
            </div>
            <a 
              href="https://www.divorcecare.org/" 
              target="_blank" 
              rel="noreferrer" 
              className="btn-secondary shrink-0"
            >
              Find a Group <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}