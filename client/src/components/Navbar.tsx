"use client";

import { Menu, X, Phone, Instagram, Youtube, User as UserIcon, LogOut } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md w-full border-b border-gray-100">
      <div className="max-w-[1920px] mx-auto flex items-center justify-between px-4 lg:px-8 xl:px-16 py-2">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex items-center justify-center w-12 h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 group-hover:scale-110 transition-transform">
              {/* Pragya Logo */}
              <Image
                src="/images/PRAGYAlogo.webp"
                alt="Pragya Logo"
                width={80}
                height={80}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-4xl lg:text-5xl xl:text-6xl font-samarkan text-[#0e6957] tracking-wide -mt-1 pb-1">pragya</span>
          </Link>
          <div className="hidden lg:block h-8 w-[1px] bg-gray-200 mx-4 xl:mx-6"></div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-3 xl:gap-5 text-sm xl:text-base font-semibold text-gray-600">
          <Link href="/" className="hover:text-brand-primary transition-colors whitespace-nowrap">
            Home
          </Link>
          <Link href="/about" className="hover:text-brand-primary transition-colors whitespace-nowrap">
            About
          </Link>
          <Link href="/career-library" className="hover:text-brand-primary transition-colors whitespace-nowrap">
            Digital Career Library
          </Link>
          <Link href="/job-seekers" className="hover:text-brand-primary transition-colors whitespace-nowrap">
            Job Seekers
          </Link>
          <Link href="/students" className="hover:text-brand-primary transition-colors whitespace-nowrap">
            Students
          </Link>
          <Link href="/career" className="hover:text-brand-primary transition-colors whitespace-nowrap">
            Career
          </Link>
          <Link href="/contact" className="hover:text-brand-primary transition-colors whitespace-nowrap">
            Contact
          </Link>
          <Link href="/pricing" className="hover:text-brand-primary transition-colors whitespace-nowrap">
            Pricing
          </Link>
        </div>

        {/* CTA Buttons & Mobile Menu Toggle */}
        <div className="flex items-center gap-3 lg:gap-4 ml-3">
          {/* Auth Buttons (Desktop) */}
          <div className="hidden lg:flex items-center gap-4 mr-2">
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 text-gray-600 hover:text-brand-primary font-semibold transition-colors"
                >
                  <UserIcon className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-gray-600 hover:text-red-600 font-semibold transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-brand-primary font-semibold transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2 bg-[#0e6957] text-white rounded-full font-semibold hover:bg-[#0a4f41] transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          <div className="hidden lg:block h-8 w-[1px] bg-gray-200"></div>

          {/* Call Us CTA */}
          <a
            href="tel:+919562147770"
            className="hidden md:flex items-center gap-2 text-gray-900 hover:text-brand-primary transition-colors group"
          >
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center group-hover:bg-green-600 transition-colors">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold text-gray-600">Call Us</span>
              <span className="text-sm font-bold text-gray-900 whitespace-nowrap">+91 95621 47770</span>
            </div>
          </a>

          {/* Social Media Icons */}
          <div className="hidden md:flex items-center gap-2">
            <a
              href="https://www.instagram.com/pragyacareer"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors"
            >
              <Instagram className="w-5 h-5 text-white" />
            </a>
            <a
              href="https://www.youtube.com/@pragyacareer"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
            >
              <Youtube className="w-5 h-5 text-white" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300 max-h-[calc(100vh-100px)] overflow-y-auto">
          <div className="flex flex-col p-6 gap-6 font-bold text-gray-600">
            {isAuthenticated ? (
              <div className="flex flex-col gap-4 border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 font-normal">Welcome,</span>
                    <span className="text-gray-900">{user?.fullName || user?.email}</span>
                  </div>
                </div>
                <Link href="/dashboard" className="text-lg text-emerald-600" onClick={() => setIsOpen(false)}>Dashboard</Link>
                <button onClick={handleLogout} className="text-lg text-red-500 text-left">Logout</button>
              </div>
            ) : (
              <div className="flex flex-col gap-4 border-b border-gray-100 pb-4">
                <Link href="/login" className="text-lg" onClick={() => setIsOpen(false)}>Login</Link>
                <Link href="/register" className="text-lg text-[#0e6957]" onClick={() => setIsOpen(false)}>Register</Link>
              </div>
            )}

            <Link href="/" className="text-lg" onClick={() => setIsOpen(false)}>Home</Link>
            <Link href="/about" className="text-lg" onClick={() => setIsOpen(false)}>About</Link>
            <Link href="/career-library" className="text-lg" onClick={() => setIsOpen(false)}>Digital Career Library</Link>
            <Link href="/job-seekers" className="text-lg" onClick={() => setIsOpen(false)}>Job Seekers</Link>
            <Link href="/students" className="text-lg" onClick={() => setIsOpen(false)}>Students</Link>
            <Link href="/career" className="text-lg" onClick={() => setIsOpen(false)}>Career</Link>
            <Link href="/contact" className="text-lg" onClick={() => setIsOpen(false)}>Contact</Link>
            <Link href="/pricing" className="text-lg" onClick={() => setIsOpen(false)}>Pricing</Link>

            {/* Mobile CTA Section */}
            <div className="h-[1px] bg-gray-100 my-2"></div>
            <a
              href="tel:+919562147770"
              className="flex items-center gap-3 py-3 px-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-gray-600">Call Us</span>
                <span className="text-sm font-bold text-gray-900 whitespace-nowrap">+91 95621 47770</span>
              </div>
            </a>

            <div className="flex items-center justify-center gap-4">
              <a
                href="https://www.instagram.com/pragyacareer"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://www.youtube.com/@pragyacareer"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
              >
                <Youtube className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}