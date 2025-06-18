import { Navbar } from "@/features/landing/components/navbar/Navbar";
import { VideoBackground } from "@/features/landing/components/video_background/VideoBackground";

export default function Home() {
  return (
    <div className="relative">
      {/* Video Background Section */}
      <VideoBackground>
        <Navbar />
      </VideoBackground>

      {/* Other sections will go here */}
    </div>
  );
}
