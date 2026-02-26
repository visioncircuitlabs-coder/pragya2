"use client";

import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaText2?: string;
  ctaLink: string;
  ctaLink2?: string;
  image: string;
  bgGradient: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: "India's First Youth-Developed Career Ecosystem",
    subtitle: "Built to solve career confusion and improve employability outcomes.",
    ctaText: "Pragya Digital Career Library",
    ctaLink: "#",
    image: "/images/hero-person-1.webp",
    bgGradient: "from-white via-white to-white"
  },
  {
    id: 2,
    title: "India's First Digital Career Library",
    subtitle: "Explore modern career paths with clear information, skill requirements, and real-world relevance.",
    ctaText: "Pragya Digital Career Library",
    ctaLink: "#",
    image: "/images/hero-person-2.webp",
    bgGradient: "from-white via-white to-white"
  },
  {
    id: 3,
    title: "India's First Career-Assessment Integrated Talent Analytics Portal",
    subtitle: "Career assessment meets opportunity discovery — aligned to individual strengths.",
    ctaText: "Pragya Digital Career Library",
    ctaLink: "#",
    image: "/images/hero-person-3.webp",
    bgGradient: "from-white via-white to-white"
  }
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

  return (
    <div className="relative w-full overflow-hidden bg-white">
      {/* Slides Container */}
      <div className="relative min-h-[520px] sm:min-h-[550px] md:min-h-[650px] lg:min-h-[75vh]">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${index === currentSlide
              ? "opacity-100 translate-x-0"
              : index < currentSlide
                ? "opacity-0 -translate-x-full"
                : "opacity-0 translate-x-full"
              }`}
          >
            {/* Clean White Background */}
            <div className="absolute inset-0 bg-white"></div>

            {/* Content Container */}
            <div className="relative h-full w-full max-w-[1400px] mx-auto px-4 md:px-6 lg:px-12 py-4 lg:py-6">
              <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 lg:gap-4 items-center h-full">

                {/* Left Side - Text Content */}
                <div className="flex flex-col justify-start items-center lg:items-start text-center lg:text-left space-y-3 lg:space-y-5 order-2 lg:order-1 lg:pl-12 xl:pl-20 pb-4 lg:pb-8 xl:pb-10">
                  <div className="space-y-2 md:space-y-3">
                    <h1 className={`${slide.id === 2 ? 'text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl' : 'text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl'} font-bold text-gray-900 leading-tight tracking-tight`} style={{ fontFamily: 'Arial, sans-serif' }}>
                      {slide.title}
                    </h1>
                    <p className="text-sm md:text-base lg:text-xl text-gray-600 font-normal leading-relaxed max-w-2xl" style={{ fontFamily: 'Arial, sans-serif' }}>
                      {slide.subtitle}
                    </p>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                    <a
                      href={slide.ctaLink}
                      className={`group inline-flex items-center gap-2 px-6 py-3 bg-brand-primary text-white font-semibold ${slide.id === 2 ? 'text-base md:text-lg' : 'text-sm md:text-base'} rounded-full hover:bg-brand-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105`}
                      style={{ fontFamily: 'Arial, sans-serif' }}
                    >
                      <Play className="w-4 h-4 md:w-5 md:h-5 fill-white" />
                      {slide.ctaText}
                    </a>
                    {slide.ctaText2 && (
                      <a
                        href={slide.ctaLink2}
                        className={`group inline-flex items-center gap-2 px-6 py-3 bg-white text-brand-primary font-semibold ${slide.id === 2 ? 'text-base md:text-lg' : 'text-sm md:text-base'} rounded-full border-2 border-brand-primary hover:bg-brand-primary hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105`}
                        style={{ fontFamily: 'Arial, sans-serif' }}
                      >
                        <Play className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                        {slide.ctaText2}
                      </a>
                    )}
                  </div>

                </div>

                {/* Right Side - Image */}
                <div className="flex items-start justify-center lg:justify-end order-1 lg:order-2 lg:-mr-8 xl:-mr-12 lg:pt-12 xl:pt-16 w-full">
                  <div className="relative w-full h-[200px] sm:h-[250px] md:h-[350px] lg:h-[550px] xl:h-[600px]">
                    {/* Hero Image */}
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      className="object-contain object-center lg:object-right-top"
                      priority={index === 0}
                    />
                  </div>
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 w-12 h-12 lg:w-14 lg:h-14 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 z-20"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 lg:w-7 lg:h-7 text-gray-900" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 w-12 h-12 lg:w-14 lg:h-14 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 z-20"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 lg:w-7 lg:h-7 text-gray-900" />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-24 lg:bottom-32 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide
              ? "bg-brand-primary w-8"
              : "bg-gray-300 hover:bg-gray-400"
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>


      {/* Stats Bar - Integrated at Bottom */}
      <div className="relative bg-gradient-to-r from-brand-secondary via-amber-500 to-brand-secondary py-4 lg:py-5 z-30">
        <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
            {[
              { value: "10,000+", label: "Student Network" },
              { value: "2,000+", label: "Career Options" },
              { value: "300+", label: "Industry Partners" },
              { value: "200+", label: "College Partners" },
              { value: "100+", label: "Local Organisations" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div
                  className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1"
                  style={{ fontFamily: 'Arial, sans-serif' }}
                >
                  {stat.value}
                </div>
                <div
                  className="text-[10px] md:text-xs text-white/95 uppercase tracking-wide font-semibold"
                  style={{ fontFamily: 'Arial, sans-serif' }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
