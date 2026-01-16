import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Mail, Phone } from "lucide-react";

interface StaffMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  email?: string;
  phone?: string;
  image?: string;
}

const pastors: StaffMember[] = [
  {
    id: "1",
    name: "Pastor John Smith",
    role: "Senior Pastor",
    bio: "Pastor John has served New Creation since 2015. He is passionate about preaching the Gospel and helping people grow in their faith journey. He holds a Master of Divinity from Wesley Theological Seminary.",
    email: "pastor@newcreationumc.org",
  },
  {
    id: "2",
    name: "Pastor Sarah Johnson",
    role: "Associate Pastor",
    bio: "Pastor Sarah joined our team in 2019 and leads our contemporary worship service. She has a heart for youth ministry and community outreach.",
    email: "sarah@newcreationumc.org",
  },
];

const staff: StaffMember[] = [
  {
    id: "3",
    name: "Michael Chen",
    role: "Music Director",
    bio: "Michael leads our music ministry and choir. With over 20 years of experience in church music, he brings passion and excellence to our worship.",
  },
  {
    id: "4",
    name: "Emily Davis",
    role: "Children's Ministry Director",
    bio: "Emily oversees our Sunday School and children's programs. She is dedicated to nurturing the faith of our youngest members.",
  },
  {
    id: "5",
    name: "Robert Williams",
    role: "Office Administrator",
    bio: "Robert keeps our church running smoothly behind the scenes. He manages communications, scheduling, and administrative needs.",
    email: "office@newcreationumc.org",
    phone: "717-764-0252",
  },
];

function StaffCard({ member }: { member: StaffMember }) {
  return (
    <article className="card-church flex flex-col md:flex-row gap-6">
      {/* Avatar placeholder */}
      <div className="shrink-0">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl bg-secondary flex items-center justify-center">
          <span className="text-3xl md:text-4xl font-semibold text-muted-foreground">
            {member.name.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
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
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Header />
      <main id="main">
        {/* Hero section */}
        <section className="py-16 md:py-24 border-b border-border">
          <div className="container max-w-5xl mx-auto px-5">
            <h1 className="text-4xl md:text-5xl font-semibold mb-6">
              Our Leadership
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Meet the dedicated team who serve and lead our church community. 
              We're here to walk alongside you in your faith journey.
            </p>
          </div>
        </section>

        {/* Pastors section */}
        <section className="section-church">
          <div className="container max-w-5xl mx-auto px-5">
            <h2 className="text-2xl md:text-3xl font-semibold mb-8">
              Pastoral Team
            </h2>
            <div className="grid gap-6">
              {pastors.map((pastor) => (
                <StaffCard key={pastor.id} member={pastor} />
              ))}
            </div>
          </div>
        </section>

        {/* Staff section */}
        <section className="section-church bg-secondary/30">
          <div className="container max-w-5xl mx-auto px-5">
            <h2 className="text-2xl md:text-3xl font-semibold mb-8">
              Church Staff
            </h2>
            <div className="grid gap-6">
              {staff.map((member) => (
                <StaffCard key={member.id} member={member} />
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 border-t border-border">
          <div className="container max-w-5xl mx-auto px-5 text-center">
            <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Have questions or want to connect with our team? We'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="tel:717-764-0252" className="btn-primary">
                <Phone className="w-4 h-4" />
                Call Us
              </a>
              <a href="mailto:newcreation25@comcast.net" className="btn-secondary">
                <Mail className="w-4 h-4" />
                Email Us
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Leadership;
