"use client";

import { Plus, Minus, ArrowRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "What is Pragya?",
      answer: "Pragya is a platform for research and guidance for youth advancement. It is India's First Youth-Developed Career Ecosystem, created to support informed career and employability decisions for students, job seekers, and employers. Pragya brings together: India's First Structured Digital Career Library, Career-Assessment Integrated Talent Analytics Portal, and 360° Career & Employability Assessment. For the first time in India, career discovery, assessment, and opportunity access are integrated into a single structured platform."
    },
    {
      question: "What is the 360° Career Assessment?",
      answer: "The 360° Career Assessment is a structured assessment that combines aptitude, interest, and personality insights to support career clarity for school students."
    },
    {
      question: "Who can take the 360° Employability Assessment?",
      answer: "Graduates, job seekers, and early-career professionals can take the 360° Employability Assessment based on their career stage."
    },
    {
      question: "How is Pragya different from traditional career counselling?",
      answer: "Pragya uses structured assessments, career mapping, and a digital career library instead of opinion-based guidance. The platform is youth-developed and supported by technology-enabled tools, including AI-assisted analysis."
    },
    {
      question: "What is the Career Library?",
      answer: "The Career Library is a structured digital resource that provides information on career options, domains, and pathways."
    },
    {
      question: "What is the Assessment-Integrated Talent Analytics Portal?",
      answer: "It is a talent analytics portal where candidate profiles include assessment-based career and employability insights along with qualifications."
    },
    {
      question: "How does the platform help employers?",
      answer: "Employers can view candidate profiles with career-fit indicators to support better shortlisting and role alignment."
    },
    {
      question: "Is the assessment only for students?",
      answer: "No. Pragya assessments are designed for students, job seekers, and employers, each with a relevant focus."
    },
    {
      question: "How can I get started with Pragya?",
      answer: "You can start by taking the 360° Career & Employability Assessment or exploring the Career Library through the website."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative w-full pt-10 lg:pt-12 pb-12 lg:pb-16 bg-[#002A22] text-white overflow-hidden">

      {/* Background Texture */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute right-0 top-0 w-[600px] h-[600px] bg-brand-secondary rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute left-0 bottom-0 w-[400px] h-[400px] bg-brand-secondary rounded-full blur-[120px] translate-y-1/2 -translate-x-1/4"></div>
      </div>

      <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

          {/* Left Column: Navigation / Contact */}
          <div className="lg:col-span-4 flex flex-col justify-between min-h-[400px] lg:min-h-[500px]">
            <div>
              <span className="text-5xl md:text-6xl lg:text-8xl font-bold text-brand-secondary uppercase tracking-widest mb-4 block">FAQ</span>
            </div>

            <div className="mt-auto">
              <h3 className="text-4xl font-bold text-white mb-2">NOT FOUND?</h3>
              <h3 className="text-4xl font-bold text-white/40 mb-8">STILL CURIOUS?</h3>

              <Link href="/contact">
                <button className="group flex items-center gap-3 text-sm font-bold uppercase tracking-widest hover:text-brand-secondary transition-colors">
                  Contact Us
                  <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:border-brand-secondary group-hover:bg-brand-secondary group-hover:text-[#002A22] transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              </Link>
            </div>
          </div>

          {/* Right Column: Scrollable Accordion */}
          <div className="lg:col-span-8">
            <div className="h-[400px] lg:h-[500px] overflow-y-auto pr-4 scrollbar-thin">
              <div className="flex flex-col">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="border-b border-white/10 last:border-0"
                  >
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full py-8 flex items-start justify-between gap-6 text-left group"
                    >
                      <span className={`text-xl md:text-2xl font-bold transition-colors duration-300 ${openIndex === index ? 'text-brand-secondary' : 'text-white group-hover:text-white/80'}`}>
                        {faq.question}
                      </span>
                      <div className={`shrink-0 w-8 h-8 rounded-full border border-white/20 flex items-center justify-center transition-all duration-300 ${openIndex === index ? 'bg-brand-secondary border-brand-secondary text-[#002A22] rotate-180' : 'group-hover:border-white'}`}>
                        {openIndex === index ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </div>
                    </button>

                    <div
                      className={`overflow-hidden transition-all duration-500 ease-in-out ${openIndex === index ? 'max-h-96 opacity-100 mb-8' : 'max-h-0 opacity-0'}`}
                    >
                      <p className="text-base lg:text-lg text-gray-400 leading-relaxed pr-8">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

