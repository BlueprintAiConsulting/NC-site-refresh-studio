import { Heart, CreditCard, ExternalLink } from "lucide-react";

export function Give() {
  return (
    <section id="give" className="section-church border-t border-border">
      <div className="container max-w-6xl mx-auto px-5">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">Give</h2>
        <p className="text-muted-foreground max-w-2xl mb-8">
          Your generosity supports the mission and ministries of New Creation.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Online giving */}
          <div className="card-church">
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'hsl(var(--accent-soft))' }}
              >
                <CreditCard className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-base">Give Online</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              One direct button to giving.
            </p>
            <a 
              href="https://paypal.me/nccc3005" 
              target="_blank" 
              rel="noreferrer"
              className="btn-primary inline-flex items-center gap-2"
            >
              Give Online <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-xs text-muted-foreground mt-3">
              If the giving provider changes, this stays a one-link update.
            </p>
          </div>

          {/* Other ways */}
          <div className="card-church">
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'hsl(var(--accent-soft))' }}
              >
                <Heart className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-base">Other Ways to Give</h3>
            </div>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• In-person during service.</li>
              <li>• Questions: <a href="mailto:newcreation25@comcast.net" className="underline hover:text-foreground">newcreation25@comcast.net</a> or <a href="tel:717-764-0252" className="underline hover:text-foreground">717-764-0252</a>.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
