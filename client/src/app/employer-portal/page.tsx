"use client";

import {
  Users,
  Calendar,
  TrendingUp,
  Search,
  Shield,
  BrainCircuit,
  Target,
  BarChart3,
  Briefcase,
  CheckCircle,
  ArrowRight,
  Award,
  UserCheck,
  Clock
} from "lucide-react";

export default function EmployerPortalPage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-brand-secondary/30">

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 lg:px-12 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-brand-primary/5">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-primary/5 skew-x-12 translate-x-20 z-0"></div>

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white border border-brand-primary/20 shadow-sm text-brand-primary font-bold text-sm tracking-wider uppercase mb-6">
            India&apos;s First Career-Assessment Integrated Talent Analytics Portal
          </div>

          <h1 className="text-4xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
            Discover Talent. Assess <span className="text-brand-primary">Scientifically.</span>
          </h1>

          <p className="text-base md:text-lg lg:text-xl text-gray-700 max-w-3xl mx-auto mb-6 leading-relaxed">
            The Pragya Employer Portal enables organisations to move beyond resume-based screening by using assessment-backed talent insights.
          </p>

          <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-10">
            It helps companies identify role-fit candidates with higher retention potential, using structured data from the Career & Employability Assessment.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="px-8 py-4 bg-brand-primary text-white rounded-full font-bold text-lg hover:bg-brand-secondary transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2">
              Explore Employer Portal <ArrowRight className="w-5 h-5" />
            </button>
            <button className="px-8 py-4 bg-gray-900 text-white rounded-full font-bold text-lg hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2">
              View Talent Pool <Users className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Why Pragya for Employers */}
      <section className="py-20 px-6 lg:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-5xl font-black text-gray-900 mb-6">
              Why Pragya for Employers?
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-8">
              Traditional screening often relies on resumes, interviews, and assumptions. Pragya adds a scientific layer of insight to talent assessment decisions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Shield className="w-6 h-6" />,
                title: "Assessment-Verified Profiles",
                desc: "View candidate profiles backed by structured assessments"
              },
              {
                icon: <BrainCircuit className="w-6 h-6" />,
                title: "Aptitude & Skills Insight",
                desc: "Understand aptitude, skills, and personality alignment"
              },
              {
                icon: <Target className="w-6 h-6" />,
                title: "Better Role-Fit",
                desc: "Shortlist candidates with better role-fit potential"
              },
              {
                icon: <TrendingUp className="w-6 h-6" />,
                title: "Improved Retention",
                desc: "Improve talent assessment efficiency and early-stage retention"
              }
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:border-brand-primary hover:bg-brand-primary/5 transition-all group">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-brand-primary flex-shrink-0 group-hover:bg-brand-primary group-hover:text-white transition-colors shadow-sm mb-4">
                  {item.icon}
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-900">{item.title}</h3>
                <p className="text-gray-600 text-base md:text-lg lg:text-xl leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Talent Insights at a Glance */}
      <section className="py-20 px-6 lg:px-12 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-5xl font-black text-gray-900 mb-6">
              Key Talent Insights at a Glance
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Get instant visibility into your talent assessment pipeline through a clean, data-driven dashboard
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { icon: <Users className="w-8 h-8" />, label: "Total Applicants", desc: "Track overall interest across listings", color: "blue" },
              { icon: <UserCheck className="w-8 h-8" />, label: "Shortlisted Candidates", desc: "Filtered using aptitude and skill alignment", color: "green" },
              { icon: <Calendar className="w-8 h-8" />, label: "Interviews Scheduled", desc: "Monitor upcoming interviews", color: "purple" },
              { icon: <Award className="w-8 h-8" />, label: "Estimated Retention Score", desc: "Predictive indicator based on assessment alignment", color: "orange" }
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all group">
                <div className={`w-14 h-14 bg-${item.color}-50 rounded-xl flex items-center justify-center text-${item.color}-600 mb-4`}>
                  {item.icon}
                </div>
                <h3 className="font-bold text-xl mb-2 text-gray-900">{item.label}</h3>
                <p className="text-gray-600 text-base md:text-lg lg:text-xl leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-white p-8 rounded-2xl border border-brand-primary/20 shadow-lg text-center">
            <p className="text-gray-600 font-medium mb-2">Example Insight:</p>
            <div className="flex items-center justify-center gap-4">
              <span className="text-5xl font-black text-brand-primary">86%</span>
              <div className="text-left">
                <p className="text-lg font-bold text-gray-900">Estimated Retention</p>
                <p className="text-sm text-gray-600">Based on assessment alignment</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Talent Finder */}
      <section className="py-20 px-6 lg:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-1.5 rounded-full bg-brand-secondary/10 text-brand-secondary font-bold text-sm tracking-wider uppercase mb-4">
                Smart Filtering
              </div>
              <h2 className="text-3xl lg:text-5xl font-black text-gray-900 mb-6">
                AI Talent Finder
              </h2>
              <p className="text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed mb-8">
                Search and filter candidates using assessment-backed criteria, not guesswork.
              </p>
              <p className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed mb-8">
                This enables faster and more accurate shortlisting.
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-3xl border border-gray-200 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <Search className="w-6 h-6 text-brand-primary" />
                <h3 className="font-bold text-xl text-gray-900">Filter candidates by:</h3>
              </div>
              <div className="space-y-3">
                {[
                  'Aptitude indicators',
                  'Skill strength levels',
                  'Personality fit',
                  'Location and education',
                  'Experience level',
                  'Role preference',
                  'Overall match score'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-100">
                    <CheckCircle className="w-5 h-5 text-brand-secondary flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Assessment-Verified Candidate Profiles */}
      <section className="py-20 px-6 lg:px-12 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-5xl font-black text-gray-900 mb-6">
              Assessment-Verified Candidate Profiles
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Every candidate profile includes comprehensive assessment data for informed decision-making
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-lg">
              <h3 className="font-bold text-2xl mb-6 text-gray-900">Profile Includes:</h3>
              <ul className="space-y-4">
                {[
                  'Educational background and location',
                  'Match Score for the applied role',
                  'Aptitude strengths (logical, numerical, verbal, etc.)',
                  'Skill strengths (communication, digital, domain skills)',
                  'Personality snapshot related to work behaviour'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-brand-primary mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 leading-relaxed text-base md:text-lg lg:text-xl">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-brand-primary to-[#022c22] p-8 rounded-3xl shadow-lg text-white flex flex-col justify-center">
              <Shield className="w-16 h-16 mb-6 text-brand-secondary" />
              <h3 className="text-2xl font-bold mb-4">PRAGYA Verified Badge</h3>
              <p className="text-lg leading-relaxed text-white/90">
                Only candidates who complete the assessment receive the PRAGYA Verified badge, ensuring authenticity and commitment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Deep Candidate Insights */}
      <section className="py-20 px-6 lg:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-5xl font-black text-gray-900 mb-6">
              Deep Candidate Insights <span className="text-brand-secondary">(Beyond the Resume)</span>
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Employers can view a detailed candidate profile to support informed shortlisting and interview preparation
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-4">
            {[
              { icon: <BrainCircuit className="w-6 h-6" />, label: "Aptitude Assessment Summary" },
              { icon: <Target className="w-6 h-6" />, label: "Skill Readiness Indicators" },
              { icon: <Users className="w-6 h-6" />, label: "Personality Orientation" },
              { icon: <TrendingUp className="w-6 h-6" />, label: "Estimated Retention Prediction" },
              { icon: <Award className="w-6 h-6" />, label: "Past Projects & Certifications" }
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:border-brand-primary hover:bg-brand-primary/5 transition-all text-center group">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-brand-primary mx-auto mb-4 group-hover:bg-brand-primary group-hover:text-white transition-colors shadow-sm">
                  {item.icon}
                </div>
                <p className="text-sm font-bold text-gray-900">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Retention Prediction Insights */}
      <section className="py-20 px-6 lg:px-12 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-brand-secondary/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-brand-primary/20 rounded-full blur-[120px]"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-5xl font-black mb-6">
                Retention Prediction Insights
              </h2>
              <p className="text-base md:text-lg lg:text-xl text-gray-300 leading-relaxed mb-8">
                Pragya provides an Estimated Retention Score generated through alignment of aptitude, skills, interests, and personality traits.
              </p>
              <p className="text-base md:text-lg lg:text-xl text-gray-400 leading-relaxed">
                This helps employers assess longer-term role compatibility, especially for entry-level and early-career talent assessment.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-3xl border border-white/20">
              <h3 className="font-bold text-xl mb-6">Score Generated Through:</h3>
              <div className="space-y-4">
                {[
                  { label: 'Aptitude Alignment', icon: <BrainCircuit className="w-5 h-5" /> },
                  { label: 'Skills Match', icon: <Target className="w-5 h-5" /> },
                  { label: 'Interest Correlation', icon: <Users className="w-5 h-5" /> },
                  { label: 'Personality Traits', icon: <Award className="w-5 h-5" /> }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="text-brand-secondary">{item.icon}</div>
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Talent Assessment & Interview Management */}
      <section className="py-20 px-6 lg:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-5xl font-black text-gray-900 mb-6">
              Talent Assessment & Interview Management
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              All listings are connected to the assessment-based talent pool
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Briefcase className="w-8 h-8" />, title: "Create & Manage Listings", desc: "Set up and manage opportunity listings with ease" },
              { icon: <BarChart3 className="w-8 h-8" />, title: "Track Applicant Quality", desc: "Monitor match scores and candidate fit" },
              { icon: <Calendar className="w-8 h-8" />, title: "Schedule Interviews", desc: "Organise and manage interview schedules" },
              { icon: <Clock className="w-8 h-8" />, title: "Monitor Assessment Status", desc: "Track progress in one centralised place" }
            ].map((item, i) => (
              <div key={i} className="group relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                <div className="w-14 h-14 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary mb-4 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-900">{item.title}</h3>
                <p className="text-gray-600 text-base md:text-lg lg:text-xl leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Talent Analytics & Insights */}
      <section className="py-20 px-6 lg:px-12 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-5xl font-black text-gray-900 mb-6">
              Talent Analytics & Insights
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              The platform provides analytics to support better talent assessment decisions
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              'Applicant trends',
              'Shortlisting and selection rates',
              'Skill demand vs availability',
              'Retention prediction trends',
              'Location-wise talent strength',
              'Role-fit success metrics'
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-brand-primary hover:shadow-lg transition-all">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-6 h-6 text-brand-primary" />
                  <span className="text-gray-900 font-bold">{item}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 p-8 rounded-3xl border border-brand-primary/20">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-brand-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-brand-primary uppercase tracking-wider mb-2">Insight Example</p>
                <p className="text-base md:text-lg lg:text-xl text-gray-900 font-medium leading-relaxed">
                  &quot;Candidates with higher verbal aptitude show stronger retention in customer-facing roles.&quot;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Designed for Smarter Talent Discovery */}
      <section className="py-20 px-6 lg:px-12 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl lg:text-5xl font-black text-gray-900 mb-12">
            Designed for Smarter Talent Discovery
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              'Entry-level and early-career talent assessment',
              'Campus and fresher talent discovery',
              'Skill-aligned candidate identification',
              'Reduced mismatch and attrition'
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:border-brand-primary hover:bg-brand-primary/5 transition-all">
                <CheckCircle className="w-12 h-12 text-brand-primary mx-auto mb-4" />
                <p className="text-lg font-bold text-gray-900">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 lg:px-12 bg-gradient-to-br from-brand-primary via-[#022c22] to-brand-primary text-white relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-brand-secondary/30 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-white/10 rounded-full blur-[120px]"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className="text-3xl lg:text-5xl font-black mb-6">
            Get Started with Pragya Talent Insights
          </h2>
          <p className="text-2xl text-brand-secondary font-medium mb-4 leading-relaxed">
            Move beyond resumes.
          </p>
          <p className="text-xl text-white/90 mb-10 leading-relaxed">
            Discover talent with clarity, alignment, and confidence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="px-10 py-4 bg-white text-brand-primary rounded-full font-bold text-lg hover:bg-brand-secondary hover:text-white transition-all shadow-xl hover:shadow-2xl hover:scale-105 flex items-center gap-2">
              Explore Employer Portal <ArrowRight className="w-5 h-5" />
            </button>
            <button className="px-10 py-4 bg-brand-secondary text-white rounded-full font-bold text-lg hover:bg-white hover:text-brand-primary transition-all shadow-xl hover:shadow-2xl hover:scale-105 flex items-center gap-2">
              View Talent Pool <Users className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
