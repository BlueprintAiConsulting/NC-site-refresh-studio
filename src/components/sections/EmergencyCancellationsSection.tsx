import { FadeIn } from "@/components/animations/FadeIn";

export function EmergencyCancellationsSection() {
  return (
    <section
      aria-label="Emergency cancellations"
      className="border-b border-border bg-muted/30"
    >
      <div className="mx-auto max-w-6xl px-6 py-6 md:py-8">
        <FadeIn>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Emergency cancellations
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            <span className="mr-2 text-primary">*</span>
            If we cancel services/events we will post that information on the WGAL Snow Line. We also
            will be putting it on the voice mail greeting on the church line, 717-764-0252 and on
            SLACK announcements.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
