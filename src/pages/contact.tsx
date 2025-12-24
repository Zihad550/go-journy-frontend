import ContactCard from "@/components/contact/contact-card";
import ContactForm from "@/components/contact/contact-form";
import QuickActionsSection from "@/components/contact/quick-actions-section";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GradientBackground } from "@/components/ui/gradient-background";
import { contactQuickActions } from "@/constants";
import { Clock, Headphones, Mail, MapPin, Phone, Search } from "lucide-react";
import { useMemo } from "react";

// Contact channel configurations
const contactChannels = [
  {
    id: "phone",
    title: "Phone Support",
    description:
      "Call us directly for immediate assistance with your inquiries",
    icon: <Phone className="h-6 w-6" />,
    contactInfo: "+88 01855-629170",
    href: "tel:+8801855629170",
    buttonText: "Call Now",
    available: true,
    responseTime: "Immediate",
    badge: "24/7",
  },
  {
    id: "email",
    title: "Email Support",
    description: "Send us a detailed message and we'll respond within 24 hours",
    icon: <Mail className="h-6 w-6" />,
    contactInfo: "jehadhossain008@gmail.com",
    href: "mailto:jehadhossain008@gmail.com",
    buttonText: "Send Email",
    available: true,
    responseTime: "< 24 hours",
    isExternal: true,
  },
];

const supportFeatures = [
  {
    icon: <Clock className="h-5 w-5 text-chart-1" />,
    title: "24/7 Emergency Support",
    description: "Round-the-clock assistance for urgent safety concerns",
  },
  {
    icon: <Headphones className="h-5 w-5 text-chart-2" />,
    title: "Multi-Language Support",
    description: "Support available in Bengali, English, and Hindi",
  },
  {
    icon: <MapPin className="h-5 w-5 text-chart-3" />,
    title: "Local Support Centers",
    description: "Physical locations across major cities in Bangladesh",
  },
  {
    icon: <Search className="h-5 w-5 text-chart-4" />,
    title: "Advanced Ticket Tracking",
    description: "Real-time status updates for all your inquiries",
  },
];

const Contact = () => {
  // Memoize expensive computations
  const availableChannels = useMemo(
    () => contactChannels.filter((channel) => channel.available),
    [],
  );

  return (
    <div className="min-h-screen relative">
      <GradientBackground>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          {/* Hero Section */}
          <div className="text-center mb-12 lg:mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary via-chart-1 to-chart-2 bg-clip-text text-transparent">
                Get in Touch
              </span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Choose from multiple ways to reach us. Our dedicated support team
              is here to help you with rides, driver inquiries, technical
              issues, and everything in between.
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-6 mt-8">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-muted-foreground">
                  Support Available
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  Average Response: 2 hours
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  99.9% Customer Satisfaction
                </Badge>
              </div>
            </div>
          </div>

          {/* Contact Methods Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
            {availableChannels.map((channel) => (
              <ContactCard
                key={channel.id}
                title={channel.title}
                description={channel.description}
                icon={channel.icon}
                contactInfo={channel.contactInfo}
                href={channel.href}
                isExternal={channel.isExternal}
                available={channel.available}
                responseTime={channel.responseTime}
                badge={channel.badge}
                buttonText={channel.buttonText}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Contact Form */}
            <div className="space-y-6">
              <ContactForm />
            </div>
            {/* Support Information */}
            <div className="space-y-6">
              {/* Business Hours */}
              <Card className="backdrop-blur-sm bg-background/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-chart-1" />
                    Business Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Monday - Friday
                      </span>
                      <span className="font-medium">9:00 AM - 6:00 PM BST</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Saturday</span>
                      <span className="font-medium">
                        10:00 AM - 4:00 PM BST
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sunday</span>
                      <span className="font-medium">Closed</span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-chart-1/10 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong>Emergency Support:</strong> Available 24/7 for
                      urgent safety concerns. Use the emergency hotline above
                      for immediate assistance.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Support Features */}
              <Card className="backdrop-blur-sm bg-background/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Headphones className="h-5 w-5 text-chart-2" />
                    Why Choose Our Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {supportFeatures.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          {feature.icon}
                        </div>
                        <div>
                          <h4 className="font-medium">{feature.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <QuickActionsSection quickActions={contactQuickActions} />
            </div>
          </div>
        </div>
      </GradientBackground>
    </div>
  );
};

export default Contact;
