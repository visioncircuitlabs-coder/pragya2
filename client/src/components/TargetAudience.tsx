"use client";

import { GraduationCap, Briefcase, UserSearch, ArrowUpRight } from "lucide-react";

export default function TargetAudience() {
  const cards = [
    {
      title: "For Students",
      description: "Find the right learning style courses and career path based on your unique talents and interests.",
      icon: <GraduationCap className="w-8 h-8 text-brand-secondary" strokeWidth={2} />,
      bg: "bg-blue-50/50",
      iconBg: "bg-white",
    },
    {
      title: "For Professionals",
      description: "Discover your strengths to advance your career with confidence.",
      icon: <Briefcase className="w-8 h-8 text-brand-primary" strokeWidth={2} />,
      bg: "bg-green-50/50",
      iconBg: "bg-white",
    },
    {
      title: "For Employers",
      description: "Connect with verified, high-potential talent perfectly matched to your organization's needs.",
      icon: <UserSearch className="w-8 h-8 text-orange-400" strokeWidth={2} />,
      bg: "bg-orange-50/50",
      iconBg: "bg-white",
    },
  ];

  return (
    <section className="relative w-full py-20 lg:py-32 px-4 md:px-8 bg-white overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
         <div className="absolute right-[5%] top-[10%] w-64 h-64 bg-brand-secondary/5 rounded-full blur-3xl"></div>
         <div className="absolute left-[5%] bottom-[10%] w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-[1400px] mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-12 mb-20">
          <div className="max-w-md pt-4">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-[0.95] tracking-tight mb-6">
              Your potential, <br />
              <span className="text-brand-primary">intelligently mapped</span>
            </h2>
          </div>

          <div className="max-w-2xl text-right md:text-right flex flex-col items-end">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white mb-8 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-brand-secondary"></span>
              <span className="text-sm font-bold text-gray-600 uppercase tracking-wider">Who is it for</span>
            </div>
            
             <p className="text-base lg:text-lg text-gray-600 leading-relaxed font-medium">
               Eliminate the guesswork from your future. We leverage advanced AI to analyze your unique strengths and aspirations, creating a precise roadmap that connects you directly to the careers and companies where you belong.
             </p>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {cards.map((card, index) => (
            <div 
              key={index} 
              className={`group relative p-8 lg:p-10 rounded-[2.5rem] ${card.bg} hover:bg-white border border-transparent hover:border-gray-100 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 ease-out cursor-default`}
            >
              {/* Hover Arrow */}
              <div className="absolute top-8 right-8 opacity-0 -translate-y-2 translate-x-2 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300">
                <ArrowUpRight className="w-6 h-6 text-gray-400" />
              </div>

              {/* Icon */}
              <div className={`w-20 h-20 ${card.iconBg} rounded-3xl flex items-center justify-center shadow-sm mb-8 group-hover:scale-110 transition-transform duration-500`}>
                {card.icon}
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-brand-primary transition-colors">
                {card.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed font-medium text-base lg:text-lg">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}



