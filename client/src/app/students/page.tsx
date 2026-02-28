"use client";

import { Target, Brain, AlertCircle, CheckCircle, ArrowRight, Lightbulb, TrendingUp, GraduationCap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function StudentsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const handleCTA = () => {
    if (isAuthenticated) {
      router.push('/students/assessment');
    } else {
      router.push('/register');
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-brand-secondary/30">

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 lg:px-12 bg-gradient-to-b from-blue-50/80 via-white to-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500/10 border-2 border-blue-500/20 rounded-full mb-8">
            <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
            <span className="text-blue-600 font-bold text-sm md:text-base uppercase tracking-wider">Students Portal</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 tracking-tight leading-tight">
            Your Career Journey Starts With <span className="text-blue-600">Knowing Yourself,</span>
            <br className="hidden md:block" /> Not Following the Crowd
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Choosing a stream after 10th or a course after 12th is one of the biggest decisions in a student&apos;s life — yet most make it blindly.
          </p>
          <p className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
            Every student wonders:
          </p>
          <p className="text-2xl md:text-3xl font-black text-blue-600 mb-8">
            &quot;What stream should I pick? Which career is right for me?&quot;
          </p>
          <p className="text-base md:text-lg lg:text-xl text-gray-700 max-w-2xl mx-auto">
            We answer this with <span className="font-bold text-brand-secondary">science-backed assessments, not opinions.</span>
          </p>
        </div>
      </section>

      {/* Why Aptitude Matters for Students */}
      <section className="py-20 px-6 lg:px-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="relative">
              <div className="absolute -top-8 -left-8 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"></div>
              <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-12 border border-blue-200/50">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg">
                  <Brain className="w-8 h-8" />
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                  Why Aptitude Matters
                </h2>
                <p className="text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed">
                  Aptitude reveals how your mind naturally works — your strengths in logic, numbers, language, spatial thinking, and problem-solving.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <p className="text-base md:text-lg lg:text-xl text-gray-700 mb-8">
                When you understand your aptitude, you can…
              </p>
              <ul className="space-y-5">
                {[
                  'choose the right stream after 10th or 12th',
                  'pick courses that match your natural strengths',
                  'avoid costly trial-and-error decisions',
                  'feel confident about your career direction'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4 text-gray-800">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                    </div>
                    <span className="text-base md:text-lg lg:text-xl font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-6 pl-10">
                <p className="text-lg font-bold text-blue-600">
                  Aptitude is your inner compass — and we help you read it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Interest & Personality Matter */}
      <section className="py-20 px-6 lg:px-12 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1 space-y-6">
              <p className="text-base md:text-lg lg:text-xl text-gray-700 mb-8">
                Understanding your interests and personality helps you:
              </p>
              <ul className="space-y-5">
                {[
                  'discover career fields that excite you',
                  'understand your working style and strengths',
                  'find careers that match who you truly are',
                  'build a future that feels right, not forced'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4 text-gray-800">
                    <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-purple-600"></div>
                    </div>
                    <span className="text-base md:text-lg lg:text-xl font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-6 pl-10">
                <p className="text-lg font-bold text-purple-600">
                  The right career isn&apos;t just about ability — it&apos;s about fit.
                </p>
              </div>
            </div>

            <div className="order-1 lg:order-2 relative">
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl"></div>
              <div className="relative bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl p-12 border border-purple-200/50">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg">
                  <Target className="w-8 h-8" />
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                  Why Interest & Personality Matter
                </h2>
                <p className="text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed">
                  Your interests reveal what drives you. Your personality shows how you thrive. Together, they unlock the career paths where you&apos;ll succeed and stay motivated.
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
              Most school students face these questions with no real answers:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              '"Should I take Science, Commerce, or Humanities?"',
              '"Which course should I pick after 12th?"',
              '"What career is actually right for me?"'
            ].map((question, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-6 border-l-4 border-red-400">
                <p className="text-base md:text-lg lg:text-xl font-medium text-gray-800 italic">{question}</p>
              </div>
            ))}
          </div>

          <div className="text-center bg-red-50 rounded-2xl p-8 border border-red-100">
            <p className="text-xl font-bold text-gray-900">
              Without clarity, students end up in <span className="text-red-600">wrong streams, unsuitable courses, and unfulfilling careers.</span>
            </p>
          </div>
        </div>
      </section>

      {/* The Solution */}
      <section className="py-20 px-6 lg:px-12 bg-gradient-to-b from-blue-50/50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6">
              <Lightbulb className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">
              The Solution: <span className="text-blue-600">Career Assessment</span> Built for Students
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-700 max-w-3xl mx-auto">
              Our AI-powered, scientifically designed assessment covers 4 key dimensions:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <GraduationCap className="w-6 h-6 text-blue-600" />
                What We Assess:
              </h3>
              <ul className="space-y-4">
                {[
                  'Aptitude — your cognitive strengths',
                  'Career Interest — what excites you (RIASEC)',
                  'Personality — your traits and working style',
                  'Skill Readiness — your career preparedness'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-800">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-base md:text-lg lg:text-xl font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 shadow-lg text-white">
              <h3 className="text-xl font-bold mb-6">What You Get:</h3>
              <ul className="space-y-4">
                {[
                  'recommended streams and courses',
                  'matching career paths',
                  'a detailed AI-powered report',
                  'insights in English and Malayalam'
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

          <div className="text-center bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-8 border-2 border-blue-500/30">
            <p className="text-xl font-bold text-gray-900">
              This becomes your <span className="text-blue-600">verified career profile</span> — a scientific foundation for your academic and career decisions.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 px-6 lg:px-12 bg-gradient-to-b from-white to-blue-50/50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl mb-8 shadow-xl">
            <TrendingUp className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            Build Your Career Profile Today
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-gray-700 mb-8 leading-relaxed">
            Discover the right stream, course, and career path — backed by data, not guesswork.
          </p>
          <p className="text-2xl font-bold text-blue-600 mb-10">
            Let your journey begin with clarity, not confusion.
          </p>
          <button
            onClick={handleCTA}
            className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-bold rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
          >
            {isAuthenticated ? 'Take Career Assessment' : 'Create Your Profile'}
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
          {!isAuthenticated && (
            <p className="mt-4 text-gray-500">
              Already have an account?{' '}
              <Link href="/login?redirect=/students/assessment" className="text-blue-600 font-semibold hover:underline">
                Login here
              </Link>
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
