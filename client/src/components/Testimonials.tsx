"use client";

import { Quote, GraduationCap, Briefcase, Building2 } from "lucide-react";
import { useState, useRef } from "react";
import Image from "next/image";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  image: string;
  tag: string;
}

interface Category {
  id: string;
  label: string;
  icon: React.ReactNode;
  testimonials: Testimonial[];
  accentColor: string;
  bgColor: string;
}

export default function Testimonials() {
  const [activeTab, setActiveTab] = useState("students");

  const categories: Category[] = [
    {
      id: "students",
      label: "Students",
      icon: <GraduationCap className="w-6 h-6" />,
      accentColor: "text-blue-600",
      bgColor: "bg-blue-50",
      testimonials: [
        {
          quote: "ശരിക്കും ഒരു eye-opener ആയിരുന്നു Pragya-യുടെ കരിയർ അസസ്‌മെന്റ്. എനിക്ക് എന്തൊക്കെ കഴിവുകൾ ഉണ്ടെന്ന് തിരിച്ചറിയാനും, എന്റെ സ്വഭാവത്തിന് ഏറ്റവും അനുയോജ്യമായ കരിയർ തിരഞ്ഞെടുക്കാനും ഇത് എന്നെ വല്ലാതെ സഹായിച്ചു.",
          name: "Aneetta Jose",
          role: "Student, Malappuram",
          image: "/testimonials/students/aneetta-jose.webp",
          tag: "discovered my strengths"
        },
        {
          quote: "പ്ലസ് ടു കഴിഞ്ഞ് എന്ത് ചെയ്യണം എന്ന കൺഫ്യൂഷനിലായിരുന്നു ഞാൻ. എന്നാൽ Pragya-യിലൂടെ എന്റെ താൽപ്പര്യങ്ങൾ കൃത്യമായി മനസ്സിലാക്കാനും, എനിക്ക് പറ്റിയ കോഴ്സും കരിയറും കണ്ടെത്താനും സാധിച്ചു.",
          name: "Anfitha",
          role: "Student, Trivandrum",
          image: "/testimonials/students/anfitha.webp",
          tag: "found clarity after +2"
        },
        {
          quote: "The 360° assessment helped me understand my true potential. Now I'm confident about my career direction and working towards my goals.",
          name: "Anugreh",
          role: "Student, Kozhikode",
          image: "/testimonials/students/anugreh.webp",
          tag: "gained career confidence"
        },
        {
          quote: "Pragya's career library showed me career options I never knew existed. It's like having a personal career counselor available 24/7.",
          name: "Gautham",
          role: "Student, Kozhikode",
          image: "/testimonials/students/gautham.webp",
          tag: "explored new possibilities"
        },
      ]
    },
    {
      id: "jobseekers",
      label: "Job Seekers",
      icon: <Briefcase className="w-6 h-6" />,
      accentColor: "text-brand-primary",
      bgColor: "bg-emerald-50",
      testimonials: [
        {
          quote: "Pragya's platform bridges the gap between education and employment seamlessly. I found a role that challenges me and uses my administrative skills effectively.",
          name: "Anjali",
          role: "School Administrator",
          image: "/testimonials/job-seekers/anjali.webp",
          tag: "perfect role match"
        },
        {
          quote: "As a professional looking to grow, the insights provided here were invaluable. The personalized roadmap made my career transition smooth and confident.",
          name: "Anusree",
          role: "Chief Accountant",
          image: "/testimonials/job-seekers/anusree.webp",
          tag: "smooth career transition"
        },
        {
          quote: "Finally, a platform that focuses on potential rather than just keywords. It helped me showcase my true value to employers and land my dream role.",
          name: "Deepak",
          role: "Business Development Manager",
          image: "/testimonials/job-seekers/deepak.webp",
          tag: "landed dream role"
        },
        {
          quote: "The employability assessment showed me exactly where I needed to improve. Within months, I secured a position that matched my skills perfectly!",
          name: "Sooraj",
          role: "Draftsman, Peekay Steels",
          image: "/testimonials/job-seekers/sooraj.webp",
          tag: "quick job success"
        },
      ]
    },
    {
      id: "employers",
      label: "Employers",
      icon: <Building2 className="w-6 h-6" />,
      accentColor: "text-brand-secondary",
      bgColor: "bg-amber-50",
      testimonials: [
        {
          quote: "Pragya's assessment-integrated profiles save us hours in the screening process. We now onboard candidates who are truly the right fit for our organisation.",
          name: "Mukesh V Menon",
          role: "Luxon Tata, Malappuram",
          image: "/testimonials/employers/mukesh-menon.webp",
          tag: "saves screening time"
        },
        {
          quote: "The quality of candidates we receive through Pragya is exceptional. The career-fit indicators help us make better talent assessment decisions every time.",
          name: "Rashid AP",
          role: "Director, Rayan Foundation, Bangalore",
          image: "/testimonials/employers/rashid-ap.webp",
          tag: "better talent decisions"
        },
        {
          quote: "We've significantly improved our talent assessment efficiency since using Pragya. The pre-assessed candidate pool is a game-changer for our talent discovery process.",
          name: "Suhail P",
          role: "Founder & MD, Mark Career Academy, Palakkad",
          image: "/testimonials/employers/suhail-p.webp",
          tag: "talent insights game-changer"
        },
        {
          quote: "Finally, a platform that understands both employer needs and candidate potential. Our retention rates have improved significantly since partnering with Pragya.",
          name: "Sukanya",
          role: "HR Head, Rays Education, Kozhikode",
          image: "/testimonials/employers/sukanya.webp",
          tag: "improved retention"
        },
      ]
    }
  ];

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  const activeCategory = categories.find(c => c.id === activeTab) || categories[0];

  return (
    <section className="relative w-full pt-10 lg:pt-12 pb-10 lg:pb-12 bg-gradient-to-br from-amber-50/80 via-white to-emerald-50/50 overflow-hidden">

      {/* Creative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        {/* Large ambient glows */}
        <div className="absolute left-[5%] top-[5%] w-[400px] h-[400px] bg-brand-secondary/10 rounded-full blur-[120px]"></div>
        <div className="absolute right-[5%] bottom-[10%] w-[500px] h-[500px] bg-brand-primary/8 rounded-full blur-[140px]"></div>
        <div className="absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-100/30 rounded-full blur-[100px]"></div>

        {/* Decorative geometric shapes - Original */}
        <div className="absolute top-[15%] right-[15%] w-32 h-32 border-2 border-brand-secondary/10 rounded-full"></div>
        <div className="absolute top-[20%] right-[18%] w-20 h-20 border-2 border-brand-primary/10 rounded-full"></div>
        <div className="absolute bottom-[20%] left-[10%] w-24 h-24 border-2 border-brand-secondary/15 rounded-2xl rotate-45"></div>
        <div className="absolute bottom-[25%] left-[12%] w-16 h-16 bg-brand-primary/5 rounded-xl rotate-12"></div>

        {/* Additional decorative shapes */}
        {/* Top Left Area */}
        <div className="absolute top-[8%] left-[20%] w-28 h-28 border-2 border-amber-400/10 rounded-full"></div>
        <div className="absolute top-[12%] left-[22%] w-14 h-14 bg-brand-secondary/5 rounded-lg rotate-[30deg]"></div>

        {/* Middle Right Area */}
        <div className="absolute top-[40%] right-[8%] w-36 h-36 border-2 border-brand-primary/8 rounded-2xl rotate-12"></div>
        <div className="absolute top-[45%] right-[12%] w-20 h-20 border-2 border-amber-500/10 rounded-full"></div>
        <div className="absolute top-[38%] right-[5%] w-12 h-12 bg-brand-secondary/5 rounded-full"></div>

        {/* Bottom Right Area */}
        <div className="absolute bottom-[15%] right-[20%] w-24 h-24 border-2 border-brand-primary/10 rounded-xl rotate-45"></div>
        <div className="absolute bottom-[10%] right-[25%] w-16 h-16 bg-amber-400/5 rounded-2xl rotate-[60deg]"></div>

        {/* Middle Left Area */}
        <div className="absolute top-[50%] left-[5%] w-32 h-32 border-2 border-brand-secondary/8 rounded-full"></div>
        <div className="absolute top-[55%] left-[8%] w-18 h-18 bg-brand-primary/5 rounded-lg rotate-[-20deg]"></div>

        {/* Small accent shapes scattered */}
        <div className="absolute top-[30%] left-[15%] w-10 h-10 border border-amber-400/15 rounded-full"></div>
        <div className="absolute top-[70%] right-[30%] w-12 h-12 border border-brand-secondary/10 rounded-lg rotate-45"></div>
        <div className="absolute bottom-[40%] left-[25%] w-8 h-8 bg-brand-primary/8 rounded-full"></div>
        <div className="absolute top-[25%] right-[40%] w-14 h-14 border-2 border-amber-500/8 rounded-xl rotate-[25deg]"></div>

        {/* Subtle dot pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #014b3b 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>

        {/* Diagonal accent lines */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] opacity-[0.02]">
          <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="0" y1="600" x2="600" y2="0" stroke="#c98d1e" strokeWidth="2" />
            <line x1="100" y1="600" x2="600" y2="100" stroke="#014b3b" strokeWidth="1" />
            <line x1="200" y1="600" x2="600" y2="200" stroke="#c98d1e" strokeWidth="1" />
          </svg>
        </div>
      </div>

      {/* Header Section - Full Width */}
      <div className="w-full mb-8 lg:mb-10">
        <div className="w-full px-8 py-5 bg-gradient-to-r from-brand-secondary via-amber-500 to-brand-secondary shadow-xl">
          <div className="flex items-center justify-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse"></span>
            <span className="text-2xl md:text-3xl lg:text-4xl font-black text-white uppercase tracking-wider">Testimonials</span>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-12">

        {/* Category Tabs */}
        <div className="flex justify-center mb-8 lg:mb-10">
          <div className="inline-flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-x-auto max-w-full">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveTab(category.id)}
                className={`flex items-center gap-2 md:gap-3 px-4 py-2.5 md:px-8 md:py-4 rounded-xl font-bold text-sm md:text-base lg:text-lg transition-all duration-300 whitespace-nowrap ${activeTab === category.id
                  ? `${category.bgColor} ${category.accentColor} shadow-md`
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
              >
                {category.icon}
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Testimonials Container */}
        <div className="relative">
          {/* Scroll Buttons */}
          <button
            onClick={scrollLeft}
            aria-label="Scroll testimonials left"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-gray-600 hover:text-brand-primary hover:shadow-xl transition-all duration-300 -ml-4 lg:-ml-6"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={scrollRight}
            aria-label="Scroll testimonials right"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-gray-600 hover:text-brand-primary hover:shadow-xl transition-all duration-300 -mr-4 lg:-mr-6"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Fade Gradients */}
          <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-gray-50/80 to-transparent pointer-events-none z-10"></div>
          <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-gray-50/80 to-transparent pointer-events-none z-10"></div>

          {/* Testimonials Scroll Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 lg:gap-6 overflow-x-auto pb-4 scrollbar-hide scroll-smooth px-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {activeCategory.testimonials.map((item, index) => (
              <div
                key={index}
                className="group relative flex-shrink-0 w-[280px] md:w-[320px] lg:w-[360px] bg-white p-6 md:p-7 rounded-3xl border border-gray-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                {/* User Profile with Image */}
                <div className="flex items-center gap-3 pb-4 border-b border-gray-50 mb-4">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-100 shadow-md flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      unoptimized
                      className="object-cover object-top"
                      sizes="96px"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-base group-hover:text-brand-primary transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-wide">
                      {item.role}
                    </p>
                  </div>
                </div>

                {/* Quote Icon */}
                <div className="mb-4">
                  <Quote className="w-8 h-8 text-brand-secondary/30 group-hover:text-brand-secondary transition-colors duration-300" fill="currentColor" />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <p className="text-gray-700 leading-relaxed font-medium text-base md:text-lg">
                    &quot;{item.quote}&quot;
                  </p>
                  <p className="mt-3 text-xs md:text-sm font-bold text-brand-primary">
                    <span className="text-brand-secondary">✦</span> {item.tag}
                  </p>
                </div>

                {/* Hover Decorative Line */}
                <div className="absolute bottom-0 left-6 right-6 h-1 bg-gradient-to-r from-brand-secondary to-brand-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-full"></div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
