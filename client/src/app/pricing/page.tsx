"use client";

import { Check, ArrowRight, Shield, CreditCard, HelpCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const plans = [
    {
        id: "student",
        name: "360° Career Assessment",
        audience: "For Students",
        originalPrice: "2,499",
        price: "1,499",
        period: "one-time",
        description: "Scientific career assessment designed to help students discover their ideal career path based on aptitude, personality, and interests.",
        features: [
            "Comprehensive aptitude & psychometric assessment",
            "AI-powered personality and interest profiling",
            "Detailed career-fit analysis across 2,000+ career options",
            "Personalised career recommendations report",
            "Strengths & development areas identification",
            "Access to Digital Career Library",
            "Downloadable PDF report",
            "Email support for result queries"
        ],
        ctaText: "Get Your Career Assessment",
        ctaLink: "/register",
        popular: true
    },
    {
        id: "jobseeker",
        name: "360° Employability Assessment",
        audience: "For Job Seekers",
        originalPrice: "2,499",
        price: "1,499",
        period: "one-time",
        description: "Comprehensive employability assessment to evaluate your career readiness, skill gaps, and role-fit alignment for professional growth.",
        features: [
            "Employability & career readiness evaluation",
            "AI-powered skill-gap analysis",
            "Role-fit alignment assessment",
            "Strengths-based career profile building",
            "Industry-readiness score",
            "Access to talent insights dashboard",
            "Downloadable PDF report",
            "Priority email support"
        ],
        ctaText: "Get Your Employability Assessment",
        ctaLink: "/register",
        popular: false
    }
];

const paymentSteps = [
    {
        step: "1",
        title: "Create Your Account",
        desc: "Register on the Pragya platform with your name, email, and basic details."
    },
    {
        step: "2",
        title: "Select Your Assessment",
        desc: "Choose the 360° Career Assessment (Students) or 360° Employability Assessment (Job Seekers)."
    },
    {
        step: "3",
        title: "Secure Payment via Razorpay",
        desc: "Pay securely using UPI, cards, net banking, or wallets through our Razorpay payment gateway."
    },
    {
        step: "4",
        title: "Take Your Assessment",
        desc: "Complete the assessment at your own pace within the given time frame."
    },
    {
        step: "5",
        title: "Receive Your Report",
        desc: "Get your comprehensive AI-generated career insights and recommendations delivered to your dashboard and email."
    }
];

const faqs = [
    {
        q: "What payment methods do you accept?",
        a: "We accept all major payment methods through Razorpay including UPI (Google Pay, PhonePe, Paytm), credit/debit cards (Visa, Mastercard, RuPay), net banking, and popular wallets."
    },
    {
        q: "Is my payment secure?",
        a: "Yes. All payments are processed through Razorpay, a PCI-DSS Level 1 compliant payment gateway. We never store your card details on our servers."
    },
    {
        q: "Can I get a refund?",
        a: "Yes, if you haven't started the assessment. Please read our Refund Policy for full details on eligible and non-eligible scenarios."
    },
    {
        q: "How long is the assessment valid after purchase?",
        a: "Your assessment access remains valid for 30 days from the date of purchase. You can start it anytime within this period."
    },
    {
        q: "What do I receive after completion?",
        a: "You receive a comprehensive AI-generated report with career/employability insights, strengths analysis, career recommendations, and a downloadable PDF — all accessible via your dashboard."
    },
    {
        q: "Are there any hidden charges?",
        a: "No. The price shown is inclusive of all applicable taxes. There are no additional or hidden charges."
    }
];

export default function PricingPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-brand-secondary/30">
            {/* Hero */}
            <section className="pt-32 pb-16 px-6 lg:px-12 bg-gradient-to-b from-brand-primary/5 via-white to-white">
                <div className="max-w-5xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary/10 border-2 border-brand-primary/20 rounded-full mb-8">
                        <CreditCard className="w-5 h-5 text-brand-primary" />
                        <span className="text-brand-primary font-bold text-sm uppercase tracking-wider">Pricing</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 tracking-tight">
                        Simple, Transparent Pricing
                    </h1>
                    <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
                        Choose the assessment that fits your stage — one-time payment, comprehensive insights, no hidden costs.
                    </p>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="py-16 px-6 lg:px-12">
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                        {plans.map((plan) => (
                            <div
                                key={plan.id}
                                className={`relative rounded-3xl p-8 lg:p-10 border-2 transition-all duration-300 hover:shadow-2xl ${plan.popular
                                    ? "border-brand-primary bg-gradient-to-b from-brand-primary/5 to-white shadow-xl"
                                    : "border-gray-200 bg-white shadow-md hover:border-brand-primary/50"
                                    }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                        <span className="bg-brand-primary text-white px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider">
                                            Most Popular
                                        </span>
                                    </div>
                                )}

                                <div className="text-center mb-8">
                                    <span className="inline-block px-4 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm font-semibold mb-4">
                                        {plan.audience}
                                    </span>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-3">{plan.name}</h2>
                                    <p className="text-gray-600 text-sm leading-relaxed mb-6">{plan.description}</p>
                                    {plan.originalPrice && (
                                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-50 border border-red-200 rounded-full mb-3">
                                            <span className="text-red-600 font-bold text-sm">🎉 Launch Offer</span>
                                        </div>
                                    )}
                                    <div className="flex items-baseline justify-center gap-2">
                                        {plan.originalPrice && (
                                            <span className="text-2xl text-gray-400 line-through font-semibold">₹{plan.originalPrice}</span>
                                        )}
                                    </div>
                                    <div className="flex items-baseline justify-center gap-1">
                                        <span className="text-xl text-gray-500">₹</span>
                                        <span className="text-5xl lg:text-6xl font-black text-green-700">{plan.price}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-2">One-time payment • Inclusive of taxes</p>
                                </div>

                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-700 text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    href={plan.ctaLink}
                                    className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg ${plan.popular
                                        ? "bg-brand-primary text-white hover:bg-brand-primary/90"
                                        : "bg-gray-900 text-white hover:bg-gray-800"
                                        }`}
                                >
                                    {plan.ctaText}
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            </div>
                        ))}
                    </div>

                    {/* Trust badges */}
                    <div className="flex flex-wrap items-center justify-center gap-6 mt-12">
                        {[
                            "Secure Payments via Razorpay",
                            "PCI-DSS Compliant",
                            "SSL Encrypted",
                            "No Hidden Charges"
                        ].map((badge, i) => (
                            <div key={i} className="flex items-center gap-2 text-gray-600 text-sm font-medium">
                                <Shield className="w-4 h-4 text-green-600" />
                                {badge}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Payment Flow */}
            <section className="py-16 px-6 lg:px-12 bg-gray-50">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                            How It Works
                        </h2>
                        <p className="text-gray-600 max-w-xl mx-auto">
                            From registration to receiving your career insights — here&apos;s the complete payment and assessment flow.
                        </p>
                    </div>

                    <div className="space-y-6">
                        {paymentSteps.map((item, i) => (
                            <div key={i} className="flex items-start gap-6 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                                <div className="w-12 h-12 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                                    {item.step}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">{item.title}</h3>
                                    <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQs */}
            <section className="py-16 px-6 lg:px-12">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 flex items-center justify-center gap-3">
                            <HelpCircle className="w-8 h-8 text-brand-primary" />
                            Payment FAQs
                        </h2>
                    </div>

                    <div className="space-y-3">
                        {faqs.map((faq, i) => (
                            <div key={i} className="border border-gray-200 rounded-2xl overflow-hidden">
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors"
                                >
                                    <span className="text-gray-900 font-semibold pr-4">{faq.q}</span>
                                    <span className={`text-brand-primary text-2xl font-light transition-transform duration-300 flex-shrink-0 ${openFaq === i ? "rotate-45" : ""}`}>
                                        +
                                    </span>
                                </button>
                                {openFaq === i && (
                                    <div className="px-6 pb-5">
                                        <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                                        {faq.q.includes("refund") && (
                                            <Link href="/refund-policy" className="text-brand-primary hover:underline font-semibold text-sm mt-2 inline-block">
                                                Read full Refund Policy →
                                            </Link>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 px-6 lg:px-12 bg-brand-primary">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                        Ready to Discover Your Career Path?
                    </h2>
                    <p className="text-white/80 mb-8 max-w-xl mx-auto">
                        Take the first step towards a scientifically-guided career journey. Register now and choose your assessment.
                    </p>
                    <Link
                        href="/register"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-primary rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    >
                        Get Started
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
