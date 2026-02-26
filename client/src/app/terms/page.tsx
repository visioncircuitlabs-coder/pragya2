"use client";

import { FileText, Shield, AlertCircle, Scale, Mail } from "lucide-react";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-white font-sans selection:bg-brand-secondary/30">
            {/* Hero */}
            <section className="pt-32 pb-16 px-6 lg:px-12 bg-gradient-to-b from-brand-primary/5 via-white to-white">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary/10 border-2 border-brand-primary/20 rounded-full mb-8">
                        <FileText className="w-5 h-5 text-brand-primary" />
                        <span className="text-brand-primary font-bold text-sm uppercase tracking-wider">Legal</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 tracking-tight">
                        Terms &amp; Conditions
                    </h1>
                    <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
                        Please read these terms carefully before using the Pragya platform or purchasing any of our services.
                    </p>
                    <p className="text-sm text-gray-500 mt-4">Last updated: February 17, 2026</p>
                </div>
            </section>

            {/* Content */}
            <section className="py-16 px-6 lg:px-12">
                <div className="max-w-4xl mx-auto prose prose-lg prose-gray">

                    <div className="bg-brand-primary/5 rounded-2xl p-8 border border-brand-primary/10 mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                            <Shield className="w-6 h-6 text-brand-primary" />
                            Agreement Overview
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            These Terms &amp; Conditions (&quot;Terms&quot;) govern your use of the Pragya platform, website, and services operated by <strong>Pragya Career Ecosystem</strong> (referred to as &quot;Pragya&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;). By accessing or using our platform, you agree to be bound by these Terms.
                        </p>
                    </div>

                    {/* Section 1 */}
                    <div className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. About Pragya</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Pragya is a career ecosystem platform that provides:
                        </p>
                        <ul className="space-y-2 text-gray-700">
                            <li className="flex items-start gap-3">
                                <span className="w-2 h-2 rounded-full bg-brand-primary mt-2 flex-shrink-0"></span>
                                <span>Scientific career counselling and guidance services</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-2 h-2 rounded-full bg-brand-primary mt-2 flex-shrink-0"></span>
                                <span>Aptitude, psychometric, AI-driven, personality, and interest assessments</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-2 h-2 rounded-full bg-brand-primary mt-2 flex-shrink-0"></span>
                                <span>Employability skill development and youth advancement programmes</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-2 h-2 rounded-full bg-brand-primary mt-2 flex-shrink-0"></span>
                                <span>AI/ML-based career assessment platforms and digital tools for education and career guidance</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-2 h-2 rounded-full bg-brand-primary mt-2 flex-shrink-0"></span>
                                <span>Online assessment portals and digital career library</span>
                            </li>
                        </ul>
                    </div>

                    {/* Section 2 */}
                    <div className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Eligibility</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            You must be at least 13 years of age to use our services. If you are under 18, you must have consent from a parent or legal guardian. By creating an account, you represent and warrant that you meet these eligibility requirements.
                        </p>
                    </div>

                    {/* Section 3 */}
                    <div className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            When you create an account on our platform, you agree to:
                        </p>
                        <ul className="space-y-2 text-gray-700">
                            <li className="flex items-start gap-3">
                                <span className="w-2 h-2 rounded-full bg-brand-primary mt-2 flex-shrink-0"></span>
                                <span>Provide accurate, current, and complete information</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-2 h-2 rounded-full bg-brand-primary mt-2 flex-shrink-0"></span>
                                <span>Maintain and update your information to keep it accurate</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-2 h-2 rounded-full bg-brand-primary mt-2 flex-shrink-0"></span>
                                <span>Maintain the security and confidentiality of your password</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-2 h-2 rounded-full bg-brand-primary mt-2 flex-shrink-0"></span>
                                <span>Accept responsibility for all activities under your account</span>
                            </li>
                        </ul>
                    </div>

                    {/* Section 4 */}
                    <div className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Services &amp; Assessments</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Pragya offers paid career and employability assessments. By purchasing an assessment, you agree that:
                        </p>
                        <ul className="space-y-2 text-gray-700">
                            <li className="flex items-start gap-3">
                                <span className="w-2 h-2 rounded-full bg-brand-primary mt-2 flex-shrink-0"></span>
                                <span>Assessment results are based on your responses and are intended as guidance tools, not guaranteed outcomes</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-2 h-2 rounded-full bg-brand-primary mt-2 flex-shrink-0"></span>
                                <span>AI-generated insights are advisory in nature and should not be treated as definitive professional advice</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-2 h-2 rounded-full bg-brand-primary mt-2 flex-shrink-0"></span>
                                <span>You must complete the assessment yourself and not share your credentials with others</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-2 h-2 rounded-full bg-brand-primary mt-2 flex-shrink-0"></span>
                                <span>Assessment attempts are non-transferable once started</span>
                            </li>
                        </ul>
                    </div>

                    {/* Section 5 */}
                    <div className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Payment Terms</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            All payments are processed securely through Razorpay, our trusted payment gateway partner. By making a payment, you agree that:
                        </p>
                        <ul className="space-y-2 text-gray-700">
                            <li className="flex items-start gap-3">
                                <span className="w-2 h-2 rounded-full bg-brand-primary mt-2 flex-shrink-0"></span>
                                <span>All prices are quoted in Indian Rupees (₹) and include applicable taxes</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-2 h-2 rounded-full bg-brand-primary mt-2 flex-shrink-0"></span>
                                <span>Payment must be completed before accessing the assessment</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-2 h-2 rounded-full bg-brand-primary mt-2 flex-shrink-0"></span>
                                <span>Refunds are governed by our <a href="/refund-policy" className="text-brand-primary hover:underline font-semibold">Refund Policy</a></span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-2 h-2 rounded-full bg-brand-primary mt-2 flex-shrink-0"></span>
                                <span>Pragya reserves the right to modify pricing with prior notice</span>
                            </li>
                        </ul>
                    </div>

                    {/* Section 6 */}
                    <div className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Intellectual Property</h2>
                        <p className="text-gray-700 leading-relaxed">
                            All content on the Pragya platform, including but not limited to assessment questions, scoring algorithms, AI analysis reports, digital career library content, training modules, courseware, psychometric inventories, and proprietary software, is owned by Pragya and protected by applicable intellectual property laws. You may not reproduce, distribute, modify, or create derivative works from any content on our platform without express written permission.
                        </p>
                    </div>

                    {/* Section 7 */}
                    <div className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">7. User Conduct</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            You agree not to:
                        </p>
                        <ul className="space-y-2 text-gray-700">
                            <li className="flex items-start gap-3">
                                <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></span>
                                <span>Use the platform for any unlawful purpose</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></span>
                                <span>Attempt to reverse-engineer, decompile, or extract assessment logic</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></span>
                                <span>Share or distribute assessment questions, answers, or reports</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></span>
                                <span>Impersonate another person or use false information</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></span>
                                <span>Interfere with or disrupt the platform, servers, or networks</span>
                            </li>
                        </ul>
                    </div>

                    {/* Section 8 */}
                    <div className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitation of Liability</h2>
                        <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                                <div>
                                    <p className="text-gray-700 leading-relaxed mb-4">
                                        Pragya provides career guidance and assessment tools as advisory services. We do not guarantee specific career outcomes, employment, or admissions. Our assessments are tools to aid career decision-making and should be used alongside other professional guidance.
                                    </p>
                                    <p className="text-gray-700 leading-relaxed">
                                        To the maximum extent permitted by law, Pragya shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the platform or services.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 9 */}
                    <div className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Privacy</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Your use of the platform is also governed by our <a href="/privacy-policy" className="text-brand-primary hover:underline font-semibold">Privacy Policy</a>, which describes how we collect, use, and protect your personal information.
                        </p>
                    </div>

                    {/* Section 10 */}
                    <div className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Modifications</h2>
                        <p className="text-gray-700 leading-relaxed">
                            We reserve the right to modify these Terms at any time. Changes will be posted on this page with an updated &quot;Last updated&quot; date. Your continued use of the platform after changes constitutes acceptance of the modified Terms.
                        </p>
                    </div>

                    {/* Section 11 */}
                    <div className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Governing Law &amp; Dispute Resolution</h2>
                        <div className="flex items-start gap-3">
                            <Scale className="w-6 h-6 text-brand-primary flex-shrink-0 mt-1" />
                            <p className="text-gray-700 leading-relaxed">
                                These Terms are governed by Indian law. Any disputes shall be subject to the exclusive jurisdiction of courts in Kozhikode, Kerala, India. We encourage resolution through mutual discussion before pursuing legal remedies.
                            </p>
                        </div>
                    </div>

                    {/* Section 12 */}
                    <div className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Termination</h2>
                        <p className="text-gray-700 leading-relaxed">
                            We may terminate or suspend your account and access to our services at our discretion, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason.
                        </p>
                    </div>

                    {/* Contact */}
                    <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 mt-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                            <Mail className="w-6 h-6 text-brand-primary" />
                            Contact Us
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            If you have any questions about these Terms, please contact us:
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
