import Header from "../../components/layout/Header";
import Hero from "./Hero";
import Demo from "./Demo";
import Features from "./Features";
import HowItWorks from "./HowItWorks";
import Benefits from "./Benefits";
import Pricing from "./Pricing";
import CTA from "./CTA";
import Footer from "./Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Header />
      <Hero />
      <Demo />
      <Features />
      <HowItWorks />
      <Benefits />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
}
