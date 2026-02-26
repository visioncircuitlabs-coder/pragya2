"use client";

import { Users, Briefcase, Lightbulb, Code, TrendingUp, Send, Mail, FileText, CheckCircle } from "lucide-react";

export default function CareerPage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-brand-secondary/30">

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 lg:px-12 bg-gradient-to-br from-brand-primary via-brand-primary/95 to-brand-primary/90 text-white relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-secondary/10 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px]"></div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-3xl mb-8 shadow-xl border border-white/20">
            <Users className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight leading-tight">
            Join Our Team
          </h1>

          <p className="text-base md:text-lg lg:text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed">
            We are currently building and expanding the Pragya Career Ecosystem.
          </p>
        </div>
      </section>

      {/* Who We're Looking For */}
      <section className="py-20 px-6 lg:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6">
              Who We&apos;re Looking For
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              If you are passionate about any of these areas, we would love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: "Youth Development",
                desc: "Help shape the future generation through meaningful career guidance"
              },
              {
                icon: <Lightbulb className="w-8 h-8" />,
                title: "Career Guidance",
                desc: "Guide students and job seekers toward fulfilling career paths"
              },
              {
                icon: <FileText className="w-8 h-8" />,
                title: "Research",
                desc: "Contribute to research-based career frameworks and methodologies"
              },
              {
                icon: <Code className="w-8 h-8" />,
                title: "Technology",
                desc: "Build innovative platforms that power career discovery at scale"
              },
              {
                icon: <Briefcase className="w-8 h-8" />,
                title: "Employability",
                desc: "Create solutions that bridge the gap between education and employment"
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Operations & Growth",
                desc: "Drive impact and scale Pragya&apos;s reach across India"
              }
            ].map((area, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-3xl p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
                <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary mb-6 group-hover:bg-brand-primary group-hover:text-white transition-all">
                  {area.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{area.title}</h3>
                <p className="text-gray-600 leading-relaxed text-base md:text-lg lg:text-xl">{area.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Apply Section */}
      <section className="py-20 px-6 lg:px-12 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-secondary/10 rounded-2xl mb-6">
              <Send className="w-8 h-8 text-brand-secondary" />
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6">
              How to Apply
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
              In the meantime, you can share your profile with us.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-brand-primary to-brand-primary/90 p-8 text-white">
              <div className="flex items-center gap-4 mb-4">
                <Mail className="w-8 h-8" />
                <h3 className="text-2xl font-bold">Send Your Application</h3>
              </div>
              <p className="text-white/90 text-lg">
                Share your resume and cover note with us at:
              </p>
            </div>

            <div className="p-8 space-y-8">
              {/* Email */}
              <div className="bg-gradient-to-r from-brand-primary/5 to-brand-secondary/5 p-6 rounded-2xl border-l-4 border-brand-primary">
                <p className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">Email Address</p>
                <a href="mailto:info@pragyacareer.com" className="text-2xl font-bold text-brand-primary hover:text-brand-secondary transition-colors">
                  info@pragyacareer.com
                </a>
              </div>

              {/* Instructions */}
              <div className="space-y-5">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Application Guidelines:</h4>

                {[
                  {
                    icon: <FileText className="w-5 h-5" />,
                    text: "Attach your updated resume"
                  },
                  {
                    icon: <Mail className="w-5 h-5" />,
                    text: "Include a brief cover note explaining your interest"
                  },
                  {
                    icon: <Briefcase className="w-5 h-5" />,
                    text: "Mention the role you are applying for in the subject line"
                  }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 bg-gray-50 p-5 rounded-xl border border-gray-100">
                    <div className="w-10 h-10 bg-brand-secondary/10 rounded-full flex items-center justify-center text-brand-secondary flex-shrink-0">
                      {item.icon}
                    </div>
                    <p className="text-gray-800 font-medium pt-2 text-base md:text-lg lg:text-xl">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Happens Next */}
      <section className="py-20 px-6 lg:px-12 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">
              What Happens Next?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "We Review",
                desc: "Our team will carefully review your profile and experience"
              },
              {
                step: "02",
                title: "We Evaluate",
                desc: "We assess fit based on role requirements and team needs"
              },
              {
                step: "03",
                title: "We Connect",
                desc: "If there's a suitable opportunity, we'll reach out to you"
              }
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-brand-primary to-brand-primary/80 rounded-2xl mb-6 shadow-lg">
                  <span className="text-3xl font-black text-white">{item.step}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed text-base md:text-lg lg:text-xl">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 lg:px-12 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-brand-secondary/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-brand-primary/30 rounded-full blur-[120px]"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-3xl mb-8 shadow-xl border border-white/20">
            <CheckCircle className="w-10 h-10 text-brand-secondary" />
          </div>

          <h2 className="text-3xl md:text-5xl font-black mb-6">
            Be Part of Something Meaningful
          </h2>

          <p className="text-base md:text-lg lg:text-xl text-gray-300 mb-10 leading-relaxed max-w-3xl mx-auto">
            Join us in building India&apos;s most comprehensive career guidance ecosystem and help shape the future of millions of young Indians.
          </p>

          <a
            href="mailto:info@pragyacareer.com"
            className="group inline-flex items-center gap-3 px-10 py-5 bg-brand-secondary text-white text-lg font-bold rounded-2xl hover:bg-brand-primary transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
          >
            <Mail className="w-6 h-6" />
            Send Your Application
            <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </section>
    </div>
  );
}


