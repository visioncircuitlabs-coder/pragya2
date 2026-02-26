import Hero from "@/components/Hero";
import Services from "@/components/Services";
import CompanyLogos from "@/components/CompanyLogos";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import CTASection from "@/components/CTASection";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <main>
        <Hero />
        <Services />
        <CompanyLogos />
        <Testimonials />
        <FAQ />
        <CTASection />
      </main>
    </div>
  );
}
