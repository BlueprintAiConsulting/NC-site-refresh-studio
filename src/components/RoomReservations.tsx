import { ClipboardCheck } from "lucide-react";
import { FadeIn } from "./animations/FadeIn";

export function RoomReservations() {
  return (
    <section id="room-reservations" className="section-church bg-secondary/50 border-t border-border">
      <div className="container max-w-5xl mx-auto px-5">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">Room Reservations</h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="text-muted-foreground text-lg mb-12 max-w-2xl">
            Reserve our facilities for your event, meeting, or gathering.
          </p>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div className="card-church max-w-2xl">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-primary" />
              How to Reserve
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Use the form below to submit a room request. We’ll follow up with availability and next steps.
            </p>
            <a
              href="https://forms.gle/your-form-link"
              className="btn-primary"
              target="_blank"
              rel="noreferrer"
            >
              Request a Room
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
