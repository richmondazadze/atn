export default function Privacy() {
  return (
    <div className="min-h-screen bg-white px-4 md:px-6 lg:px-[72px]">
      <div className="py-12 lg:py-16 max-w-4xl mx-auto">
        <h1 className="text-3xl lg:text-[48px] lg:leading-[56px] font-semibold mb-3">Privacy Policy</h1>
        <p className="text-sm text-muted mb-10">Last updated: March 13, 2026</p>

        <div className="space-y-8 text-base leading-relaxed max-w-prose">
          {[
            {
              title: '1. Information We Collect',
              content: 'We collect information you provide directly, including:',
              list: ['Name, email, phone number', 'Service provider credentials and licenses', 'Payment information (processed securely by our partners)', 'Booking and transaction history', 'Reviews and ratings'],
            },
            {
              title: '2. How We Use Your Information',
              content: 'We use your information to operate the platform, facilitate bookings, process payments, verify provider credentials, improve our services, and communicate important updates.',
            },
            {
              title: '3. Information Sharing',
              content: 'We share information with service providers to facilitate bookings, with payment processors to handle transactions, and with law enforcement when required by law. We never sell your personal information.',
            },
            {
              title: '4. Data Security',
              content: 'We implement industry-standard security measures to protect your information. However, no method of transmission over the internet is 100% secure.',
            },
            {
              title: '5. Your Rights',
              content: 'You have the right to:',
              list: ['Access your personal information', 'Request correction of inaccurate data', 'Request deletion of your account', 'Opt out of marketing communications'],
            },
            {
              title: '6. Cookies',
              content: 'We use cookies and similar technologies to improve your experience, analyze platform usage, and personalize content.',
            },
            {
              title: '7. Children\'s Privacy',
              content: 'ATN is not intended for users under 18. We do not knowingly collect information from children.',
            },
            {
              title: '8. Changes to Privacy Policy',
              content: 'We may update this policy periodically. We will notify you of significant changes via email or platform notice.',
            },
            {
              title: '9. Contact',
              content: 'For privacy-related questions, contact us at privacy@atn.local',
            },
          ].map(section => (
            <section key={section.title}>
              <h2 className="text-xl font-semibold mb-3">{section.title}</h2>
              <p className="text-foreground mb-3">{section.content}</p>
              {section.list && (
                <ul className="list-disc pl-6 space-y-1">
                  {section.list.map(item => <li key={item}>{item}</li>)}
                </ul>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
