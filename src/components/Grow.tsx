import { BookOpen, Users, Calendar, GraduationCap } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "./animations/FadeIn";
import sundaySchoolImg from "@/assets/grow-sunday-school.jpg";
import smallGroupsImg from "@/assets/grow-small-groups.jpg";
import bibleStudyImg from "@/assets/grow-bible-study.jpg";
import discipleshipImg from "@/assets/grow-discipleship.jpg";

const growOpportunities = [
  {
    icon: BookOpen,
    title: "Sunday School",
    description: "Classes for all ages with in-depth Bible study and discussion.",
    time: "Sundays at 9:15 AM",
    image: sundaySchoolImg,
  },
  {
    icon: Users,
    title: "Small Groups",
    description: "Connect with others in a more intimate setting for fellowship and growth.",
    time: "Various days and times",
    image: smallGroupsImg,
  },
  {
    icon: GraduationCap,
    title: "Bible Studies",
    description: "Deepen your understanding of Scripture through guided study.",
    time: "Check calendar for schedule",
    image: bibleStudyImg,
  },
  {
    icon: Calendar,
    title: "Discipleship Classes",
    description: "Structured courses to help you grow in your faith journey.",
    time: "Seasonal offerings",
    image: discipleshipImg,
  },
];

export function Grow() {
  return (
    <section id="grow" className="section-church bg-secondary/50 border-t border-border">
      <div className="container max-w-5xl mx-auto px-5">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">Grow</h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="text-muted-foreground text-lg mb-12 max-w-2xl">
            Opportunities to deepen your faith and connect with others on the journey.
          </p>
        </FadeIn>

        <StaggerContainer className="grid sm:grid-cols-2 gap-6">
          {growOpportunities.map((item) => (
            <StaggerItem key={item.title}>
              <div className="card-church h-full overflow-hidden p-0">
                <div className="h-40 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm mb-3">{item.description}</p>
                  <p className="text-sm font-medium text-primary">{item.time}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeIn delay={0.4}>
          <div className="mt-8 text-center">
            <a href="#contact" className="btn-primary">
              Get Connected
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
