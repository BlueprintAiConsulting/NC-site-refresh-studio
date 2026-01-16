import { Calendar, Clock, MapPin, ArrowRight } from "lucide-react";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location?: string;
  description?: string;
  recurring?: boolean;
}

const upcomingEvents: Event[] = [
  {
    id: "1",
    title: "Sunday Worship Service",
    date: "Every Sunday",
    time: "8:00 AM & 10:30 AM",
    location: "Main Sanctuary",
    recurring: true,
  },
  {
    id: "2",
    title: "Sunday School",
    date: "Every Sunday",
    time: "9:15 AM",
    location: "Education Building",
    description: "Classes for all ages",
    recurring: true,
  },
  {
    id: "3",
    title: "Bible Study",
    date: "Wednesdays",
    time: "7:00 PM",
    location: "Fellowship Hall",
    description: "Join us for midweek study and fellowship",
    recurring: true,
  },
  {
    id: "4",
    title: "Youth Group",
    date: "Fridays",
    time: "6:30 PM",
    location: "Youth Room",
    description: "For students grades 6-12",
    recurring: true,
  },
  {
    id: "5",
    title: "Community Meal",
    date: "First Saturday of Month",
    time: "12:00 PM",
    location: "Fellowship Hall",
    description: "Free meal open to all",
    recurring: true,
  },
];

export function Events() {
  return (
    <section id="events" className="section-church bg-secondary/30">
      <div className="container max-w-5xl mx-auto px-5">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            Upcoming Events
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl">
            There's always something happening at New Creation. Join us for worship, fellowship, and community.
          </p>
        </div>

        <div className="grid gap-4 md:gap-6">
          {upcomingEvents.map((event) => (
            <article
              key={event.id}
              className="card-church flex flex-col sm:flex-row sm:items-center gap-4 hover:border-primary/20 transition-colors"
            >
              {/* Date badge */}
              <div className="shrink-0 flex items-center gap-3 sm:w-48">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">{event.date}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {event.time}
                  </p>
                </div>
              </div>

              {/* Event details */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg mb-1">{event.title}</h3>
                {event.description && (
                  <p className="text-sm text-muted-foreground mb-2">
                    {event.description}
                  </p>
                )}
                {event.location && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {event.location}
                  </p>
                )}
              </div>

              {/* Recurring badge */}
              {event.recurring && (
                <div className="shrink-0">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    Weekly
                  </span>
                </div>
              )}
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            Questions about our events? Contact us
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
