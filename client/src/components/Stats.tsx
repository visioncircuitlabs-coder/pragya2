"use client";

import { useEffect, useState, useRef } from "react";

interface Stat {
  value: string;
  label: string;
  suffix: string;
}

const stats: Stat[] = [
  { value: "10000", label: "Student Network", suffix: "+" },
  { value: "2000", label: "Career Options", suffix: "+" },
  { value: "300", label: "Industry Partners", suffix: "+" },
  { value: "200", label: "College Partners", suffix: "+" },
  { value: "100", label: "Local Organisations", suffix: "+" },
];

export default function Stats() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-6 lg:py-8 overflow-hidden bg-gradient-to-r from-brand-secondary via-amber-500 to-brand-secondary"
    >
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 opacity-[0.05]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* Content Container */}
      <div className="relative w-full max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-6">
          {stats.map((stat, index) => (
            <StatItem
              key={index}
              stat={stat}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>

    </section>
  );
}

interface StatItemProps {
  stat: Stat;
  index: number;
  isVisible: boolean;
}

function StatItem({ stat, index, isVisible }: StatItemProps) {
  const [count, setCount] = useState(0);
  const targetValue = parseInt(stat.value.replace(/,/g, ''));

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;
    const duration = 2500; // 2.5 seconds for smoother animation

    const easeOutQuart = (t: number): number => {
      return 1 - Math.pow(1 - t, 4);
    };

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Apply easing function for smooth animation
      const easedProgress = easeOutQuart(progress);
      const currentCount = Math.floor(easedProgress * targetValue);

      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(targetValue);
      }
    };

    const animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [isVisible, targetValue]);

  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US');
  };

  return (
    <div
      className="group relative flex flex-col items-center justify-center text-center p-2 lg:p-3 rounded-xl transition-all duration-500 hover:scale-105"
      style={{
        animationDelay: `${index * 100}ms`,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.6s ease-out'
      }}
    >
      {/* Hover Background Effect */}
      <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Content */}
      <div className="relative z-10">
        {/* Number */}
        <div
          className="text-3xl md:text-4xl lg:text-5xl font-bold mb-1 text-white"
          style={{ fontFamily: 'Arial, sans-serif' }}
        >
          {formatNumber(count)}{stat.suffix}
        </div>

        {/* Label */}
        <div
          className="text-xs md:text-sm font-semibold text-white/90 uppercase tracking-wide leading-tight"
          style={{ fontFamily: 'Arial, sans-serif' }}
        >
          {stat.label}
        </div>
      </div>

      {/* Side Divider (not on last item) */}
      {index < stats.length - 1 && (
        <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-10 bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>
      )}
    </div>
  );
}

