import {
  AchievementsSection,
  CompanyStorySection,
  HeroSection,
  MissionVisionValuesSection,
  SafetyReliabilitySection,
} from '@/components/modules/about';

function About() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <MissionVisionValuesSection />
      <CompanyStorySection />
      <SafetyReliabilitySection />
      <AchievementsSection />
    </div>
  );
}

export default About;
