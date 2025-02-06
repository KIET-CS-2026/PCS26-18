import HowItWorks from "@/components/HomePage/HowItWorks";
import Hero from "../components/HomePage/Hero";
import Features from "@/components/HomePage/Features";

function LandingPage() {
  return (
    <div className="w-full h-full">
      <Hero />
      <Features />
      <HowItWorks />
    </div>
  );
}

export default LandingPage;
