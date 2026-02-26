"use client";

import Image from "next/image";
import { useRef } from "react";

export default function CompanyLogos() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const companies = [
    // Consulting & Big 4
    { name: "BCG", file: "BCG.webp" },
    { name: "PWC", file: "PWC.webp" },
    { name: "EY", file: "EY.webp" },
    { name: "KPMG", file: "KPMG.webp" },
    { name: "Deloitte", file: "DELOITTE.webp" },
    { name: "McKinsey & Company", file: "McKINSEY.webp" },
    { name: "Grant Thornton", file: "GRANT THRONTON.webp" },
    // Banking & Finance
    { name: "Goldman Sachs", file: "GOLDMANSACHS.webp" },
    { name: "JP Morgan", file: "J.P.MORGAN.webp" },
    { name: "Axis Bank", file: "AXISBANK.webp" },
    { name: "ICICI Bank", file: "ICICIBANK.webp" },
    { name: "HDFC Bank", file: "HDFCBANK.webp" },
    { name: "HSBC", file: "HSBC.webp" },
    { name: "Standard Chartered", file: "STANDARDCHARTERED.webp" },
    { name: "Citibank", file: "CITIBANK.webp" },
    { name: "Bajaj Finserv", file: "BAJAJ FINSERV.webp" },
    { name: "Barclays", file: "BARCLAYS.webp" },
    { name: "Federal Bank", file: "FEDERALBANK.webp" },
    // Tech & IT Services
    { name: "Infosys", file: "INFOSYS.webp" },
    { name: "Accenture", file: "ACCENTURE.webp" },
    { name: "Wipro", file: "WIPRO.webp" },
    { name: "IBM", file: "IBM.webp" },
    { name: "Google", file: "GOOGLE.webp" },
    { name: "Microsoft", file: "MICROSOFT.webp" },
    { name: "HP", file: "HP.webp" },
    { name: "Apple", file: "APPLE.webp" },
    { name: "Amazon", file: "AMAZON.webp" },
    // Telecom & Services
    { name: "EXL", file: "EXL.webp" },
    { name: "Reliance", file: "RELIANCE.webp" },
    { name: "Airtel", file: "AIRTEL.webp" },
    // Automotive & Manufacturing
    { name: "Audi", file: "AUDI.webp" },
    { name: "BMW Financial Services", file: "BMW FINANCIAL SERVICES.webp" },
    { name: "Mercedes-Benz", file: "MERCEDES-BENZ.webp" },
    { name: "Tata", file: "TATA.webp" },
    { name: "Hero", file: "HERO.webp" },
    { name: "Mahindra", file: "MAHINDRA.webp" },
    { name: "Jindal Steel & Power", file: "JINDAL STEEL & POWER.webp" },
    { name: "L&T", file: "L&T.webp" },
    // Brands & Retail
    { name: "Aditya Birla Group", file: "ADITYA BIRLA GROUP.webp" },
    { name: "Pepsi", file: "PEPSI.webp" },
    { name: "MasterCard", file: "MASTERCARD.webp" },
    { name: "Visa", file: "VISA.png" },
    { name: "American Express", file: "AMERICAN EXPRESS.webp" },
    { name: "Nivea", file: "NIVEA.webp" },
  ];

  // Split companies into 3 rows
  const companiesPerRow = Math.ceil(companies.length / 3);
  const row1 = companies.slice(0, companiesPerRow);
  const row2 = companies.slice(companiesPerRow, companiesPerRow * 2);
  const row3 = companies.slice(companiesPerRow * 2);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full bg-gray-50/50 border-y border-gray-100 pt-10 lg:pt-12 pb-12 lg:pb-14">
      <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
            Industry Partners
          </h2>
        </div>

        {/* Scrollable Grid Container */}
        <div className="relative">
          {/* Scroll Buttons */}
          <button
            onClick={scrollLeft}
            aria-label="Scroll company logos left"
            className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-100 items-center justify-center text-gray-600 hover:text-brand-primary hover:shadow-xl transition-all duration-300 -ml-6"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={scrollRight}
            aria-label="Scroll company logos right"
            className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-100 items-center justify-center text-gray-600 hover:text-brand-primary hover:shadow-xl transition-all duration-300 -mr-6"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Fade Gradients */}
          <div className="hidden lg:block absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-gray-50/90 to-transparent pointer-events-none z-10"></div>
          <div className="hidden lg:block absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-gray-50/90 to-transparent pointer-events-none z-10"></div>

          {/* Grid Container with Horizontal Scroll */}
          <div
            ref={scrollContainerRef}
            className="overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="inline-flex flex-col gap-6 min-w-full">

              {/* Row 1 */}
              <div className="flex gap-6">
                {row1.map((company, index) => (
                  <div
                    key={`row1-${index}`}
                    className="flex-shrink-0 w-[180px] md:w-[220px] h-[100px] md:h-[120px] bg-white rounded-2xl border border-gray-200 hover:border-brand-primary/30 hover:shadow-lg transition-all duration-300 p-6 flex items-center justify-center group cursor-pointer"
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={`/logos/${company.file}`}
                        alt={`${company.name} logo`}
                        fill
                        className="object-contain opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                        sizes="220px"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Row 2 */}
              <div className="flex gap-6">
                {row2.map((company, index) => (
                  <div
                    key={`row2-${index}`}
                    className="flex-shrink-0 w-[180px] md:w-[220px] h-[100px] md:h-[120px] bg-white rounded-2xl border border-gray-200 hover:border-brand-primary/30 hover:shadow-lg transition-all duration-300 p-6 flex items-center justify-center group cursor-pointer"
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={`/logos/${company.file}`}
                        alt={`${company.name} logo`}
                        fill
                        className="object-contain opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                        sizes="220px"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Row 3 */}
              <div className="flex gap-6">
                {row3.map((company, index) => (
                  <div
                    key={`row3-${index}`}
                    className="flex-shrink-0 w-[180px] md:w-[220px] h-[100px] md:h-[120px] bg-white rounded-2xl border border-gray-200 hover:border-brand-primary/30 hover:shadow-lg transition-all duration-300 p-6 flex items-center justify-center group cursor-pointer"
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={`/logos/${company.file}`}
                        alt={`${company.name} logo`}
                        fill
                        className="object-contain opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                        sizes="220px"
                      />
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

