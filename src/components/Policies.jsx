export default function PoliciesPage() {
    const sections = [
        {
            id: "help-center",
            title: "Help Center",
            content: [
                {
                    heading: "How do I purchase a story?",
                    body: "Browse our library, select a story, and click 'Purchase Now'. We support secure payments via CashFree. Once payment is confirmed, you get instant access to all episodes of a particular story."
                },
                {
                    heading: "How do I access my purchased stories?",
                    body: "After purchase, go to your Profile. All purchased stories will appear there. Click any story to start listening from where you left off."
                },
                {
                    heading: "What audio quality is available?",
                    body: "All stories are available in high-quality audio streaming. Quality may vary based on your internet connection."
                },
                {
                    heading: "I am facing a payment issue. What should I do?",
                    body: "If your payment failed but amount was deducted, it will be automatically refunded within 5-7 business days. For further assistance, contact us at support@namanstorybook.in."
                },
                {
                    heading: "Can I listen offline?",
                    body: "Currently, offline listening is not supported. You need an active internet connection to stream stories."
                },
            ]
        },
        {
            id: "cancellation-policy",
            title: "Cancellation Policy",
            content: [
                {
                    heading: "Can I cancel my purchase?",
                    body: "Since NamanStoryBook deals in digital content, purchases are generally non-cancellable once access has been granted. We encourage you to read the story description carefully before purchasing."
                },
                {
                    heading: "What if I accidentally purchased the wrong story?",
                    body: "If you accidentally purchased the wrong story and have not accessed any episode, please contact us within 24 hours at support@namanstorybook.in. We will review your case on a case-by-case basis."
                },
            ]
        },
        {
            id: "privacy-policy",
            title: "Privacy Policy",
            content: [
                {
                    heading: "What data do we collect?",
                    body: "We collect your name, email address, phone number, and payment information solely for the purpose of providing our services. We do not sell or share your personal data with third parties for marketing purposes."
                },
                {
                    heading: "How is your data used?",
                    body: "Your data is used to manage your account, process payments, provide customer support, and improve our platform. Payment transactions are processed securely through Razorpay and we do not store your card details."
                },
                {
                    heading: "Cookies",
                    body: "We use cookies and similar technologies to maintain your session, remember your preferences, and analyze platform usage. You may disable cookies in your browser settings, but some features may not work as expected."
                },
                {
                    heading: "Data Security",
                    body: "We implement industry-standard security measures including HTTPS encryption, secure cookie handling, and token-based authentication to protect your data."
                },
                {
                    heading: "Third Party Services",
                    body: "We use CashFree for payment processing. Their privacy policy governs how they handle your payment data. We encourage you to review CashFree's privacy policy at cashfree.com."
                },
            ]
        },
        {
            id: "terms-and-conditions",
            title: "Terms and Conditions",
            content: [
                {
                    heading: "Acceptance of Terms",
                    body: "By accessing or using NamanStoryBook, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our platform."
                },
                {
                    heading: "User Accounts",
                    body: "You are responsible for maintaining the confidentiality of your account credentials. Any activity under your account is your responsibility. Notify us immediately of any unauthorized access."
                },
                {
                    heading: "Content Ownership",
                    body: "All audio content, stories, and related intellectual property on NamanStoryBook are owned by their respective creators and NamanStoryBook. Unauthorized reproduction, distribution, or resale is strictly prohibited."
                },
                {
                    heading: "Permitted Use",
                    body: "Purchased content is licensed for personal, non-commercial use only. You may not share, redistribute, or resell access to any content purchased on this platform."
                },
                {
                    heading: "Platform Availability",
                    body: "We strive to maintain 99.9% uptime but do not guarantee uninterrupted access. We reserve the right to perform maintenance, updates, or changes to the platform at any time."
                },
                {
                    heading: "Termination",
                    body: "We reserve the right to suspend or terminate accounts that violate these terms without prior notice."
                },
            ]
        },
        {
            id: "refund-policy",
            title: "Refund Policy",
            content: [
                {
                    heading: "Digital Content Policy",
                    body: "As NamanStoryBook provides digital audio content, all sales are final once access has been granted. We do not offer refunds for purchased stories or episodes under normal circumstances."
                },
                {
                    heading: "Eligible Refund Cases",
                    body: "Refunds may be considered in the following cases: duplicate payment for the same story, technical failure where content was not delivered, or payment deducted but purchase not confirmed. Contact us within 48 hours with your payment reference."
                },
                {
                    heading: "Refund Process",
                    body: "Approved refunds will be processed back to the original payment method within 5-7 business days. CashFree processing fees, if any, may be deducted from the refund amount."
                },
                {
                    heading: "How to Request a Refund",
                    body: "Email us at support@namanstorybook.in with your registered email, order ID, payment reference number, and reason for refund. Our team will respond within 2 business days."
                },
            ]
        },
    ];

    return (
        <div className="w-full bg-black min-h-screen">
            {/* Hero */}
            <div className="w-full px-6 py-16 flex flex-col items-center gap-3 text-center"
                style={{ background: '#0B0B0F', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <h1 className="text-white text-4xl md:text-5xl font-bold">Policies & Support</h1>
                <p className="text-gray-400 text-sm max-w-md">
                    Everything you need to know about using NamanStoryBook.
                </p>
                {/* Quick Nav */}
                <div className="flex flex-wrap justify-center gap-3 mt-4">
                    {sections.map(s => (
                        <a
                            key={s.id}
                            href={`#${s.id}`}
                            className="px-4 py-2 rounded-full text-sm font-medium transition"
                            style={{ background: 'rgba(108,92,231,0.15)', color: '#A78BFA', border: '1px solid rgba(108,92,231,0.3)' }}
                        >
                            {s.title}
                        </a>
                    ))}
                </div>
            </div>

            {/* Sections */}
            <div className="w-full max-w-4xl mx-auto px-6 py-16 flex flex-col gap-20">
                {sections.map((section) => (
                    <div key={section.id} id={section.id} className="flex flex-col gap-8 scroll-mt-24">
                        {/* Section Title */}
                        <div className="flex items-center gap-4">
                            <div className="h-8 w-1 rounded-full flex-shrink-0"
                                style={{ background: 'linear-gradient(180deg, #6C5CE7 0%, #00E5FF 100%)' }} />
                            <h2 className="text-white text-3xl font-bold">{section.title}</h2>
                        </div>

                        {/* Items */}
                        <div className="flex flex-col gap-6">
                            {section.content.map((item, i) => (
                                <div key={i} className="flex flex-col gap-2 p-6 rounded-2xl"
                                    style={{ background: '#13131A', border: '1px solid rgba(255,255,255,0.06)' }}>
                                    <h3 className="text-white text-base font-semibold">{item.heading}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">{item.body}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}