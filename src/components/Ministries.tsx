import { FadeIn, StaggerContainer, StaggerItem } from "./animations/FadeIn";

const additionalMinistries = [
  {
    title: "Prayer Group",
    schedule: "Sundays at 6:30 PM",
  },
  {
    title: "GriefShare",
    schedule: "13-week sessions",
  },
  {
    title: "Men's Alliance",
    schedule: "Tuesdays at 6:30 PM",
  },
  {
    title: "Women's Alliance",
    schedule: "Mondays at 6:30 PM",
  },
  {
    title: "Women in Community",
    schedule: "2x/month",
  },
  {
    title: "Women's Bible Study",
    schedule: "2x/month",
  },
  {
    title: "Secret Sister Ministry",
    schedule: "Ongoing",
  },
];

export function Ministries() {
  return (
    <section id="ministries" className="section-church bg-secondary/50 border-t border-border">
      <div className="container max-w-5xl mx-auto px-5">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            Ask About These Additional Ministries & Community Groups
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="text-muted-foreground text-lg mb-12 max-w-2xl">
            Reach out for details and the latest schedules.
          </p>
        </FadeIn>

        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {additionalMinistries.map((ministry) => (
            <StaggerItem key={ministry.title}>
              <div className="card-church h-full flex flex-col items-center text-center">
                <div className="w-28 h-28 rounded-full bg-secondary/70 border border-border flex items-center justify-center mb-5 overflow-hidden">
                  <div className="w-full h-full bg-[radial-gradient(circle_at_30%_30%,rgba(228,0,43,0.2),transparent_60%),radial-gradient(circle_at_70%_70%,rgba(175,41,46,0.18),transparent_60%)]" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{ministry.title}</h3>
                <p className="text-sm font-medium text-primary">{ministry.schedule}</p>
                <a href="#contact" className="btn-secondary mt-5">
                  Ask for Details
                </a>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
