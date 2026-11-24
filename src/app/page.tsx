import Header from "./components/landing/Header/Header";
import Hero from "./components/landing/Hero/Hero";
import FeatureShowcase from "./components/landing/FeatureShowcase/FeatureShowcase";
import CourseHighlight from "./components/landing/CourseHighlight/CourseHighlight";
import CallToAction from "./components/landing/CallToAction/CallToAction";
import Footer from "./components/landing/Footer/Footer";
import LandingThemeToggle from "./components/landing/LandingThemeToggle";

export default function LandingPage() {
  return (
    <main className="landing-page">
      <Header />
      <Hero />
      <FeatureShowcase />
      <CourseHighlight />
      <CallToAction />
      <Footer />
      <LandingThemeToggle />
    </main>
  );
}
