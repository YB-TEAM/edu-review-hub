import { HeroSection } from "@/features/landing/components/hero_section/HeroSection";
import { Navbar } from "@/features/landing/components/navbar/Navbar";
import { VideoBackground } from "@/features/landing/components/video_background/VideoBackground";

export default function Home() {
  return (
    <div className="relative">
      <Navbar />
      {/* Video Background Section */}
      <VideoBackground>
        <HeroSection />
      </VideoBackground>
      <div style={{ height: "100vh" }}>Content thêm</div>

      {/* Other sections will go here */}
    </div>
  );
}
