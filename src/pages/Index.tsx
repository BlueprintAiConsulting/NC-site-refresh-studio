import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { WhatWeBelieve } from "@/components/WhatWeBelieve";
import { Worship } from "@/components/Worship";
import { Grow } from "@/components/Grow";
import { Serve } from "@/components/Serve";
import { Connect } from "@/components/Connect";
import { Events } from "@/components/Events";
import { PlanVisit } from "@/components/PlanVisit";
import { Ministries } from "@/components/Ministries";
import { Give } from "@/components/Give";
import { Newsletter } from "@/components/Newsletter";
import { PhotoGallery } from "@/components/PhotoGallery";
import { RoomReservations } from "@/components/RoomReservations";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { EmergencyAlert } from "@/components/EmergencyAlert";
import { SocialMediaSection } from "@/components/sections/SocialMediaSection";
import { EmergencyCancellationsSection } from "@/components/sections/EmergencyCancellationsSection";

const Index = () => {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <EmergencyAlert />
      <Header />
      <main id="main">
        <div id="top" />
        <Hero />
        <EmergencyCancellationsSection />
        <About />
        <Worship />
        <Events />
        <Grow />
        <Ministries />
        <Serve />
        <Connect />
        <PlanVisit />
        <Give />
        {/* <Newsletter /> */}
        <PhotoGallery />
        <RoomReservations />
        <SocialMediaSection />
        <WhatWeBelieve />
        <Contact />
      </main>
      <Footer />
    </>
  );
};

export default Index;