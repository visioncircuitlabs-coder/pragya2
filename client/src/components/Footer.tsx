"use client";

import { Facebook, Instagram, Youtube, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { name: "Career Library", href: "/career-library" },
      { name: "Job Seekers", href: "/job-seekers" },
      { name: "Employer Portal", href: "/employer-portal" },
      { name: "Career", href: "/career" },
      { name: "Pricing", href: "/pricing" },
    ],
    company: [
      { name: "About Us", href: "/about" },
      { name: "Success Stories", href: "#" },
      { name: "For Employers", href: "/employer-portal" },
      { name: "Contact", href: "/contact" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy-policy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Refund Policy", href: "/refund-policy" },
    ]
  };

  return (
    <footer className="relative bg-[#002A22] text-white pt-12 pb-8 overflow-hidden border-t border-white/5">

      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large flowing curve at the bottom */}
        <div className="absolute -bottom-[20%] -left-[10%] w-[800px] h-[800px] bg-brand-primary/20 rounded-full blur-[120px] mix-blend-screen"></div>
        <div className="absolute -top-[10%] -right-[10%] w-[600px] h-[600px] bg-brand-secondary/5 rounded-full blur-[100px]"></div>

        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]"></div>
      </div>

      <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8 mb-12">

          {/* Brand Column */}
          <div className="lg:col-span-4 flex flex-col items-start">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center p-1">
                {/* Logo Icon */}
                <Image
                  src="/images/PRAGYAlogo.webp"
                  alt="Pragya Logo"
                  width={64}
                  height={64}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-5xl font-samarkan text-white tracking-wide mt-2">pragya</span>
            </div>

            <p className="text-gray-400 leading-relaxed mb-6 max-w-sm text-lg">
              Empowering the next generation of talent to discover their true potential and connect with meaningful careers through AI-driven insights.
            </p>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <a
                  href="https://www.instagram.com/pragya_career"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on Instagram"
                  className="w-10 h-10 rounded-full bg-[#014b3b] flex items-center justify-center hover:bg-brand-secondary hover:text-[#002A22] transition-all duration-300 group shadow-lg"
                >
                  <Instagram className="w-5 h-5 text-white group-hover:text-[#002A22] transition-colors" />
                </a>
                <a
                  href="https://www.youtube.com/@pragyacareer"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Subscribe to our YouTube channel"
                  className="w-10 h-10 rounded-full bg-[#014b3b] flex items-center justify-center hover:bg-brand-secondary hover:text-[#002A22] transition-all duration-300 group shadow-lg"
                >
                  <Youtube className="w-5 h-5 text-white group-hover:text-[#002A22] transition-colors" />
                </a>
                <a
                  href="https://www.facebook.com/pragyacareer"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on Facebook"
                  className="w-10 h-10 rounded-full bg-[#014b3b] flex items-center justify-center hover:bg-brand-secondary hover:text-[#002A22] transition-all duration-300 group shadow-lg"
                >
                  <Facebook className="w-5 h-5 text-white group-hover:text-[#002A22] transition-colors" />
                </a>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-2">
            <h4 className="font-bold text-lg mb-4 text-brand-secondary">Platform</h4>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group text-lg">
                    <span className="w-1 h-1 rounded-full bg-brand-secondary opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-bold text-lg mb-4 text-brand-secondary">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group text-lg">
                    <span className="w-1 h-1 rounded-full bg-brand-secondary opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="lg:col-span-4 pl-0 lg:pl-8">
            <h4 className="font-bold text-lg mb-4 text-brand-secondary">Contact Us</h4>
            <div className="space-y-5">
              {/* Addresses Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-brand-secondary" />
                  </div>
                  <div>
                    <p className="font-bold text-white mb-2 text-base">Kozhikode Branch</p>
                    <p className="text-gray-400 leading-relaxed text-base">
                      1st Floor, RP Mall,<br />
                      Mavoor Road, Kozhikode<br />
                      Kerala, India
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-brand-secondary" />
                  </div>
                  <div>
                    <p className="font-bold text-white mb-2 text-base">Alappuzha Branch</p>
                    <p className="text-gray-400 leading-relaxed text-base">
                      1st Floor, Manthanath Buildings, Kaduvettur,<br />
                      Chengannur, Kerala 689121
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Info Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-brand-secondary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-white mb-1 text-base">Email Us</p>
                    <a href="mailto:info.pragyayouth@gmail.com" className="text-gray-400 hover:text-brand-secondary transition-colors text-base block break-words">
                      info.pragyayouth@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-brand-secondary" />
                  </div>
                  <div>
                    <p className="font-bold text-white mb-2 text-base">Call Us</p>
                    <div className="space-y-1">
                      <a href="tel:+919562147770" className="text-gray-400 hover:text-brand-secondary transition-colors font-mono text-base block whitespace-nowrap">
                        +91 95621 47770
                      </a>
                      <a href="tel:+918848740187" className="text-gray-400 hover:text-brand-secondary transition-colors font-mono text-base block whitespace-nowrap">
                        +91 88487 40187
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm font-medium">
            © {currentYear} PRAGYA. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-4 md:gap-6">
            {footerLinks.legal.map((link) => (
              <Link key={link.name} href={link.href} className="text-base text-gray-500 hover:text-brand-secondary transition-colors">
                {link.name}
              </Link>
            ))}
            <span className="text-base text-gray-500">•</span>
            <span className="text-base text-gray-500">
              Built by <span className="font-bold text-brand-secondary hover:text-brand-primary transition-colors">VISION CIRCUIT LABS</span>
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}

