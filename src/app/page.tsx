import Header from "./components/landing/Header/Header";
import Hero from "./components/landing/Hero/Hero";
import CourseHighlight from "./components/landing/CourseHighlight/CourseHighlight";
import Benefits from "./components/landing/Benefits/Benefits";
import Footer from "./components/landing/Footer/Footer";

export default function LandingPage() {
  return (
    <main>
      <Header />
      <Hero />
      <CourseHighlight />
      <Benefits />
      <Footer />
    </main>
  );
}
