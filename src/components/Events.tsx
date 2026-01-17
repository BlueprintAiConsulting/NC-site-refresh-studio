import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, ArrowRight, Star, Loader2 } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "./animations/FadeIn";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO } from "date-fns";

interface Event {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  start_time: string;
  end_time: string | null;
  location: string | null;
  is_recurring: boolean;
  recurring_pattern: string | null;
  is_featured: boolean;
}

export function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .gte("event_date", new Date().toISOString().split("T")[0])
      .order("event_date", { ascending: true })
      .limit(8);

    if (!error && data) {
      setEvents(data);
    }
    setLoading(false);
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), "EEEE, MMMM d, yyyy");
    } catch {
      return dateStr;
    }
  };

  const formatTime = (timeStr: string) => {
    try {
      const [hours, minutes] = timeStr.split(":");
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return format(date, "h:mm a");
    } catch {
      return timeStr;
    }
  };

  const getRecurringLabel = (pattern: string | null) => {
    if (!pattern) return "Recurring";
    const labels: Record<string, string> = {
      weekly: "Weekly",
      monthly: "Monthly",
      first_saturday: "1st Saturday",
      third_saturday: "3rd Saturday",
      last_wednesday: "Last Wednesday",
    };
    return labels[pattern] || "Recurring";
  };

  const featuredEvents = events.filter((e) => e.is_featured);
  const regularEvents = events.filter((e) => !e.is_featured);

  return (
    <section id="events" className="section-church bg-secondary/30">
      <div className="container max-w-5xl mx-auto px-5">
        <FadeIn className="mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            Upcoming Events
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl">
            There's always something happening at New Creation. Join us for worship, fellowship, and community.
          </p>
        </FadeIn>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No upcoming events scheduled. Check back soon!</p>
          </div>
        ) : (
          <>
            {/* Featured Events */}
            {featuredEvents.length > 0 && (
              <FadeIn className="mb-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  Featured Events
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {featuredEvents.map((event) => (
                    <article
                      key={event.id}
                      className="card-church bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover:border-primary/40 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-medium text-primary uppercase tracking-wider">
                          Featured
                        </span>
                      </div>
                      <h4 className="font-semibold text-lg mb-2">{event.title}</h4>
                      {event.description && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {event.description}
                        </p>
                      )}
                      <div className="space-y-1.5 text-sm">
                        <p className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4 text-primary" />
                          {formatDate(event.event_date)}
                        </p>
                        <p className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4 text-primary" />
                          {formatTime(event.start_time)}
                          {event.end_time && ` - ${formatTime(event.end_time)}`}
                        </p>
                        {event.location && (
                          <p className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="w-4 h-4 text-primary" />
                            {event.location}
                          </p>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </FadeIn>
            )}

            {/* Regular Events */}
            {regularEvents.length > 0 && (
              <StaggerContainer className="grid gap-4 md:gap-6" staggerDelay={0.08}>
                {regularEvents.map((event) => (
                  <StaggerItem key={event.id}>
                    <article className="card-church flex flex-col sm:flex-row sm:items-center gap-4 hover:border-primary/20 transition-colors">
                      {/* Date badge */}
                      <div className="shrink-0 flex items-center gap-3 sm:w-56">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{formatDate(event.event_date)}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTime(event.start_time)}
                            {event.end_time && ` - ${formatTime(event.end_time)}`}
                          </p>
                        </div>
                      </div>

                      {/* Event details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-1">{event.title}</h3>
                        {event.description && (
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
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
                      {event.is_recurring && (
                        <div className="shrink-0">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            {getRecurringLabel(event.recurring_pattern)}
                          </span>
                        </div>
                      )}
                    </article>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            )}
          </>
        )}

        {/* CTA */}
        <FadeIn delay={0.3} className="mt-10 text-center">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            Questions about our events? Contact us
            <ArrowRight className="w-4 h-4" />
          </a>
        </FadeIn>
      </div>
    </section>
  );
}
