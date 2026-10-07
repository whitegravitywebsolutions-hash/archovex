<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Page;
use App\Models\SeoMetadata;

class LegalPagesSeeder extends Seeder
{
    public function run()
    {
        // 1. Privacy Policy Page
        Page::updateOrCreate(
            ['slug' => 'privacy-policy'],
            [
                'title' => 'Privacy Policy',
                'status' => 'published',
                'meta_title' => 'Privacy Policy | ARCHOVEX INFRA PRIVATE LIMITED',
                'meta_description' => 'Read ARCHOVEX INFRA Privacy Policy to learn how we collect, protect, and handle your personal information.',
                'sections' => [
                    [
                        'id' => 'sec-privacy-hero',
                        'type' => 'hero',
                        'is_active' => true,
                        'title' => 'PRIVACY POLICY',
                        'subtitle' => 'Learn how ARCHOVEX INFRA PRIVATE LIMITED collects, uses, and protects your personal information.',
                        'badge' => 'LEGAL & COMPLIANCE',
                        'bg_image' => 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1600&q=80',
                        'theme' => 'dark',
                    ],
                    [
                        'id' => 'sec-privacy-content',
                        'type' => 'richtext',
                        'is_active' => true,
                        'title' => 'ARCHOVEX INFRA PRIVACY POLICY',
                        'content' => "<div class=\"space-y-6\">\n<p><strong>Effective Date:</strong> January 1, 2026</p>\n<p>At <strong>ARCHOVEX INFRA PRIVATE LIMITED</strong>, we are committed to safeguarding the privacy of our website visitors, clients, and project stakeholders. This Privacy Policy outlines how we collect, process, use, and protect your personal information when you interact with our website, request consultations, or engage our turnkey interior design services.</p>\n\n<h3 class=\"text-[#0C4A6E] font-bold text-xl mt-6 mb-2\">1. Information We Collect</h3>\n<p>We collect personal information that you voluntarily provide to us when filling out consultation forms, requesting 3D renders, contacting our support, or subscribing to our newsletters. This includes:</p>\n<ul class=\"list-disc pl-6 space-y-1\">\n<li><strong>Personal Identifiers:</strong> Name, phone number, email address, and residential address.</li>\n<li><strong>Project & Property Details:</strong> Floor plans, room counts (e.g., 2BHK, 3BHK, Villa), budget expectations, and aesthetic preferences.</li>\n<li><strong>Technical Data:</strong> IP address, browser type, device information, and browsing activity collected via cookies to optimize website performance.</li>\n</ul>\n\n<h3 class=\"text-[#0C4A6E] font-bold text-xl mt-6 mb-2\">2. How We Use Your Information</h3>\n<p>Your information is used strictly to provide, improve, and personalize our services, including:</p>\n<ul class=\"list-disc pl-6 space-y-1\">\n<li>Scheduling in-person or virtual interior design consultations.</li>\n<li>Preparing photorealistic 3D renders and itemized price quotations.</li>\n<li>Managing project updates, manufacturing progress, and installation schedules.</li>\n<li>Sending relevant updates regarding warranty coverage, service offers, and interior design guides.</li>\n</ul>\n\n<h3 class=\"text-[#0C4A6E] font-bold text-xl mt-6 mb-2\">3. Data Security & Protection</h3>\n<p>We implement robust technical and organizational security measures to prevent unauthorized access, disclosure, alteration, or destruction of your personal data. Your contact and project information is stored securely and is accessible only to authorized ARCHOVEX project personnel.</p>\n\n<h3 class=\"text-[#0C4A6E] font-bold text-xl mt-6 mb-2\">4. Third-Party Sharing</h3>\n<p>ARCHOVEX INFRA does not sell, rent, or trade your personal data to third-party marketers. We may share data only with trusted partners directly involved in project execution (e.g., automated German factory partners, logistics providers) under strict non-disclosure obligations.</p>\n\n<h3 class=\"text-[#0C4A6E] font-bold text-xl mt-6 mb-2\">5. Your Rights & Contact Us</h3>\n<p>You have the right to request access to, correction of, or deletion of your personal data held by us at any time. For privacy inquiries or data requests, please contact our compliance team:</p>\n<p><strong>Email:</strong> privacy@archovex.com<br/><strong>Phone:</strong> +91 98765 43210<br/><strong>Address:</strong> ARCHOVEX INFRA PRIVATE LIMITED, Corporate Tower, Sector 44, Gurgaon, Haryana, India</p>\n</div>",
                    ],
                    [
                        'id' => 'sec-privacy-cta',
                        'type' => 'cta',
                        'is_active' => true,
                        'title' => 'Have Questions Regarding Our Privacy Practices?',
                        'subtitle' => 'Our compliance and data protection team is here to assist you.',
                        'cta_text' => 'CONTACT SUPPORT',
                        'cta_link' => '/contact',
                        'theme' => 'dark',
                    ],
                ]
            ]
        );

        SeoMetadata::updateOrCreate(
            ['path' => '/privacy-policy'],
            [
                'meta_title' => 'Privacy Policy | ARCHOVEX INFRA PRIVATE LIMITED',
                'meta_description' => 'Read ARCHOVEX INFRA Privacy Policy to learn how we collect, protect, and handle your personal information.',
                'canonical_url' => url('/privacy-policy'),
                'robots_index' => true,
                'robots_follow' => true,
            ]
        );

        // 2. Terms & Conditions Page
        Page::updateOrCreate(
            ['slug' => 'terms-and-conditions'],
            [
                'title' => 'Terms & Conditions',
                'status' => 'published',
                'meta_title' => 'Terms & Conditions | ARCHOVEX INFRA PRIVATE LIMITED',
                'meta_description' => 'Read the terms and conditions governing ARCHOVEX INFRA turnkey interior design services, warranty, and 45-day delivery guarantee.',
                'sections' => [
                    [
                        'id' => 'sec-terms-hero',
                        'type' => 'hero',
                        'is_active' => true,
                        'title' => 'TERMS & CONDITIONS',
                        'subtitle' => 'Terms governing our turnkey interior design services, 10-year warranty, and 45-day delivery guarantee.',
                        'badge' => 'AGREEMENT & POLICIES',
                        'bg_image' => 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1600&q=80',
                        'theme' => 'dark',
                    ],
                    [
                        'id' => 'sec-terms-content',
                        'type' => 'richtext',
                        'is_active' => true,
                        'title' => 'TERMS OF SERVICE & PROJECT AGREEMENT',
                        'content' => "<div class=\"space-y-6\">\n<p><strong>Effective Date:</strong> January 1, 2026</p>\n<p>Welcome to <strong>ARCHOVEX INFRA PRIVATE LIMITED</strong>. These Terms & Conditions govern your access to and use of our website, interior design services, 3D render consultations, modular product sales, and site execution projects. By engaging our services or placing a project order, you agree to comply with these terms.</p>\n\n<h3 class=\"text-[#0C4A6E] font-bold text-xl mt-6 mb-2\">1. Scope of Services</h3>\n<p>ARCHOVEX INFRA provides comprehensive turnkey home interior solutions, including architectural space planning, modular kitchen & wardrobe manufacturing, false ceiling installation, lighting, painting, and custom furniture execution. Specific deliverables, material specifications, and line-item pricing are detailed in individual client project contracts.</p>\n\n<h3 class=\"text-[#0C4A6E] font-bold text-xl mt-6 mb-2\">2. 45-Day Handover Guarantee</h3>\n<p>Our 45-Day Delivery Guarantee applies to standard modular interior orders starting from the date of final 3D design sign-off, material freeze, and 50% milestone payment clearance, provided the site is structurally ready and unencumbered by civil work delays outside ARCHOVEX control.</p>\n\n<h3 class=\"text-[#0C4A6E] font-bold text-xl mt-6 mb-2\">3. 10-Year Warranty Terms</h3>\n<p>ARCHOVEX INFRA provides a flat 10-year warranty covering manufacturing defects, structural integrity, and German hardware components (hinges, drawer runners) in modular cabinetry. The warranty does not cover normal wear and tear, physical abuse, water seepage from external civil structures, or unauthorized modifications.</p>\n\n<h3 class=\"text-[#0C4A6E] font-bold text-xl mt-6 mb-2\">4. Payment Terms & Milestones</h3>\n<p>Project execution follows a transparent milestone payment structure:</p>\n<ul class=\"list-disc pl-6 space-y-1\">\n<li><strong>10% Booking Amount:</strong> Initiates initial site measurement and 3D concept design.</li>\n<li><strong>40% Factory Production Release:</strong> Upon 3D design freeze and material finalization.</li>\n<li><strong>50% Pre-Dispatch:</strong> Prior to material dispatch from our German automated manufacturing facility.</li>\n</ul>\n\n<h3 class=\"text-[#0C4A6E] font-bold text-xl mt-6 mb-2\">5. Governing Law</h3>\n<p>These terms are governed by and construed in accordance with the laws of India. Any disputes arising out of or related to these terms shall be subject to the exclusive jurisdiction of the courts in Gurgaon / Delhi, India.</p>\n</div>",
                    ],
                    [
                        'id' => 'sec-terms-cta',
                        'type' => 'cta',
                        'is_active' => true,
                        'title' => 'Ready to Build Your Dream Home Interiors?',
                        'subtitle' => 'Book a free 3D consultation with ARCHOVEX interior experts today.',
                        'cta_text' => 'BOOK FREE CONSULTATION',
                        'cta_link' => '#consultation',
                        'theme' => 'dark',
                    ],
                ]
            ]
        );

        SeoMetadata::updateOrCreate(
            ['path' => '/terms-and-conditions'],
            [
                'meta_title' => 'Terms & Conditions | ARCHOVEX INFRA PRIVATE LIMITED',
                'meta_description' => 'Read the terms and conditions governing ARCHOVEX INFRA turnkey interior design services, warranty, and 45-day delivery guarantee.',
                'canonical_url' => url('/terms-and-conditions'),
                'robots_index' => true,
                'robots_follow' => true,
            ]
        );
    }
}
