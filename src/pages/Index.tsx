import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { WhatToExpect } from "@/components/WhatToExpect";
import { PlanVisit } from "@/components/PlanVisit";
import { Ministries } from "@/components/Ministries";
import { Events } from "@/components/Events";
import { Watch } from "@/components/Watch";
import { Give } from "@/components/Give";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Header />
      <main id="main">
        <div id="top" />
        <Hero />
        <WhatToExpect />
        <PlanVisit />
        <Ministries />
        <Events />
        <Watch />
        <Give />
        <Contact />
      </main>
      <Footer />
    </>
  );
};

export default Index;
