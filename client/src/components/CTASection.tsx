"use client";

import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="relative w-full pt-10 lg:pt-12 pb-16 lg:pb-20 bg-gradient-to-br from-amber-50 via-orange-50/30 to-white overflow-hidden">

      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full opacity-40 pointer-events-none">
        <div className="absolute right-1/4 top-1/2 w-[600px] h-[600px] bg-brand-secondary/30 rounded-full blur-[150px] -translate-y-1/2"></div>
        <div className="absolute left-1/4 bottom-0 w-[400px] h-[400px] bg-brand-primary/20 rounded-full blur-[120px] translate-y-1/3"></div>
      </div>

      {/* Decorative Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, #c98d1e 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }}></div>

      {/* Decorative Lines */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-brand-secondary to-transparent"></div>

      <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">

        {/* Main Content Container */}
        <div className="flex flex-col items-center text-center">

          {/* Heading */}
          <div className="mb-8 lg:mb-10 max-w-4xl">
            <h2 className="text-[clamp(1.5rem,3.5vw,2.5rem)] leading-[1.2] font-black tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-brand-primary via-[#016652] to-brand-primary">
                Take the first step towards
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-secondary via-amber-600 to-brand-secondary">
                clarity, readiness, and opportunity.
              </span>
            </h2>
          </div>

          {/* CTA Buttons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6 w-full max-w-4xl">

            {/* CTA 1: Career Assessment → Register */}
            <a href="/register" className="group relative bg-white/80 backdrop-blur-sm border-2 border-brand-secondary/20 rounded-3xl p-6 md:p-8 lg:p-12 hover:bg-white hover:border-brand-secondary/60 hover:shadow-2xl hover:shadow-brand-secondary/30 transition-all duration-300 hover:-translate-y-1 block">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-secondary/10 rounded-full blur-[60px] group-hover:bg-brand-secondary/20 transition-all duration-300"></div>

              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-brand-secondary to-amber-600 shadow-lg shadow-brand-secondary/30 mb-6 group-hover:scale-110 transition-all duration-300">
                  <svg className="w-8 h-8 lg:w-10 lg:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>

                <h3 className="text-2xl lg:text-3xl font-bold mb-4 text-brand-primary group-hover:text-brand-secondary transition-colors">
                  Career Assessment
                </h3>

                <p className="text-gray-600 text-lg lg:text-xl mb-6 leading-relaxed">
                  Discover your ideal career path with comprehensive assessment tools
                </p>

                <span aria-label="Get started with Career Assessment" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-brand-secondary group-hover:text-brand-primary group-hover:gap-3 transition-all duration-300">
                  Get Started
                  <div className="w-10 h-10 rounded-full bg-brand-secondary/10 border-2 border-brand-secondary flex items-center justify-center group-hover:bg-brand-secondary group-hover:text-white transition-all">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </span>
              </div>
            </a>

            {/* CTA 2: Employability Assessment → Register */}
            <a href="/register" className="group relative bg-white/80 backdrop-blur-sm border-2 border-brand-primary/20 rounded-3xl p-6 md:p-8 lg:p-12 hover:bg-white hover:border-brand-primary/60 hover:shadow-2xl hover:shadow-brand-primary/30 transition-all duration-300 hover:-translate-y-1 block">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-full blur-[60px] group-hover:bg-brand-primary/20 transition-all duration-300"></div>

              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-brand-primary to-emerald-700 shadow-lg shadow-brand-primary/30 mb-6 group-hover:scale-110 transition-all duration-300">
                  <svg className="w-8 h-8 lg:w-10 lg:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>

                <h3 className="text-2xl lg:text-3xl font-bold mb-4 text-brand-primary group-hover:text-brand-secondary transition-colors">
                  Employability Assessment
                </h3>

                <p className="text-gray-600 text-lg lg:text-xl mb-6 leading-relaxed">
                  Evaluate your job readiness and enhance your professional skills
                </p>

                <span aria-label="Get started with Employability Assessment" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-brand-secondary group-hover:text-brand-primary group-hover:gap-3 transition-all duration-300">
                  Get Started
                  <div className="w-10 h-10 rounded-full bg-brand-secondary/10 border-2 border-brand-secondary flex items-center justify-center group-hover:bg-brand-secondary group-hover:text-white transition-all">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </span>
              </div>
            </a>

          </div>

          {/* Bottom Accent Text */}
          <div className="mt-10 lg:mt-12 pt-7 border-t-2 border-brand-secondary/20 max-w-2xl">
            <p className="text-base md:text-lg lg:text-xl uppercase tracking-widest font-bold text-gray-700">
              <span className="text-brand-secondary">Why Wait?</span> Take The First Step And Register With Us Today!
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}

