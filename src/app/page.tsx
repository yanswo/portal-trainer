import Header from "./components/landing/Header/Header";
import Hero from "./components/landing/Hero/Hero";
import Stats from "./components/landing/Stats/Stats";
import FeatureShowcase from "./components/landing/FeatureShowcase/FeatureShowcase";
import CourseHighlight from "./components/landing/CourseHighlight/CourseHighlight";
import LearningJourney from "./components/landing/LearningJourney/LearningJourney";
import Benefits from "./components/landing/Benefits/Benefits";
import Testimonials from "./components/landing/Testimonials/Testimonials";
import FAQ from "./components/landing/FAQ/FAQ";
import CallToAction from "./components/landing/CallToAction/CallToAction";
import Footer from "./components/landing/Footer/Footer";

export default function LandingPage() {
  return (
    <main>
      <Header />
      <Hero />
      <Stats />
      <FeatureShowcase />
      <CourseHighlight />
      <LearningJourney />
      <Benefits />
      <Testimonials />
      <FAQ />
      <CallToAction />
      <Footer />
    </main>
  );
}
