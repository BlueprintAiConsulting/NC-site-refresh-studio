import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Mail, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations/FadeIn";
import siteConfig from "@/lib/siteConfig";
import { useGalleryImages } from "@/hooks/useGalleryImages";

interface StaffMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  email?: string;
  phone?: string;
  imageUrl?: string;
  imageCategory?: string;
}

function StaffCard({ member }: { member: StaffMember }) {
  const initials = member.name
    .split(' ')
    .map((n) => n[0])
    .join('');

  return (
    <article className="card-church flex flex-col md:flex-row gap-6">
      {/* Avatar placeholder */}
      <div className="shrink-0">
        {member.imageUrl ? (
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border border-border bg-secondary">
            <img
              src={member.imageUrl}
              alt={member.name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-secondary flex items-center justify-center">
            <span className="text-3xl md:text-4xl font-semibold text-muted-foreground">
              {initials}
            </span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1">
        <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
        <p className="text-sm text-primary font-medium mb-3">{member.role}</p>
        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
          {member.bio}
        </p>
        
        {/* Contact info */}
        <div className="flex flex-wrap gap-4 text-sm">
          {member.email && (
            <a 
              href={`mailto:${member.email}`}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Mail className="w-4 h-4" />
              {member.email}
            </a>
          )}
          {member.phone && (
            <a 
              href={`tel:${member.phone}`}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Phone className="w-4 h-4" />
              {member.phone}
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

const Leadership = () => {
  const { data: pastorImages } = useGalleryImages("staff-pastor-blanca");
  const { data: marshaImages } = useGalleryImages("staff-marsha-snyder");
  const { data: mikeImages } = useGalleryImages("staff-mike-krall");
  const { data: ministersImages } = useGalleryImages("staff-ministers");

  const pastors: StaffMember[] = [
    {
      id: "1",
      name: "Pastor Blanca Baker",
      role: "Senior Pastor",
      bio: "",
      email: "bbaker@susumc.org",
      imageCategory: "staff-pastor-blanca",
      imageUrl: pastorImages?.[0]?.src,
    },
  ];

  const staff: StaffMember[] = [
    {
      id: "6",
      name: "Marsha Snyder",
      role: "Pianist (8:00 AM) & Worship Leader (10:30 AM)",
      bio: "Marsha serves as our 8:00 AM pianist and leads worship for the 10:30 AM service.",
      imageCategory: "staff-marsha-snyder",
      imageUrl: marshaImages?.[0]?.src,
    },
    {
      id: "7",
      name: "Mike Krall",
      role: "Custodian",
      bio: "Mike faithfully cares for our facilities and helps keep our church welcoming and well-maintained.",
      imageCategory: "staff-mike-krall",
      imageUrl: mikeImages?.[0]?.src,
    },
    {
      id: "8",
      name: "ALL NCCC Family",
      role: "Ministers of the Gospel",
      bio: "We believe every member is called to share the love of Christ through service and witness.",
      imageCategory: "staff-ministers",
      imageUrl: ministersImages?.[0]?.src,
    },
  ];

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Header />
      <main id="main">
        {/* Hero section */}
        <section className="py-16 md:py-24 border-b border-border">
          <div className="container max-w-5xl mx-auto px-5">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-4xl md:text-5xl font-semibold mb-6"
            >
              Our Leadership
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-lg text-muted-foreground max-w-2xl"
            >
              Meet the dedicated team who serve and lead our church community. 
              We're here to walk alongside you in your faith journey.
            </motion.p>
          </div>
        </section>

        {/* Pastors section */}
        <section className="section-church">
          <div className="container max-w-5xl mx-auto px-5">
            <FadeIn>
              <h2 className="text-2xl md:text-3xl font-semibold mb-8">
                Pastoral Team
              </h2>
            </FadeIn>
            <StaggerContainer className="grid gap-6">
              {pastors.map((pastor) => (
                <StaggerItem key={pastor.id}>
                  <StaffCard member={pastor} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Staff section */}
        <section className="section-church bg-secondary/30">
          <div className="container max-w-5xl mx-auto px-5">
            <FadeIn>
              <h2 className="text-2xl md:text-3xl font-semibold mb-8">
                Church Staff
              </h2>
            </FadeIn>
            <StaggerContainer className="grid gap-6">
              {staff.map((member) => (
                <StaggerItem key={member.id}>
                  <StaffCard member={member} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 border-t border-border">
          <div className="container max-w-5xl mx-auto px-5 text-center">
            <FadeIn>
              <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
              <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                Have questions or want to connect with our team? We'd love to hear from you.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href={`tel:${siteConfig.church.contact.phone}`} className="btn-primary">
                  <Phone className="w-4 h-4" />
                  Call Us
                </a>
                <a href={`mailto:${siteConfig.church.contact.email}`} className="btn-secondary">
                  <Mail className="w-4 h-4" />
                  Email Us
                </a>
              </div>
            </FadeIn>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Leadership;
