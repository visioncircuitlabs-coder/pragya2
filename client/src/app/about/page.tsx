"use client";

import {
  Target,
  Lightbulb,
  Users,
  Briefcase,
  BrainCircuit,
  Compass,
  Award,
  CheckCircle2,
  TrendingUp,
  Search
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-brand-secondary/30">

      {/* Hero / Intro Section */}
      <section className="relative pt-32 pb-20 px-6 lg:px-12 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-primary/5 -skew-x-12 translate-x-20 z-0"></div>
        <div className="absolute top-20 left-10 w-64 h-64 bg-brand-secondary/10 rounded-full blur-3xl -z-10"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2">
              <div className="inline-block px-4 py-1.5 rounded-full border border-brand-primary/20 bg-brand-primary/5 text-brand-primary font-bold text-sm tracking-wider uppercase mb-6">
                About Pragya
              </div>
              <h1 className="text-5xl lg:text-7xl font-black leading-[0.9] mb-8">
                Built by <span className="text-brand-secondary">Youth</span>, for <span className="text-brand-secondary">Youth</span>
              </h1>
              <div className="text-base md:text-lg lg:text-xl text-gray-600 space-y-6 leading-relaxed">
                <p>
                  Pragya is a youth-led career ecosystem, built by youth, for youth, with a clear focus on research, guidance, and employability advancement.
                </p>
                <p>
                  In today&apos;s fast-changing world, career paths are no longer linear. Students and job seekers face constant confusion due to rapidly evolving industries, emerging roles, and changing skill requirements. Pragya was created to address this reality by offering a structured, future-focused approach to career development.
                </p>
                <p>
                  Pragya is India&apos;s First Youth-Developed Career Ecosystem, designed to help students, job seekers, and employers make informed career and employability decisions. The platform moves beyond opinion-based counselling and brings clarity through structured assessments, curated knowledge, and opportunity alignment.
                </p>
              </div>
            </div>

            <div className="lg:w-1/2 relative">
              <div className="aspect-square rounded-[3rem] bg-gradient-to-br from-brand-primary to-[#022c22] p-8 lg:p-12 text-white flex flex-col justify-between shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                <Users className="w-16 h-16 text-brand-secondary opacity-80" />
                <div>
                  <h3 className="text-3xl font-bold mb-4">Youth-Led Innovation</h3>
                  <p className="text-white/80 text-lg leading-relaxed">
                    Built on the belief that youth understand the challenges of youth best. Led by young minds who have experienced career confusion firsthand and are committed to creating practical, realistic solutions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Transition */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20 translate-y-[1px]">
          <svg className="relative block w-[calc(100%+1.3px)] h-[60px] md:h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="fill-gray-50"></path>
          </svg>
        </div>
      </section>


      {/* What Makes Pragya Unique Section */}
      <section className="py-24 bg-gray-50 px-6 lg:px-12 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-brand-primary font-bold tracking-wider uppercase text-sm">What Sets Us Apart</span>
            <h2 className="text-4xl lg:text-5xl font-black mb-6 mt-3">What Makes Pragya Unique</h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-base md:text-lg lg:text-xl leading-relaxed">
              Pragya is not just another career guidance tool — it is a fully integrated platform that connects discovery, understanding, and opportunity. For the first time in India, career discovery, assessment, and opportunity access are integrated into a single structured platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: 360° Assessment */}
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-14 h-14 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary mb-6 group-hover:scale-110 transition-transform">
                <BrainCircuit className="w-8 h-8" />
              </div>
              <div className="inline-block px-3 py-1 rounded-full bg-brand-primary/5 text-brand-primary text-xs font-bold mb-4">
                INDIA&apos;S FIRST
              </div>
              <h3 className="text-2xl font-bold mb-4 group-hover:text-brand-primary transition-colors">360° Career & Employability Assessment</h3>
              <p className="text-gray-600 leading-relaxed text-base md:text-lg lg:text-xl">
                A comprehensive assessment that combines aptitude, interest, and personality insights into a single structured profile.
              </p>
            </div>

            {/* Card 2: Career Library */}
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-14 h-14 bg-brand-secondary/10 rounded-2xl flex items-center justify-center text-brand-secondary mb-6 group-hover:scale-110 transition-transform">
                <Lightbulb className="w-8 h-8" />
              </div>
              <div className="inline-block px-3 py-1 rounded-full bg-brand-secondary/5 text-brand-secondary text-xs font-bold mb-4">
                INDIA&apos;S FIRST
              </div>
              <h3 className="text-2xl font-bold mb-4 group-hover:text-brand-secondary transition-colors">Structured Digital Career Library</h3>
              <p className="text-gray-600 leading-relaxed text-base md:text-lg lg:text-xl">
                A curated knowledge base of careers, pathways, and opportunities for easy exploration and decision support.
              </p>
            </div>

            {/* Card 3: Integrated Talent Analytics Portal */}
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                <Briefcase className="w-8 h-8" />
              </div>
              <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold mb-4">
                WORLD&apos;S FIRST
              </div>
              <h3 className="text-2xl font-bold mb-4 group-hover:text-blue-600 transition-colors">Career-Assessment Integrated Talent Analytics Portal</h3>
              <p className="text-gray-600 leading-relaxed text-base md:text-lg lg:text-xl">
                An innovative talent analytics platform where candidate profiles include structured assessment insights for better alignment between talent and opportunity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Split */}
      <section className="py-24 px-6 lg:px-12 bg-gray-900 text-white relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
          <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-brand-primary/30 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-brand-secondary/20 rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-brand-secondary/20 flex items-center justify-center">
                <Target className="w-6 h-6 text-brand-secondary" />
              </div>
              <h2 className="text-3xl font-bold text-brand-secondary">Our Vision</h2>
            </div>
            <p className="text-2xl font-light leading-relaxed opacity-90">
              To build a future-ready career ecosystem that empowers youth with clarity, confidence, and meaningful career opportunities.
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 rounded-full bg-brand-primary/40 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold">Our Mission</h2>
            </div>
            <div className="space-y-6 pl-4 border-l-2 border-white/10">
              <div className="pl-6">
                <p className="text-gray-300 leading-relaxed text-base md:text-lg lg:text-xl">To help students and job seekers understand their strengths, interests, and employability readiness</p>
              </div>
              <div className="pl-6">
                <p className="text-gray-300 leading-relaxed text-base md:text-lg lg:text-xl">To provide structured, research-based career guidance instead of opinion-driven advice</p>
              </div>
              <div className="pl-6">
                <p className="text-gray-300 leading-relaxed text-base md:text-lg lg:text-xl">To bridge the gap between education, skills, and employment</p>
              </div>
              <div className="pl-6">
                <p className="text-gray-300 leading-relaxed text-base md:text-lg lg:text-xl">To support employers with better-aligned talent through assessment-informed insights</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 px-6 lg:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-brand-primary font-bold tracking-wider uppercase text-sm">What Drives Us</span>
            <h2 className="text-4xl lg:text-5xl font-black mb-6 mt-3">Our Core Values</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="w-6 h-6" />,
                title: "Youth-Led",
                desc: "Built by youth, for youth — addressing real challenges faced by the younger generation.",
                color: "brand-primary"
              },
              {
                icon: <Lightbulb className="w-6 h-6" />,
                title: "Clarity First",
                desc: "We believe informed decisions lead to better career outcomes.",
                color: "brand-secondary"
              },
              {
                icon: <Search className="w-6 h-6" />,
                title: "Structure & Research",
                desc: "Our approach is grounded in structured assessments, data, and continuous learning.",
                color: "blue-600"
              },
              {
                icon: <CheckCircle2 className="w-6 h-6" />,
                title: "Integrity",
                desc: "No false promises. No guaranteed outcomes. Only honest guidance.",
                color: "brand-primary"
              },
              {
                icon: <Target className="w-6 h-6" />,
                title: "Inclusivity",
                desc: "Career clarity should be accessible to youth from all backgrounds.",
                color: "brand-secondary"
              },
            ].map((item, i) => (
              <div key={i} className={`group p-8 rounded-3xl bg-gray-50 hover:bg-${item.color} border border-transparent hover:border-gray-200 transition-all duration-300`}>
                <div className={`w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-gray-900 mb-6 group-hover:bg-white/20 group-hover:text-white transition-colors`}>
                  {item.icon}
                </div>
                <h3 className="font-bold text-xl mb-3 group-hover:text-white transition-colors">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed group-hover:text-white/90 transition-colors text-base md:text-lg lg:text-xl">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Commitment & Why We Exist */}
      <section className="py-24 px-6 lg:px-12 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start mb-24">
            {/* Our Commitment */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center">
                  <Award className="w-6 h-6 text-brand-primary" />
                </div>
                <h2 className="text-3xl lg:text-4xl font-black">Our Commitment</h2>
              </div>
              <p className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed mb-8">
                At Pragya, we believe that every young person deserves the chance to understand themselves and their career choices with clarity and confidence. Our work is guided by:
              </p>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <Users className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2 text-gray-900">Youth-Centric Design</h4>
                    <p className="text-gray-600 text-base md:text-lg lg:text-xl">Built by youth who understand the real pressures and uncertainties that come with career decisions.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-secondary/10 flex items-center justify-center shrink-0 mt-1">
                    <Search className="w-5 h-5 text-brand-secondary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2 text-gray-900">Structured Guidance</h4>
                    <p className="text-gray-600 text-base md:text-lg lg:text-xl">Data-backed assessments and curated knowledge that go beyond opinions.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-1">
                    <Compass className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2 text-gray-900">Access to Opportunity</h4>
                    <p className="text-gray-600 text-base md:text-lg lg:text-xl">Helping users connect not just with clarity, but with real-world pathways and opportunities.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Why We Exist */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-brand-secondary/10 flex items-center justify-center">
                  <Compass className="w-6 h-6 text-brand-secondary" />
                </div>
                <h2 className="text-3xl lg:text-4xl font-black">Why We Exist</h2>
              </div>
              <p className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed mb-8">
                In an era where careers evolve faster than ever, students and job seekers face information overload, pressure, and uncertainty. Pragya exists to bring order and clarity to that chaos — by offering research, structure, and actionable insight through a platform built for the youth of today and tomorrow.
              </p>
              <div className="rounded-[2rem] bg-gradient-to-br from-brand-primary to-[#022c22] p-8 lg:p-10 text-white">
                <h3 className="text-2xl font-bold mb-4">Leading Youth Towards Clarity</h3>
                <p className="text-white/90 leading-relaxed mb-6">
                  Pragya empowers young people with the clarity, tools, and direction needed to navigate today&apos;s fast-changing career landscape.
                </p>
                <p className="text-white/90 leading-relaxed">
                  By focusing on clarity, structure, and readiness, Pragya aims to support smoother transitions from education to employability and enable better outcomes for individuals and organisations alike.
                </p>
              </div>
            </div>
          </div>

          {/* Closing Statement */}
          <div className="rounded-[3rem] bg-brand-primary p-8 lg:p-16 text-white overflow-hidden relative">
            <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

            <div className="relative z-10 text-center max-w-4xl mx-auto">
              <h2 className="text-3xl lg:text-4xl font-black mb-6">An Integrated Ecosystem</h2>
              <p className="text-base md:text-lg lg:text-xl text-white/90 leading-relaxed mb-8">
                We are committed to creating a career ecosystem where direction, readiness, and opportunity come together for every learner, job seeker, and employer.
              </p>
              <p className="text-base md:text-lg lg:text-xl text-brand-secondary font-medium">
                Understanding that traditional guidance often falls short in a rapidly evolving world, Pragya brings together structured research, clear insights, and practical pathways that help individuals make informed decisions about education, skills, and career direction.
              </p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
