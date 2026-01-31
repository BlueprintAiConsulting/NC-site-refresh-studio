import { FadeIn } from "@/components/animations/FadeIn";

export function EmergencyCancellationsSection() {
  return (
    <section
      aria-label="Emergency announcements"
      className="border-b border-border bg-muted/30"
    >
      <div className="mx-auto max-w-6xl px-6 py-6 md:py-8">
        <FadeIn>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Emergency announcements
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            If we cancel services or events we will post that information on the WGAL Snow Line.
            Also we will be putting it on the voice mail greeting on the church line, 717-764-0252
            and on SLACK announcements. Any questions or suggestions? Feel free to text or call me.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
