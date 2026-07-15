import { useState, useEffect } from "react";
import Nav from "../components/Nav";
import Hero from "../components/Hero";
import Problem from "../components/Problem";
import Solutions from "../components/Solutions";
import SurveyHub from "../components/SurveyHub";
import QuotesCarousel from "../components/QuotesCarousel";
import ResearchInsights from "../components/ResearchInsights";
import CRAFTIntro from "../components/CRAFTIntro";
import DemoVideo from "../components/DemoVideo";
import CRAFTLab from "../components/CRAFTLab";
import GlobeMap from "../components/GlobeMap";
import Footer from "../components/Footer";

export default function App() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handle = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener("scroll", handle, { passive: true });
    return () => window.removeEventListener("scroll", handle);
  }, []);

  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#0A2540", color: "#F8FAFC" }}>
      <style>{`
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.25; transform: scaleY(0.7); }
          50% { opacity: 0.9; transform: scaleY(1.1); }
        }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { display: none; }
        html { scroll-behavior: smooth; }
        select { appearance: none; }
        ::placeholder { color: rgba(148,163,184,0.4); }
        textarea { color: #F8FAFC !important; }
      `}</style>

      <Nav progress={progress} />
      <Hero />
      <Problem />
      <Solutions />
      <SurveyHub />
      <QuotesCarousel />
      <ResearchInsights />

      {/* CRAFT intro slides above demo video, has its own nav link */}
      <CRAFTIntro />

      {/* Demo video + slide deck accordion */}
      <DemoVideo />

      <CRAFTLab />
      <GlobeMap />
      <Footer />
    </div>
  );
}