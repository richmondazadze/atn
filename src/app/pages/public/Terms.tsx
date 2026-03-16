export default function Terms() {
  return (
    <div className="min-h-screen bg-white px-6 lg:px-[72px]">
      <div className="py-12 lg:py-16 max-w-4xl mx-auto">
        <h1 className="text-3xl lg:text-[48px] lg:leading-[56px] font-semibold mb-3">Terms of Service</h1>
        <p className="text-sm text-muted mb-10">Last updated: March 13, 2026</p>

        <div className="space-y-8 text-base leading-relaxed">
          {[
            {
              title: '1. Acceptance of Terms',
              content: 'By accessing and using Access Terrain Network (ATN), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.',
            },
            {
              title: '2. User Accounts',
              content: 'You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.',
              list: ['Provide accurate and complete information during registration', 'Keep your account information up to date', 'Notify us immediately of any unauthorized use'],
            },
            {
              title: '3. Service Provider Responsibilities',
              content: 'Service providers must maintain appropriate licenses, insurance, and certifications for their offered services. Providers are independent contractors and not employees of ATN.',
            },
            {
              title: '4. Booking & Cancellation',
              content: 'Customers may cancel bookings up to 24 hours before the scheduled time for a full refund. Cancellations within 24 hours may incur fees as outlined in the provider\'s cancellation policy.',
            },
            {
              title: '5. Payments',
              content: 'All payments are processed securely through our payment partners. ATN charges a service fee on each transaction.',
            },
            {
              title: '6. Prohibited Conduct',
              content: 'Users may not:',
              list: ['Use the platform for illegal purposes', 'Harass, threaten, or discriminate against other users', 'Post false or misleading information', 'Attempt to circumvent platform fees'],
            },
            {
              title: '7. Limitation of Liability',
              content: 'ATN is a marketplace platform. We are not responsible for the quality, safety, or legality of services provided. Users engage with service providers at their own risk.',
            },
            {
              title: '8. Changes to Terms',
              content: 'We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the updated terms.',
            },
            {
              title: '9. Contact',
              content: 'For questions about these Terms of Service, contact us at support@atn.local',
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
