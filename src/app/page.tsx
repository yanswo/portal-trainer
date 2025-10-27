import Header from "./components/landing/Header/Header";
import Hero from "./components/landing/Hero/Hero";
import PartnerMarquee from "./components/landing/PartnerMarquee/PartnerMarquee";
import CourseHighlight from "./components/landing/CourseHighlight/CourseHighlight";
import LearningJourney from "./components/landing/LearningJourney/LearningJourney";
import Benefits from "./components/landing/Benefits/Benefits";
import Testimonials from "./components/landing/Testimonials/Testimonials";
import CallToAction from "./components/landing/CallToAction/CallToAction";
import Footer from "./components/landing/Footer/Footer";

export default function LandingPage() {
  return (
    <main>
      <Header />
      <Hero />
      <PartnerMarquee />
      <CourseHighlight />
      <LearningJourney />
      <Benefits />
      <Testimonials />
      <CallToAction />
      <Footer />
    </main>
  );
}
