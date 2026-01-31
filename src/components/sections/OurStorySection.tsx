import { FadeIn } from "@/components/animations/FadeIn";

export function OurStorySection() {
  return (
    <section id="our-story" className="section-church border-b border-border">
      <div className="container max-w-5xl mx-auto px-5">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">Our Story</h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="text-muted-foreground text-lg mb-10 max-w-2xl">
            Learn about the heart of New Creation Community Church and the journey that shapes our
            community today.
          </p>
        </FadeIn>
        <FadeIn delay={0.2}>
          <div className="card-church bg-secondary/50">
            <div className="prose prose-sm max-w-none text-muted-foreground">
              <p className="mb-4 leading-relaxed">
                Our mission and desire is to welcome and provide you with the support of our NCCC
                community of faith that will enable you to connect with God in the most meaningful way
                to impact your life and your family members’ lives. It is our prayer and our hope that
                you will be able to find this true Christian community of faith that truly “Connects
                Church & Home” here at NCCC as this is what we believe that we are all seeking in our
                lives.
              </p>
              <p className="leading-relaxed">
                We are a true community of faith, a Christian family of God that prays, struggles and
                celebrates victories together while supporting and helping one another in our church
                projects and growing in our faith together. At NCCC, we are constantly evolving and
                seeking to improve upon the many programs we have in place.
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
