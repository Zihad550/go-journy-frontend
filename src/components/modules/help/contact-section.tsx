import ContactCard from "@/components/contact/contact-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionWrapper } from "@/components/layout/section-wrapper";
import { Headphones, Clock, Mail, Phone } from "lucide-react";

const contactChannels = [
  {
    id: "phone",
    title: "Phone Support",
    description: "Call us directly for immediate assistance",
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
    icon: <Headphones className="h-5 w-5 text-chart-2" />,
    title: "Multi-Language Support",
    description: "Support available in Bengali, English, and Hindi",
  },
];

function ContactSection() {
  return (
    <SectionWrapper spacing="normal">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          <span className="bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
            Contact Support
          </span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Can't find what you're looking for? Our support team is here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
        {contactChannels.map((channel) => (
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                <span className="text-muted-foreground">Monday - Friday</span>
                <span className="font-medium">9:00 AM - 6:00 PM BST</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Saturday</span>
                <span className="font-medium">10:00 AM - 4:00 PM BST</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sunday</span>
                <span className="font-medium">Closed</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-chart-1/10 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Emergency Support:</strong> Available 24/7 for urgent safety concerns.
              </p>
            </div>
          </CardContent>
        </Card>

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
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </SectionWrapper>
  );
}

export default ContactSection;