"use client";

import { Shield, Eye, Lock, Database, UserCheck, Mail } from "lucide-react";

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-white font-sans selection:bg-brand-secondary/30">
            {/* Hero */}
            <section className="pt-32 pb-16 px-6 lg:px-12 bg-gradient-to-b from-brand-primary/5 via-white to-white">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary/10 border-2 border-brand-primary/20 rounded-full mb-8">
                        <Shield className="w-5 h-5 text-brand-primary" />
                        <span className="text-brand-primary font-bold text-sm uppercase tracking-wider">Legal</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 tracking-tight">
                        Privacy Policy
                    </h1>
                    <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
                        Your privacy matters to us. This policy explains how we collect, use, and safeguard your information.
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
                            Pragya Career Ecosystem (&quot;Pragya&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your personal information. This Privacy Policy describes our practices regarding the collection, use, storage, and disclosure of information through our website and services.
                        </p>
                    </div>

                    {/* Section 1 */}
                    <div className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                            <Database className="w-6 h-6 text-brand-primary" />
                            1. Information We Collect
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-3">a) Information You Provide</h3>
                                <ul className="space-y-2 text-gray-700">
                                    <li className="flex items-start gap-3">
                                        <span className="w-2 h-2 rounded-full bg-brand-primary mt-2 flex-shrink-0"></span>
                                        <span><strong>Account Information:</strong> Name, email address, phone number, and password when you register</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="w-2 h-2 rounded-full bg-brand-primary mt-2 flex-shrink-0"></span>
                                        <span><strong>Assessment Responses:</strong> Your answers to career, aptitude, personality, and psychometric assessments</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="w-2 h-2 rounded-full bg-brand-primary mt-2 flex-shrink-0"></span>
                                        <span><strong>Profile Data:</strong> Educational background, career interests, skills, and related information</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="w-2 h-2 rounded-full bg-brand-primary mt-2 flex-shrink-0"></span>
                                        <span><strong>Payment Information:</strong> Transaction details processed through Razorpay (we do not store card numbers)</span>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-3">b) Information Collected Automatically</h3>
                                <ul className="space-y-2 text-gray-700">
                                    <li className="flex items-start gap-3">
                                        <span className="w-2 h-2 rounded-full bg-brand-secondary mt-2 flex-shrink-0"></span>
                                        <span><strong>Device Information:</strong> Browser type, operating system, IP address</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="w-2 h-2 rounded-full bg-brand-secondary mt-2 flex-shrink-0"></span>
                                        <span><strong>Usage Data:</strong> Pages visited, time spent, assessment completion patterns</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="w-2 h-2 rounded-full bg-brand-secondary mt-2 flex-shrink-0"></span>
                                        <span><strong>Cookies:</strong> Essential cookies for authentication and session management</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Section 2 */}
                    <div className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                            <Eye className="w-6 h-6 text-brand-primary" />
                            2. How We Use Your Information
                        </h2>
                        <ul className="space-y-2 text-gray-700">
                            <li className="flex items-start gap-3">
                                <span className="w-2 h-2 rounded-full bg-brand-primary mt-2 flex-shrink-0"></span>
                                <span>To provide and personalise our career assessment and guidance services</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-2 h-2 rounded-full bg-brand-primary mt-2 flex-shrink-0"></span>
                                <span>To generate AI-driven career and employability insights and reports</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-2 h-2 rounded-full bg-brand-primary mt-2 flex-shrink-0"></span>
                                <span>To process payments and fulfil service orders</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-2 h-2 rounded-full bg-brand-primary mt-2 flex-shrink-0"></span>
                                <span>To communicate about your account, assessments, and results</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-2 h-2 rounded-full bg-brand-primary mt-2 flex-shrink-0"></span>
                                <span>To improve our platform, services, and assessment quality</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-2 h-2 rounded-full bg-brand-primary mt-2 flex-shrink-0"></span>
                                <span>To comply with legal obligations and prevent fraud</span>
                            </li>
                        </ul>
                    </div>

                    {/* Section 3 */}
                    <div className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Data Sharing</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            We do <strong>not sell</strong> your personal data. We may share information only in the following circumstances:
                        </p>
                        <ul className="space-y-2 text-gray-700">
                            <li className="flex items-start gap-3">
                                <span className="w-2 h-2 rounded-full bg-brand-primary mt-2 flex-shrink-0"></span>
                                <span><strong>Payment Processing:</strong> Transaction data shared with Razorpay for payment processing</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-2 h-2 rounded-full bg-brand-primary mt-2 flex-shrink-0"></span>
                                <span><strong>AI Analysis:</strong> Assessment data processed through AI services (Google Gemini) for report generation — data is processed, not stored by the AI provider</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-2 h-2 rounded-full bg-brand-primary mt-2 flex-shrink-0"></span>
                                <span><strong>With Your Consent:</strong> Anonymised assessment profile data shared with partner organisations only if you explicitly opt in</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-2 h-2 rounded-full bg-brand-primary mt-2 flex-shrink-0"></span>
                                <span><strong>Legal Requirements:</strong> When required by law, regulation, or legal process</span>
                            </li>
                        </ul>
                    </div>

                    {/* Section 4 */}
                    <div className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                            <Lock className="w-6 h-6 text-brand-primary" />
                            4. Data Security
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            We implement industry-standard security measures to protect your data:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                "Encrypted data transmission (HTTPS/TLS)",
                                "Secure password hashing (bcrypt)",
                                "JWT-based authentication",
                                "Rate limiting and brute-force protection",
                                "Regular security audits",
                                "Access control and role-based permissions"
                            ].map((item, i) => (
                                <div key={i} className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-center gap-3">
                                    <Lock className="w-4 h-4 text-brand-primary flex-shrink-0" />
                                    <span className="text-gray-700 text-sm font-medium">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section 5 */}
                    <div className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Retention</h2>
                        <p className="text-gray-700 leading-relaxed">
                            We retain your personal data for as long as your account is active or as needed to provide services. Assessment data and reports are retained to allow you to access your results. You may request deletion of your account and associated data at any time (see Section 6).
                        </p>
                    </div>

                    {/* Section 6 */}
                    <div className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                            <UserCheck className="w-6 h-6 text-brand-primary" />
                            6. Your Rights
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            You have the following rights regarding your personal data:
                        </p>
                        <ul className="space-y-2 text-gray-700">
                            <li className="flex items-start gap-3">
                                <span className="w-2 h-2 rounded-full bg-brand-primary mt-2 flex-shrink-0"></span>
                                <span><strong>Access:</strong> Request a copy of the personal data we hold about you</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-2 h-2 rounded-full bg-brand-primary mt-2 flex-shrink-0"></span>
                                <span><strong>Correction:</strong> Request correction of inaccurate personal data</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-2 h-2 rounded-full bg-brand-primary mt-2 flex-shrink-0"></span>
                                <span><strong>Deletion:</strong> Request deletion of your account and associated data</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-2 h-2 rounded-full bg-brand-primary mt-2 flex-shrink-0"></span>
                                <span><strong>Portability:</strong> Request your data in a portable format</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-2 h-2 rounded-full bg-brand-primary mt-2 flex-shrink-0"></span>
                                <span><strong>Opt-out:</strong> Unsubscribe from marketing communications at any time</span>
                            </li>
                        </ul>
                        <p className="text-gray-700 leading-relaxed mt-4">
                            To exercise any of these rights, contact us at <a href="mailto:info.pragyayouth@gmail.com" className="text-brand-primary hover:underline font-semibold">info.pragyayouth@gmail.com</a>.
                        </p>
                    </div>

                    {/* Section 7 */}
                    <div className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookies</h2>
                        <p className="text-gray-700 leading-relaxed">
                            We use essential cookies for authentication and session management. These cookies are necessary for the platform to function properly. We do not use tracking or advertising cookies. By using our platform, you consent to the use of essential cookies.
                        </p>
                    </div>

                    {/* Section 8 */}
                    <div className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Children&apos;s Privacy</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Our student assessment services may be used by individuals aged 13 and above with parental consent. We take special care to protect the data of minors and do not knowingly collect personal information from children under 13 without verified parental consent.
                        </p>
                    </div>

                    {/* Section 9 */}
                    <div className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Changes to This Policy</h2>
                        <p className="text-gray-700 leading-relaxed">
                            We may update this Privacy Policy periodically. Changes will be posted on this page with an updated effective date. We encourage you to review this page regularly for the latest information about our privacy practices.
                        </p>
                    </div>

                    {/* Contact */}
                    <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 mt-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                            <Mail className="w-6 h-6 text-brand-primary" />
                            Contact Us
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            If you have any questions about this Privacy Policy or wish to exercise your data rights:
                        </p>
                        <div className="space-y-2 text-gray-700">
                            <p><strong>Email:</strong> <a href="mailto:info.pragyayouth@gmail.com" className="text-brand-primary hover:underline">info.pragyayouth@gmail.com</a></p>
                            <p><strong>Phone:</strong> <a href="tel:+919562147770" className="text-brand-primary hover:underline">+91 95621 47770</a></p>
                            <p><strong>Address:</strong> 1st Floor, RP Mall, Mavoor Road, Kozhikode, Kerala, India</p>
                        </div>
                    </div>

                </div>
            </section>
        </div>
    );
}
