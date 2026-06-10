import Hero from "@/components/Hero";
import HeroTransition from "@/components/HeroTransition";
import Manifesto from "@/components/Manifesto";
import Founder from "@/components/Founder";
import Universe from "@/components/Universe";
import Projects from "@/components/Projects";
import Philosophy from "@/components/Philosophy";
import Vision from "@/components/Vision";
import Contact from "@/components/Contact";
import SmoothScroll from "@/components/SmoothScroll";

export default function Home() {
  return (
    <SmoothScroll>
      <main style={{ position: 'relative', zIndex: 1, pointerEvents: 'none' }}>
        <Hero />
        <HeroTransition />
        <Manifesto />
        <Founder />
        <Universe />
        <Projects />
        <Philosophy />
        <Vision />
        <Contact />
      </main>
    </SmoothScroll>
  );
}
