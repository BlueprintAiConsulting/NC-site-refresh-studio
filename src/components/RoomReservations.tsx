import { Building, Calendar, Users, ClipboardCheck } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "./animations/FadeIn";

const rooms = [
  {
    name: "Fellowship Hall",
    capacity: "Up to 150 guests",
    features: "Full kitchen access, tables & chairs, AV equipment",
  },
  {
    name: "Conference Room",
    capacity: "Up to 20 guests",
    features: "Projector, whiteboard, conference table",
  },
  {
    name: "Classrooms",
    capacity: "Various sizes",
    features: "Perfect for small group meetings and classes",
  },
];

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

        <StaggerContainer className="grid sm:grid-cols-3 gap-6 mb-8">
          {rooms.map((room) => (
            <StaggerItem key={room.name}>
              <div className="card-church h-full">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Building className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{room.name}</h3>
                <p className="text-sm font-medium text-primary mb-2">{room.capacity}</p>
                <p className="text-muted-foreground text-sm">{room.features}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeIn delay={0.3}>
          <div className="card-church max-w-2xl">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-primary" />
              How to Reserve
            </h3>
            <ol className="space-y-3 text-sm text-muted-foreground mb-6">
              <li className="flex gap-3">
                <span className="font-semibold text-foreground">1.</span>
                Contact the church office to check availability for your desired date and time.
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-foreground">2.</span>
                Complete the facility request form (available at the office or online).
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-foreground">3.</span>
                Receive confirmation and any applicable guidelines for your event.
              </li>
            </ol>
            <a href="#contact" className="btn-primary">
              Request a Room
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
