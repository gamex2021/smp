import { CoreFeatures } from "@/features/landing/components/core-features";
import { Hero } from "@/features/landing/components/hero";
import { HowItWorks } from "@/features/landing/components/how-it-works";
import { WhyPlatform } from "@/features/landing/components/why-platform";

export default function HomePage() {
  return (
    <div>
      <Hero />
      <WhyPlatform />
      <CoreFeatures />
      <HowItWorks />
    </div>
  );
}

