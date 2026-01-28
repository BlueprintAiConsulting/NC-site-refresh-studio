import { BookOpen, Users, Calendar, GraduationCap } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "./animations/FadeIn";
import { useGalleryImages } from "@/hooks/useGalleryImages";
import sundaySchoolImg from "@/assets/grow-sunday-school.jpg";
import smallGroupsImg from "@/assets/grow-small-groups.jpg";
import bibleStudyImg from "@/assets/grow-bible-study.jpg";
import discipleshipImg from "@/assets/grow-discipleship.jpg";

export function Grow() {
  const { data: sundaySchoolImages } = useGalleryImages("grow-childrens-sunday-school");
  const { data: adultClassImages } = useGalleryImages("grow-adult-class");
  const { data: nurseryImages } = useGalleryImages("grow-nursery");
  const { data: jrChurchImages } = useGalleryImages("grow-jr-church");

  const growOpportunities = [
    {
      icon: BookOpen,
      title: "Children's Sunday School",
      description: "Discussion-based classes for kids focused on Scripture and faith basics.",
      time: "Sundays at 9:15 AM",
      image: sundaySchoolImages?.[0]?.src || sundaySchoolImg,
    },
    {
      icon: Users,
      title: "Bob Yinger / Jeff Merkert Adult Class",
      description: "Adult discussion group centered on Scripture and real-life application.",
      time: "Sundays at 9:15 AM",
      image: adultClassImages?.[0]?.src || smallGroupsImg,
    },
    {
      icon: GraduationCap,
      title: "Nursery",
      description: "Care available for little ones during the 10:30 AM service.",
      time: "During the 10:30 AM service",
      image: nurseryImages?.[0]?.src || bibleStudyImg,
    },
    {
      icon: Calendar,
      title: "Jr Church",
      description: "Kids are invited partway into the 10:30 AM service for age-appropriate teaching.",
      time: "Partway into the 10:30 AM service",
      image: jrChurchImages?.[0]?.src || discipleshipImg,
    },
  ];

  return (
    <section
      id="grow"
      className="section-church py-16 md:py-24 bg-secondary/50 border-t border-border relative overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -right-12 top-8 h-60 w-60 rounded-full overflow-hidden opacity-20">
          <img src={discipleshipImg} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="absolute -left-20 bottom-6 h-72 w-72 rounded-full overflow-hidden opacity-15">
          <img src={smallGroupsImg} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_25%,rgba(228,0,43,0.08),transparent_45%),radial-gradient(circle_at_10%_75%,rgba(228,0,43,0.06),transparent_50%)]" />
      </div>
      <div className="container max-w-5xl mx-auto px-5 relative">
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
