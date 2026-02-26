"use client";

import { GraduationCap, Briefcase, Building2, ArrowRight } from "lucide-react";

export default function Services() {
  const services = [
    {
      category: "SCHOOL STUDENTS",
      title: "360° Career Assessment",
      description:
        "A structured assessment designed for school students to understand their aptitude, interests, and personality before making career decisions.",
      keyFocus:
        "Helps students explore suitable career paths, streams, and future options with clarity and confidence.",
      cta: "Explore Assessment",
      ctaLink: "/contact",
      icon: <GraduationCap className="w-7 h-7" strokeWidth={2.5} />,
      gradient: "from-blue-500 to-purple-600",
      lightBg: "bg-gradient-to-br from-blue-50 to-purple-50",
      accentColor: "text-blue-600",
      borderColor: "border-blue-200/50",
      hoverShadow: "hover:shadow-blue-500/20",
    },
    {
      category: "JOB SEEKERS",
      title: "360° Employability Assessment",
      description:
        "An assessment for job seekers to evaluate career readiness, role suitability, and employability strengths.",
      keyFocus:
        "Supports career alignment, skill awareness, and better positioning for opportunities.",
      cta: "Check Employability",
      ctaLink: "/job-seekers",
      icon: <Briefcase className="w-7 h-7" strokeWidth={2.5} />,
      gradient: "from-brand-primary to-emerald-700",
      lightBg: "bg-gradient-to-br from-emerald-50 to-teal-50",
      accentColor: "text-brand-primary",
      borderColor: "border-brand-primary/20",
      hoverShadow: "hover:shadow-brand-primary/20",
    },
    {
      category: "EMPLOYERS",
      title: "Assessment-Integrated Talent Analytics Portal",
      description:
        "A talent analytics portal where employer access is integrated with structured employability assessment insights.",
      keyFocus:
        "Enables employers to review candidate profiles with career-fit indicators beyond resumes.",
      cta: "Explore Employer Portal",
      ctaLink: "/employer-portal",
      icon: <Building2 className="w-7 h-7" strokeWidth={2.5} />,
      gradient: "from-brand-secondary to-orange-600",
      lightBg: "bg-gradient-to-br from-amber-50 to-orange-50",
      accentColor: "text-brand-secondary",
      borderColor: "border-brand-secondary/20",
      hoverShadow: "hover:shadow-brand-secondary/20",
    },
  ];

  return (
    <section className="relative w-full pt-8 lg:pt-10 pb-12 lg:pb-16 overflow-hidden bg-gradient-to-b from-white via-gray-50/50 to-white">
      {/* Background Decorative Pattern */}
      <div className="absolute inset-0 opacity-[0.015]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #014b3b 1px, transparent 0)`,
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* Ambient Glow Effects */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-brand-secondary/5 rounded-full blur-[120px]"></div>

      {/* Content Container */}
      <div className="relative w-full max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-8 lg:mb-10">
          <div className="inline-block">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-[2px] w-12 bg-gradient-to-r from-transparent to-brand-secondary"></div>
              <span className="text-sm md:text-base font-bold tracking-[0.3em] text-brand-secondary uppercase">
                Our Services
              </span>
              <div className="h-[2px] w-12 bg-gradient-to-l from-transparent to-brand-secondary"></div>
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-3 tracking-tight">
            Explore Our Services
          </h2>

          <p className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto font-medium leading-relaxed">
            Comprehensive assessment solutions tailored for every stage of your career journey
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className={`group relative bg-white rounded-[2rem] overflow-hidden border-2 ${service.borderColor} hover:border-transparent transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] ${service.hoverShadow} hover:-translate-y-2`}
            >
              {/* Background Gradient Overlay (appears on hover) */}
              <div className={`absolute inset-0 ${service.lightBg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

              {/* Card Content */}
              <div className="relative z-10 flex flex-col h-full">
                {/* Image Placeholder */}
                <div className={`relative w-full h-32 md:h-36 bg-gradient-to-br ${service.gradient} overflow-hidden flex-shrink-0`}>
                  {/* Decorative Pattern Overlay */}
                  <div className="absolute inset-0 opacity-10">
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                        backgroundSize: "24px 24px",
                      }}
                    />
                  </div>

                  {/* Large Icon as Placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center text-white/30">
                    <div className="transform scale-[2]">
                      {service.icon}
                    </div>
                  </div>

                  {/* Small Icon Badge */}
                  <div className="absolute top-3 right-3 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white shadow-lg border border-white/30">
                    <div className="scale-90">{service.icon}</div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex-grow">
                    {/* Category Badge */}
                    <span className="inline-block text-sm font-black tracking-[0.2em] text-gray-500 uppercase mb-3">
                      {service.category}
                    </span>

                    {/* Title */}
                    <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3 leading-tight">
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 leading-relaxed mb-4 font-medium text-base lg:text-lg">
                      {service.description}
                    </p>

                    {/* Key Focus Section */}
                    <div className="mb-5 pb-5 border-b border-gray-100">
                      <div className="flex items-start gap-2">
                        <div className={`mt-1.5 w-1.5 h-1.5 rounded-full bg-gradient-to-br ${service.gradient} flex-shrink-0`}></div>
                        <div>
                          <h4 className={`text-sm font-bold uppercase tracking-wider mb-2 ${service.accentColor}`}>
                            Key Focus
                          </h4>
                          <p className="text-gray-700 text-base lg:text-lg leading-relaxed font-semibold">
                            {service.keyFocus}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <a
                    href={service.ctaLink}
                    className={`group/btn relative flex items-center justify-center gap-2 w-full py-3 px-5 bg-gradient-to-r ${service.gradient} text-white font-bold text-base rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 mt-auto`}
                  >
                    {/* Button shine effect */}
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>

                    <span className="relative z-10">{service.cta}</span>
                    <ArrowRight className="relative z-10 w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </a>
                </div>
              </div>

              {/* Decorative corner accent */}
              <div className={`absolute top-8 left-8 w-20 h-20 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 rounded-full blur-2xl transition-opacity duration-500`}></div>
            </div>
          ))}
        </div>

        {/* Bottom Decorative Line */}
        <div className="mt-8 flex items-center justify-center gap-2">
          <div className="h-1 w-1 rounded-full bg-brand-primary/30"></div>
          <div className="h-1 w-16 rounded-full bg-gradient-to-r from-brand-primary/30 via-brand-secondary/50 to-brand-primary/30"></div>
          <div className="h-1 w-1 rounded-full bg-brand-primary/30"></div>
        </div>
      </div>
    </section>
  );
}

