import Logo from "@/assets/icons/Logo";
import { useUserInfoQuery } from "@/redux/features/user/user.api";
import { Link } from "react-router";

// TypeScript interfaces for footer link structure
interface FooterLink {
  label: string;
  to?: string; // For internal React Router links
  href?: string; // For external links
  external?: boolean;
}

interface SocialLink {
  name: string;
  href: string;
  ariaLabel: string;
  icon: React.ReactElement;
}

// Organized link arrays for existing pages only
const companyLinks: FooterLink[] = [
  { label: "About Us", to: "/about" },
  { label: "Features", to: "/features" },
  { label: "Contact", to: "/contact" },
];

// This will be moved inside the component to handle authentication

const supportLinks: FooterLink[] = [{ label: "FAQs", to: "/faq" }];

// Social media links with proper accessibility labels
const socialMediaLinks: SocialLink[] = [
  {
    name: "GitHub",
    href: "https://github.com/Zihad550",
    ariaLabel: "Visit GitHub profile",
    icon: (
      <svg
        className="size-5"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/jehad-hossain",
    ariaLabel: "Visit LinkedIn profile",
    icon: (
      <svg
        className="size-5"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    name: "Portfolio",
    href: "https://jehad-hossain.netlify.app",
    ariaLabel: "Visit personal portfolio",
    icon: (
      <svg
        className="size-5"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M4.5 3A1.5 1.5 0 003 4.5v15A1.5 1.5 0 004.5 21h15a1.5 1.5 0 001.5-1.5v-15A1.5 1.5 0 0019.5 3h-15zM12 8a4 4 0 100 8 4 4 0 000-8zm-2 4a2 2 0 114 0 2 2 0 01-4 0z"
          clipRule="evenodd"
        />
        <path d="M18.5 5.5a1 1 0 11-2 0 1 1 0 012 0z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const { data: userData } = useUserInfoQuery(undefined);
  const isAuthenticated = !!userData?.data;

  // Dynamic links based on authentication status
  const getStartedLinks: FooterLink[] = [
    { label: "Sign Up", to: "/register" },
    { label: "Sign In", to: "/login" },
    {
      label: "Become a Driver",
      to: isAuthenticated ? "/driver-registration" : "/login",
    },
  ];
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto container space-y-8 px-4 py-12 lg:py-16 lg:space-y-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Company Information */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Logo />
            </div>

            <p className="max-w-xs text-muted-foreground mb-6">
              Safe, reliable, and affordable ride-sharing that connects
              communities while empowering drivers to earn a sustainable income.
            </p>

            {/* Social Media Links */}
            <div>
              <h4 className="font-medium text-foreground mb-4">Follow Us</h4>
              <ul className="flex gap-4">
                {socialMediaLinks.map((social) => (
                  <li key={social.name}>
                    <a
                      href={social.href}
                      rel="noreferrer"
                      target="_blank"
                      className="text-muted-foreground hover:text-primary transition-colors"
                      aria-label={social.ariaLabel}
                    >
                      {social.icon}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-3">
            {/* Company */}
            <div>
              <h4 className="font-medium text-foreground mb-4">Company</h4>
              <ul className="space-y-3 text-sm">
                {companyLinks.map((link) => (
                  <li key={link.label}>
                    {link.to ? (
                      <Link
                        to={link.to}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-muted-foreground hover:text-primary transition-colors"
                        {...(link.external && {
                          rel: "noreferrer",
                          target: "_blank",
                        })}
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Get Started */}
            <div>
              <h4 className="font-medium text-foreground mb-4">Get Started</h4>
              <ul className="space-y-3 text-sm">
                {getStartedLinks.map((link) => (
                  <li key={link.label}>
                    {link.to ? (
                      <Link
                        to={link.to}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-muted-foreground hover:text-primary transition-colors"
                        {...(link.external && {
                          rel: "noreferrer",
                          target: "_blank",
                        })}
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-medium text-foreground mb-4">Support</h4>
              <ul className="space-y-3 text-sm">
                {supportLinks.map((link) => (
                  <li key={link.label}>
                    {link.to ? (
                      <Link
                        to={link.to}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-muted-foreground hover:text-primary transition-colors"
                        {...(link.external && {
                          rel: "noreferrer",
                          target: "_blank",
                        })}
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-4">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Go Journy. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
