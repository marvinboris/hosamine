import Nav from "@/components/public/Nav";
import Hero from "@/components/public/Hero";
import Services from "@/components/public/Services";
import Stats from "@/components/public/Stats";
import About from "@/components/public/About";
import Clients from "@/components/public/Clients";
import Testimonials from "@/components/public/Testimonials";
import Partners from "@/components/public/Partners";
import CTA from "@/components/public/CTA";
import Footer from "@/components/public/Footer";
import Chatbot from "@/components/public/Chatbot";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Services />
        <Stats />
        <About />
        <Clients />
        <Testimonials />
        <Partners />
        <CTA />
      </main>
      <Footer />
      <Chatbot />
    </>
  );
}
