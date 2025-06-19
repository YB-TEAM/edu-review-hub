import { HeroSection } from "@/features/landing/components/hero_section/HeroSection";
import { Navbar } from "@/features/landing/components/navbar/Navbar";
import { VideoBackground } from "@/features/landing/components/video_background/VideoBackground";
import { Footer } from "@/features/landing/components/footer/Footer";
import { SolutionOverview } from "@/features/landing/components/solution_overview/solution_overview";
import { ProblemSection } from "@/features/landing/components/problem_section/problem_section";
import { Features } from "@/features/landing/components/features/Feature";
import { Reviews } from "@/features/landing/components/reviews/Reviews";

export default function Home() {
  return (
    <div className="relative">
      <Navbar />

      {/* Hero Section with ID */}
      <section id="home">
        <VideoBackground>
          <HeroSection />
        </VideoBackground>
      </section>

      {/* Problem Statement Section with ID */}
      <section id="problem">
        <ProblemSection />
      </section>

      {/* Solution Overview Section with ID */}
      <section id="solution">
        <SolutionOverview />
      </section>

      {/* Placeholder sections */}
      <section id="features">
        <Features />
      </section>

      <section id="reviews">
        <Reviews />
      </section>

      <section id="contact">
        <Footer />
      </section>
    </div>
  );
}
