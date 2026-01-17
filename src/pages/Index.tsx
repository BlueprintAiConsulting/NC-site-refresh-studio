import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Worship } from "@/components/Worship";
import { Grow } from "@/components/Grow";
import { Serve } from "@/components/Serve";
import { Connect } from "@/components/Connect";
import { Events } from "@/components/Events";
import { PlanVisit } from "@/components/PlanVisit";
import { Ministries } from "@/components/Ministries";
import { Give } from "@/components/Give";
import { Merch } from "@/components/Merch";
import { RoomReservations } from "@/components/RoomReservations";
import { LittleLights } from "@/components/LittleLights";
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
        <About />
        <Worship />
        <Grow />
        <Serve />
        <Connect />
        <Events />
        <PlanVisit />
        <Ministries />
        <Give />
        <Merch />
        <RoomReservations />
        <LittleLights />
        <Contact />
      </main>
      <Footer />
    </>
  );
};

export default Index;