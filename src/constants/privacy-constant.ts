// Privacy Policy constants for Go Journy platform

export const PRIVACY_POLICY = {
  title: "Privacy Policy",
  subtitle: "Your privacy is important to us. This policy explains how we collect, use, and protect your information.",
  lastUpdated: "December 24, 2025",
  effectiveDate: "January 1, 2025",

  tableOfContents: [
    { id: "information-we-collect", label: "Information We Collect" },
    { id: "how-we-use", label: "How We Use Your Information" },
    { id: "information-sharing", label: "Information Sharing and Disclosure" },
    { id: "data-security", label: "Data Security" },
    { id: "your-rights", label: "Your Privacy Rights" },
    { id: "cookies", label: "Cookies and Tracking Technologies" },
    { id: "children", label: "Children's Privacy" },
    { id: "updates", label: "Changes to This Policy" },
    { id: "contact", label: "Contact Us" },
  ],

  sections: {
    informationWeCollect: {
      title: "Information We Collect",
      subtitle: "We collect information to provide and improve our ride-sharing services.",
      content: [
        {
          title: "Information You Provide",
          items: [
            "Account information (name, email, phone number, password)",
            "Profile information (photo, preferred language, emergency contacts)",
            "Payment information (credit card details, billing address)",
            "Trip information (pickup/dropoff locations, ride preferences)",
            "Communications with us (support tickets, feedback, reviews)",
          ],
        },
        {
          title: "Information Collected Automatically",
          items: [
            "Device information (IP address, browser type, operating system)",
            "Location data (GPS coordinates, Wi-Fi networks, cell towers)",
            "Usage data (app interactions, ride history, feature usage)",
            "Performance data (app crashes, load times, error reports)",
          ],
        },
        {
          title: "Information from Third Parties",
          items: [
            "Social media profiles (when you connect social accounts)",
            "Background check results (for driver verification)",
            "Insurance and safety reports",
            "Public records and government databases",
          ],
        },
      ],
    },

    howWeUse: {
      title: "How We Use Your Information",
      subtitle: "We use your information to provide safe, reliable transportation services.",
      uses: [
        {
          title: "Provide Services",
          description: "Process bookings, match riders with drivers, calculate fares, and complete transactions.",
        },
        {
          title: "Safety and Security",
          description: "Verify identities, conduct background checks, monitor for fraud, and ensure platform safety.",
        },
        {
          title: "Improve Experience",
          description: "Personalize features, optimize routes, reduce wait times, and develop new services.",
        },
        {
          title: "Legal Compliance",
          description: "Comply with laws, regulations, and legal processes in jurisdictions where we operate.",
        },
        {
          title: "Communication",
          description: "Send ride confirmations, payment receipts, safety alerts, and service updates.",
        },
      ],
    },

    informationSharing: {
      title: "Information Sharing and Disclosure",
      subtitle: "We share information only when necessary and with appropriate safeguards.",
      sharing: [
        {
          title: "With Other Users",
          description: "Share limited information between matched riders and drivers (name, photo, rating, location during trip).",
        },
        {
          title: "Service Providers",
          description: "Share with payment processors, mapping services, insurance providers, and other vendors.",
        },
        {
          title: "Law Enforcement",
          description: "Share information when required by law, to protect safety, or prevent illegal activities.",
        },
        {
          title: "Business Transfers",
          description: "Share information in connection with mergers, acquisitions, or asset sales.",
        },
      ],
    },

    dataSecurity: {
      title: "Data Security",
      subtitle: "We implement industry-leading security measures to protect your information.",
      measures: [
        "End-to-end encryption for sensitive data transmission",
        "Secure data centers with 24/7 monitoring",
        "Regular security audits and penetration testing",
        "Employee background checks and access controls",
        "Incident response plans and breach notification procedures",
      ],
    },

    yourRights: {
      title: "Your Privacy Rights",
      subtitle: "You have control over your personal information and how it's used.",
      rights: [
        {
          title: "Access",
          description: "Request access to the personal information we hold about you.",
        },
        {
          title: "Correction",
          description: "Request correction of inaccurate or incomplete information.",
        },
        {
          title: "Deletion",
          description: "Request deletion of your personal information, subject to legal requirements.",
        },
        {
          title: "Portability",
          description: "Request transfer of your data to another service provider.",
        },
        {
          title: "Opt-out",
          description: "Opt out of marketing communications and certain data processing.",
        },
      ],
    },

    cookies: {
      title: "Cookies and Tracking Technologies",
      subtitle: "We use cookies and similar technologies to improve your experience.",
      types: [
        {
          title: "Essential Cookies",
          description: "Required for basic app functionality, login, and security features.",
        },
        {
          title: "Performance Cookies",
          description: "Help us understand how you use our services to improve performance.",
        },
        {
          title: "Functional Cookies",
          description: "Remember your preferences and settings for a personalized experience.",
        },
        {
          title: "Marketing Cookies",
          description: "Used to deliver relevant advertisements and measure campaign effectiveness.",
        },
      ],
    },

    children: {
      title: "Children's Privacy",
      subtitle: "Our services are not intended for children under 18.",
      content: "Go Journy is not directed to children under 18 years of age. We do not knowingly collect personal information from children under 18. If we become aware that we have collected personal information from a child under 18, we will take steps to delete such information.",
    },

    updates: {
      title: "Changes to This Privacy Policy",
      subtitle: "We may update this policy to reflect changes in our practices or laws.",
      content: "We will notify you of material changes by email or through our app. Your continued use of our services after the effective date constitutes acceptance of the updated policy.",
    },

    contact: {
      title: "Contact Us",
      subtitle: "Have questions about this privacy policy or our practices?",
      methods: [
        {
          type: "Email",
          value: "privacy@gojourny.com",
          description: "For privacy-related inquiries",
        },
        {
          type: "Phone",
          value: "+88 01855-629170",
          description: "24/7 support hotline",
        },
        {
          type: "Mail",
          value: "Go Journy Privacy Team\nDhaka, Bangladesh",
          description: "Physical address for legal notices",
        },
      ],
    },
  },
};