"use client";

import { Search, BookOpen, TrendingUp, Map, Globe, Lightbulb } from "lucide-react";

export default function CareerLibraryPage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-brand-secondary/30">

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 lg:px-12 overflow-hidden bg-gray-50">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-primary/5 skew-x-12 translate-x-20 z-0"></div>

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm text-brand-secondary font-bold text-sm tracking-wider uppercase mb-6">
            Career Library
          </div>

          <h1 className="text-4xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
            Explore Careers With <br />
            <span className="text-brand-primary">Structure, Not Confusion</span>
          </h1>

          <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Access structured knowledge on 200+ career paths, educational requirements, and growth roadmaps designed for the Indian context.
          </p>

          {/* Search Bar Placeholder */}
          <div className="max-w-3xl mx-auto relative group">
            <div className="absolute inset-0 bg-brand-secondary/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
            <div className="relative flex items-center bg-white rounded-full shadow-lg border border-gray-100 p-2 pl-6">
              <Search className="w-6 h-6 text-gray-400 mr-4" />
              <input
                type="text"
                placeholder="Search for careers, courses, or skills..."
                aria-label="Search for careers, courses, or skills"
                className="flex-1 bg-transparent border-none outline-none text-lg placeholder:text-gray-400 text-gray-900"
              />
              <button className="bg-brand-primary text-white px-8 py-3 rounded-full font-bold hover:bg-brand-secondary transition-colors">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats / Features Grid */}
      <section className="py-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: <BookOpen className="w-6 h-6" />, title: "200+ Paths", desc: "Detailed career profiles" },
            { icon: <Map className="w-6 h-6" />, title: "Roadmaps", desc: "What to study after 10th/12th" },
            { icon: <TrendingUp className="w-6 h-6" />, title: "Growth", desc: "Future opportunities & scale" },
            { icon: <Globe className="w-6 h-6" />, title: "Global & Local", desc: "Indian context + global scope" }
          ].map((item, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-brand-primary mb-4 group-hover:bg-brand-primary group-hover:text-white transition-colors">
                {item.icon}
              </div>
              <h3 className="font-bold text-xl mb-2">{item.title}</h3>
              <p className="text-gray-600 text-base md:text-lg lg:text-xl">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Placeholder */}
      <section className="py-20 px-6 lg:px-12 bg-gray-900 text-white relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-brand-secondary/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-brand-primary/20 rounded-full blur-[100px]"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-3xl lg:text-4xl font-bold mb-12 text-center">Browse by Category</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {['Engineering', 'Medical', 'Arts & Design', 'Commerce', 'Management', 'Law', 'Media', 'Science', 'Tech', 'Public Service', 'Education', 'Aviation'].map((cat, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-brand-secondary/50 cursor-pointer transition-all text-center">
                <span className="font-medium text-sm">{cat}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 lg:px-12 bg-white text-center">
        <div className="max-w-4xl mx-auto">
          <div className="w-16 h-16 bg-brand-secondary/10 rounded-full flex items-center justify-center text-brand-secondary mx-auto mb-6">
            <Lightbulb className="w-8 h-8" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-black mb-6">Not sure which path to choose?</h2>
          <p className="text-base md:text-lg lg:text-xl text-gray-600 mb-10">
            Stop guessing. Take the scientific assessment to find your perfect career match.
          </p>
          <button className="px-10 py-4 bg-brand-primary text-white rounded-full font-bold text-lg hover:bg-gray-900 transition-all shadow-xl hover:shadow-2xl">
            Take Career Clarity Assessment
          </button>
        </div>
      </section>
    </div>
  );
}

