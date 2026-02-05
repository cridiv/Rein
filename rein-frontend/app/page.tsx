import About from "./Components/About";
import CtaCard from "./Components/CtaCard";
import Hero from "./Components/Hero";
import HowItWorks from "./Components/HowItWorks";
import { Navbar } from "./Components/Navbar";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <About />
      <HowItWorks />
      <CtaCard />
    </div>
  );
}
