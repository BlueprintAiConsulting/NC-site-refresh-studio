import { Calendar } from "lucide-react";

const events = [
  {
    date: "[MMM DD]",
    name: "[Event Name]",
    description: "[One line description]",
  },
  {
    date: "[MMM DD]",
    name: "[Event Name]",
    description: "[One line description]",
  },
];

export function Events() {
  return (
    <section id="events" className="section-church border-t border-border">
      <div className="container max-w-6xl mx-auto px-5">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">Events</h2>
        <p className="text-muted-foreground max-w-2xl mb-8">
          Recommended: a single calendar source of truth (Google Calendar). This section is ready for an embed.
        </p>

        <div className="space-y-3">
          {events.map((event, index) => (
            <div 
              key={index} 
              className="card-church flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'hsl(var(--accent-soft))' }}
                >
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{event.date}</p>
                  <p className="font-medium text-base">{event.name}</p>
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                </div>
              </div>
              <a href="#contact" className="btn-secondary shrink-0">Details</a>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground mt-6">
          When you get the church calendar link, we'll embed it and stop manually updating this.
        </p>
      </div>
    </section>
  );
}
