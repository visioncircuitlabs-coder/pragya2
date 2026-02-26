"use client";

import { Target, Brain, AlertCircle, CheckCircle, ArrowRight, Lightbulb, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function JobSeekersPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const handleCTA = () => {
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/login?redirect=/job-seekers');
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-brand-secondary/30">

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 lg:px-12 bg-gradient-to-b from-brand-primary/5 via-white to-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary/10 border-2 border-brand-primary/20 rounded-full mb-8">
            <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse"></div>
            <span className="text-brand-primary font-bold text-sm md:text-base uppercase tracking-wider">Job Seekers Portal</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 tracking-tight leading-tight">
            Where Your Future Starts With <span className="text-brand-primary">Facts,</span>
            <br className="hidden md:block" /> Not Guesswork
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Youth today stand at a crossroads — thousands of courses, hundreds of careers, endless opinions.
          </p>
          <p className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
            But one question echoes in every mind:
          </p>
          <p className="text-2xl md:text-3xl font-black text-brand-primary mb-8">
            &quot;Am I choosing the right path?&quot;
          </p>
          <p className="text-base md:text-lg lg:text-xl text-gray-700 max-w-2xl mx-auto">
            Our platform answers this using <span className="font-bold text-brand-secondary">pure data, not pressure.</span>
          </p>
        </div>
      </section>

      {/* Why Skill Matters */}
      <section className="py-20 px-6 lg:px-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="relative">
              <div className="absolute -top-8 -left-8 w-24 h-24 bg-brand-secondary/10 rounded-full blur-2xl"></div>
              <div className="relative bg-gradient-to-br from-brand-secondary/10 to-brand-primary/5 rounded-3xl p-12 border border-brand-secondary/20">
                <div className="w-16 h-16 bg-brand-secondary rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg">
                  <Target className="w-8 h-8" />
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                  Why Skill Matters
                </h2>
                <p className="text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed">
                  Skills are the real-world engines that move careers forward.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <p className="text-base md:text-lg lg:text-xl text-gray-700 mb-8">
                When students know what they&apos;re naturally good at, they can…
              </p>
              <ul className="space-y-5">
                {[
                  'choose better courses',
                  'grab real opportunities',
                  'stand out in the job market',
                  'grow faster with confidence'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4 text-gray-800">
                    <div className="w-6 h-6 rounded-full bg-brand-secondary/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-brand-secondary"></div>
                    </div>
                    <span className="text-base md:text-lg lg:text-xl font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-6 pl-10">
                <p className="text-lg font-bold text-brand-primary">
                  Skill clarity is the foundation of a successful future.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Aptitude Matters */}
      <section className="py-20 px-6 lg:px-12 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1 space-y-6">
              <p className="text-base md:text-lg lg:text-xl text-gray-700 mb-8">
                Understanding your aptitude helps you:
              </p>
              <ul className="space-y-5">
                {[
                  'pick the right subjects for higher studies',
                  'avoid costly trial-and-error decisions',
                  'match with fulfilling career paths',
                  'stay confident and focused'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4 text-gray-800">
                    <div className="w-6 h-6 rounded-full bg-brand-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-brand-primary"></div>
                    </div>
                    <span className="text-base md:text-lg lg:text-xl font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-6 pl-10">
                <p className="text-lg font-bold text-brand-primary">
                  Aptitude is your inner compass — and we help you read it.
                </p>
              </div>
            </div>

            <div className="order-1 lg:order-2 relative">
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-brand-primary/10 rounded-full blur-2xl"></div>
              <div className="relative bg-gradient-to-br from-brand-primary/10 to-brand-secondary/5 rounded-3xl p-12 border border-brand-primary/20">
                <div className="w-16 h-16 bg-brand-primary rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg">
                  <Brain className="w-8 h-8" />
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                  Why Aptitude Matters
                </h2>
                <p className="text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed">
                  Aptitude reveals how your mind works — your strengths in logic, numbers, language, creativity, problem-solving and more.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem Today */}
      <section className="py-20 px-6 lg:px-12 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-2xl mb-6">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">
              The Problem Today
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-700 mb-8">
              Most students remain confused about:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              '&quot;Did I select the correct course?&quot;',
              '&quot;What should I choose after 10th/12th?&quot;',
              '&quot;Which job suits me?&quot;'
            ].map((question, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-6 border-l-4 border-red-400">
                <p className="text-base md:text-lg lg:text-xl font-medium text-gray-800 italic">{question}</p>
              </div>
            ))}
          </div>

          <div className="text-center bg-red-50 rounded-2xl p-8 border border-red-100">
            <p className="text-xl font-bold text-gray-900">
              This confusion leads to <span className="text-red-600">wrong choices, stress, and wasted years.</span>
            </p>
          </div>
        </div>
      </section>

      {/* The Solution */}
      <section className="py-20 px-6 lg:px-12 bg-gradient-to-b from-brand-primary/5 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-primary rounded-2xl mb-6">
              <Lightbulb className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">
              The Solution: <span className="text-brand-primary">Scientific Assessment</span> + Personal Profile
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-700 max-w-3xl mx-auto">
              Our AI-backed, scientifically designed tests uncover:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">What We Discover About You:</h3>
              <ul className="space-y-4">
                {[
                  'Your true strengths',
                  'Your interests',
                  'Your personality style',
                  'Your skill patterns'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-800">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-base md:text-lg lg:text-xl font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-brand-primary rounded-2xl p-8 shadow-lg text-white">
              <h3 className="text-xl font-bold mb-6">What You Get:</h3>
              <ul className="space-y-4">
                {[
                  'the best course for higher studies',
                  'suitable jobs',
                  'career pathways that truly fit you'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-brand-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-base md:text-lg lg:text-xl font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="text-center bg-gradient-to-r from-brand-secondary/10 to-brand-primary/10 rounded-2xl p-8 border-2 border-brand-secondary/30">
            <p className="text-xl font-bold text-gray-900">
              This becomes your <span className="text-brand-primary">verified career profile</span> — your digital identity for future opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 px-6 lg:px-12 bg-gradient-to-b from-white to-brand-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-secondary rounded-3xl mb-8 shadow-xl">
            <TrendingUp className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            Build Your Career Profile Today
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-gray-700 mb-8 leading-relaxed">
            Unlock personalised career and job opportunities based on real data.
          </p>
          <p className="text-2xl font-bold text-brand-primary mb-10">
            Let your journey begin with clarity, not confusion.
          </p>
          <button
            onClick={handleCTA}
            className="group inline-flex items-center gap-3 px-10 py-5 bg-brand-primary text-white text-lg font-bold rounded-2xl hover:bg-brand-secondary transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Create Your Profile'}
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
          {!isAuthenticated && (
            <p className="mt-4 text-gray-500">
              Already have an account?{' '}
              <Link href="/login?redirect=/job-seekers" className="text-brand-primary font-semibold hover:underline">
                Login here
              </Link>
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

