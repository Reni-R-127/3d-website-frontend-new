import AboutHero from "../components/AboutPage/AboutHero/AboutHero";
import MissionVision from "../components/AboutPage/MissionVision/MissionVision";
import OurJourney from "../components/AboutPage/OurJourney/OurJourney";
import Values from "../components/AboutPage/Values/Values";
import HomeContactCTA from "../components/HomePage/HomeContactCTA/HomeContactCTA";

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <OurJourney />
      <MissionVision />
      <Values />
      <HomeContactCTA />
    </>
  );
}