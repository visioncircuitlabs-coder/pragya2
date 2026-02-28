"use client";

import { RotateCcw, Clock, CheckCircle, XCircle, Mail } from "lucide-react";

export default function RefundPolicyPage() {
    return (
        <div className="min-h-screen bg-white font-sans selection:bg-brand-secondary/30">
            {/* Hero */}
            <section className="pt-32 pb-16 px-6 lg:px-12 bg-gradient-to-b from-brand-primary/5 via-white to-white">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary/10 border-2 border-brand-primary/20 rounded-full mb-8">
                        <RotateCcw className="w-5 h-5 text-brand-primary" />
                        <span className="text-brand-primary font-bold text-sm uppercase tracking-wider">Legal</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 tracking-tight">
                        Refund &amp; Cancellation Policy
                    </h1>
                    <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
                        We want you to be confident in your purchase. Please review our refund and cancellation terms below.
                    </p>
                    <p className="text-sm text-gray-500 mt-4">Last updated: February 17, 2026</p>
                </div>
            </section>

            {/* Content */}
            <section className="py-16 px-6 lg:px-12">
                <div className="max-w-4xl mx-auto">

                    {/* Overview */}
                    <div className="bg-brand-primary/5 rounded-2xl p-8 border border-brand-primary/10 mb-12">
                        <p className="text-gray-700 leading-relaxed">
                            This Refund &amp; Cancellation Policy applies to all paid services offered by Pragya Career Ecosystem, including the Career Assessment for Students and the Employability Assessment for Job Seekers.
                        </p>
                    </div>

                    {/* Refund Eligibility */}
                    <div className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                            Refund-Eligible Scenarios
                        </h2>
                        <div className="space-y-4">
                            {[
                                {
                                    title: "Payment charged but assessment not started",
                                    desc: "If payment was successfully processed but you have not yet started the assessment, you are eligible for a full refund.",
                                    timeline: "Full refund within 7 business days"
                                },
                                {
                                    title: "Technical failure preventing assessment completion",
                                    desc: "If a verified technical issue on our platform prevented you from completing the assessment, you are eligible for either a refund or a fresh assessment attempt.",
                                    timeline: "Full refund or re-attempt within 7 business days"
                                },
                                {
                                    title: "Duplicate payment",
                                    desc: "If you were charged more than once for the same assessment, the duplicate amount will be refunded.",
                                    timeline: "Automatic refund within 5–7 business days"
                                },
                                {
                                    title: "Cancellation within 24 hours of purchase (before assessment start)",
                                    desc: "If you cancel within 24 hours of payment and have not begun the assessment, you are eligible for a full refund.",
                                    timeline: "Full refund within 7 business days"
                                }
                            ].map((item, i) => (
                                <div key={i} className="bg-green-50 rounded-2xl p-6 border border-green-100">
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                                    <p className="text-gray-700 leading-relaxed mb-3">{item.desc}</p>
                                    <div className="flex items-center gap-2 text-green-700 font-semibold text-sm">
                                        <Clock className="w-4 h-4" />
                                        {item.timeline}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Non-Refundable */}
                    <div className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                            <XCircle className="w-6 h-6 text-red-500" />
                            Non-Refundable Scenarios
                        </h2>
                        <div className="space-y-4">
                            {[
                                {
                                    title: "Assessment has been started or completed",
                                    desc: "Once you have begun answering assessment questions, the service is considered delivered and is non-refundable."
                                },
                                {
                                    title: "Dissatisfaction with assessment results",
                                    desc: "Assessment results are generated based on your responses using validated psychometric and AI methodologies. Disagreement with results does not qualify for a refund."
                                },
                                {
                                    title: "Failure to complete within allotted time",
                                    desc: "If you do not complete the assessment within the allowed timeframe due to personal reasons (not technical issues), no refund is applicable."
                                },
                                {
                                    title: "Violation of terms",
                                    desc: "If your account was suspended due to violation of our Terms & Conditions (e.g., sharing credentials, cheating), no refund is applicable."
                                }
                            ].map((item, i) => (
                                <div key={i} className="bg-red-50 rounded-2xl p-6 border border-red-100">
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                                    <p className="text-gray-700 leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Process */}
                    <div className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Request a Refund</h2>
                        <div className="space-y-4">
                            {[
                                { step: "1", title: "Contact Us", desc: "Email us at info.pragyayouth@gmail.com with your registered email, transaction ID, and reason for refund." },
                                { step: "2", title: "Verification", desc: "Our team will verify your request within 2 business days and confirm eligibility." },
                                { step: "3", title: "Processing", desc: "Approved refunds are processed within 5–7 business days to the original payment method." },
                                { step: "4", title: "Confirmation", desc: "You will receive an email confirmation once the refund has been processed." }
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold flex-shrink-0">
                                        {item.step}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-1">{item.title}</h3>
                                        <p className="text-gray-700 leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Cancellation */}
                    <div className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Cancellation Policy</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            You may cancel a purchased assessment at any time <strong>before starting it</strong>. To cancel:
                        </p>
                        <ul className="space-y-2 text-gray-700">
                            <li className="flex items-start gap-3">
                                <span className="w-2 h-2 rounded-full bg-brand-primary mt-2 flex-shrink-0"></span>
                                <span>Email us at <a href="mailto:info.pragyayouth@gmail.com" className="text-brand-primary hover:underline font-semibold">info.pragyayouth@gmail.com</a> with your account details and transaction ID</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-2 h-2 rounded-full bg-brand-primary mt-2 flex-shrink-0"></span>
                                <span>Cancellations made before starting the assessment receive a full refund</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-2 h-2 rounded-full bg-brand-primary mt-2 flex-shrink-0"></span>
                                <span>Once the assessment has been started, cancellation is not possible</span>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 mt-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                            <Mail className="w-6 h-6 text-brand-primary" />
                            Need Help?
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            For refund requests or questions about this policy:
                        </p>
                        <div className="space-y-2 text-gray-700">
                            <p><strong>Email:</strong> <a href="mailto:info.pragyayouth@gmail.com" className="text-brand-primary hover:underline">info.pragyayouth@gmail.com</a></p>
                            <p><strong>Phone:</strong> <a href="tel:+919562147770" className="text-brand-primary hover:underline">+91 95621 47770</a></p>
                            <p><strong>Response Time:</strong> Within 2 business days</p>
                        </div>
                    </div>

                </div>
            </section>
        </div>
    );
}
