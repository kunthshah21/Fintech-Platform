import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import AIChat from '../components/AIChat';
import HowItWorks from '../components/HowItWorks';
import CTA from '../components/CTA';
import Footer from '../components/Footer';

export default function Landing() {
  return (
    <div className="min-h-screen bg-navy-950">
      <Navbar />
      <Hero />
      <Features />
      <AIChat />
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  );
}
