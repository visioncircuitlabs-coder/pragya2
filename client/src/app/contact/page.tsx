"use client";

import { MapPin, Phone, Mail, ArrowRight, Building2, Ship } from "lucide-react";

export default function ContactPage() {
   const locations: Array<{
      city: string;
      email: string;
      phone: string;
      address?: string;
      icon: React.ReactNode;
      bg: string;
      accent: string;
      borderColor: string;
   }> = [
         {
            city: "Kozhikode",
            email: "calicut@pragya.in",
            phone: "+91 98765 43210",
            address: "1st Floor, RP Mall, Mavoor Road, Kozhikode, Kerala, India",
            icon: <Building2 className="w-12 h-12 text-brand-primary" strokeWidth={1.5} />,
            bg: "bg-brand-primary/10",
            accent: "text-brand-primary",
            borderColor: "border-brand-primary/20"
         },
         {
            city: "Alappuzha",
            email: "alleppey@pragya.in",
            phone: "+91 88487 40187",
            address: "1st Floor, Manthanath Buildings, Kaduvettur, Railway Station Road, Near Municipal Office, Chengannur, Alappuzha, Kerala – 689121",
            icon: <Ship className="w-12 h-12 text-brand-secondary" strokeWidth={1.5} />, // Representing backwaters/boats
            bg: "bg-brand-secondary/10",
            accent: "text-brand-secondary",
            borderColor: "border-brand-secondary/20"
         }
      ];

   return (
      <div className="min-h-screen bg-gray-50/50 font-sans selection:bg-brand-secondary/30">

         <main className="relative pt-20 pb-32 px-4 md:px-8 overflow-hidden">
            {/* Abstract Background Shapes */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
               <div className="absolute top-[10%] left-[20%] w-72 h-72 bg-brand-secondary/5 rounded-full blur-3xl mix-blend-multiply animate-blob"></div>
               <div className="absolute top-[20%] right-[20%] w-72 h-72 bg-brand-primary/5 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-2000"></div>
               <div className="absolute bottom-[20%] left-[40%] w-72 h-72 bg-pink-100/40 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-4000"></div>

               {/* Grid Pattern */}
               <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            </div>

            <div className="max-w-7xl mx-auto">
               {/* Header */}
               <div className="text-center max-w-3xl mx-auto mb-20 relative">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm mb-6">
                     <span className="w-2 h-2 rounded-full bg-brand-secondary animate-pulse"></span>
                     <span className="text-xs font-bold tracking-widest text-gray-500 uppercase">Contact Page</span>
                  </div>

                  <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight leading-[0.95]">
                     Get in touch with us for <br />
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">
                        more information
                     </span>
                  </h1>

                  <p className="text-base md:text-lg lg:text-xl text-gray-600 font-medium">
                     If you need help or have a question, we&apos;re here for you.
                  </p>
               </div>

               {/* Cards Grid */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start max-w-4xl mx-auto">
                  {locations.map((loc, index) => (
                     <div
                        key={index}
                        className="group bg-white rounded-[2rem] border border-gray-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] transition-all duration-500 hover:-translate-y-2 overflow-hidden flex flex-col"
                     >
                        {/* Top Color Block with Icon */}
                        <div className={`h-48 ${loc.bg} flex items-center justify-center relative overflow-hidden`}>
                           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                           <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-500">
                              {loc.icon}
                           </div>
                        </div>

                        {/* Content */}
                        <div className="p-8 flex flex-col items-center text-center flex-1">
                           <h3 className="text-2xl font-black text-gray-900 mb-6">{loc.city}</h3>

                           <div className="space-y-4 w-full mb-8">
                              {loc.address && (
                                 <div className="flex items-start justify-center gap-3 text-gray-600 group-hover:text-gray-900 transition-colors mb-4 pb-4 border-b border-gray-100">
                                    <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                                    <span className="font-medium text-base md:text-lg leading-relaxed">{loc.address}</span>
                                 </div>
                              )}
                              <div className="flex items-center justify-center gap-3 text-gray-600 group-hover:text-gray-900 transition-colors">
                                 <Mail className="w-4 h-4" />
                                 <span className="font-medium text-base md:text-lg">{loc.email}</span>
                              </div>
                              <div className="flex items-center justify-center gap-3 text-gray-600 group-hover:text-gray-900 transition-colors">
                                 <Phone className="w-4 h-4" />
                                 <span className="font-medium text-base md:text-lg">{loc.phone}</span>
                              </div>
                           </div>

                           <button className={`w-full py-4 rounded-xl border-2 ${loc.borderColor} ${loc.accent} font-bold text-sm uppercase tracking-wider hover:bg-gradient-to-r hover:from-brand-primary hover:to-brand-primary hover:text-white hover:border-transparent transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-lg`}>
                              View Location
                              <MapPin className="w-4 h-4" />
                           </button>
                        </div>
                     </div>
                  ))}
               </div>

               {/* Bottom "Join Us" Banner (Optional creative touch) */}
               <div className="mt-24 relative rounded-[3rem] overflow-hidden bg-gray-900 text-white p-12 lg:p-20 text-center">
                  <div className="absolute inset-0 opacity-20">
                     <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M0,0 C30,20 70,20 100,0 L100,100 L0,100 Z" fill="url(#grad)" />
                        <defs>
                           <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" style={{ stopColor: '#014b3b' }} />
                              <stop offset="100%" style={{ stopColor: '#c98d1e' }} />
                           </linearGradient>
                        </defs>
                     </svg>
                  </div>

                  <div className="relative z-10 max-w-2xl mx-auto">
                     <h2 className="text-3xl md:text-4xl font-bold mb-6">Want to work with us?</h2>
                     <p className="text-gray-400 mb-8 text-base md:text-lg lg:text-xl">We are always looking for talented individuals to join our team.</p>
                     <button className="px-8 py-3 bg-white text-gray-900 rounded-full font-bold hover:bg-brand-secondary hover:text-white transition-all shadow-lg hover:shadow-brand-secondary/50 flex items-center gap-2 mx-auto">
                        Join the Team <ArrowRight className="w-4 h-4" />
                     </button>
                  </div>
               </div>

            </div>
         </main>
      </div>
   );
}

