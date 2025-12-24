import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GradientBackground } from "@/components/ui/gradient-background";
import { SectionWrapper } from "@/components/layout/section-wrapper";
import { PRIVACY_POLICY } from "@/constants";
import {
  Calendar,
  Eye,
  Lock,
  Mail,
  Phone,
  Shield,
  Users,
  Cookie,
  UserCheck,
  RefreshCw,
  MapPin
} from "lucide-react";

const Privacy = () => {

  return (
    <div className="min-h-screen relative">
      <GradientBackground>
        <SectionWrapper spacing="normal">
          {/* Hero Section */}
          <div className="text-center mb-12 lg:mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary via-chart-1 to-chart-2 bg-clip-text text-transparent">
                {PRIVACY_POLICY.title}
              </span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              {PRIVACY_POLICY.subtitle}
            </p>

            {/* Last Updated */}
            <div className="flex flex-wrap justify-center gap-6 mt-8">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-chart-1" />
                <span className="text-sm text-muted-foreground">
                  Last updated: {PRIVACY_POLICY.lastUpdated}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  Effective: {PRIVACY_POLICY.effectiveDate}
                </Badge>
              </div>
            </div>
          </div>

          {/* Table of Contents */}
          <div className="mb-16">
            <Card className="backdrop-blur-sm bg-background/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-chart-1" />
                  Table of Contents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {PRIVACY_POLICY.tableOfContents.map((item, index) => (
                    <a
                      key={index}
                      href={`#${item.id}`}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-border/50 hover:border-primary/20"
                    >
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Sections */}
          <div className="space-y-12">
            {/* Information We Collect */}
            <Card id="information-we-collect" className="backdrop-blur-sm bg-background/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Eye className="h-6 w-6 text-chart-1" />
                  {PRIVACY_POLICY.sections.informationWeCollect.title}
                </CardTitle>
                <p className="text-muted-foreground">{PRIVACY_POLICY.sections.informationWeCollect.subtitle}</p>
              </CardHeader>
              <CardContent className="space-y-8">
                {PRIVACY_POLICY.sections.informationWeCollect.content.map((subsection, subIndex) => (
                  <div key={subIndex} className="space-y-4">
                    <h3 className="text-xl font-semibold">{subsection.title}</h3>
                    <ul className="space-y-2 ml-4">
                      {subsection.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-2 text-muted-foreground">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* How We Use */}
            <Card id="how-we-use" className="backdrop-blur-sm bg-background/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Users className="h-6 w-6 text-chart-1" />
                  {PRIVACY_POLICY.sections.howWeUse.title}
                </CardTitle>
                <p className="text-muted-foreground">{PRIVACY_POLICY.sections.howWeUse.subtitle}</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {PRIVACY_POLICY.sections.howWeUse.uses.map((use, useIndex) => (
                    <div
                      key={useIndex}
                      className="p-4 rounded-lg border border-border/50 hover:border-primary/20 transition-colors"
                    >
                      <h4 className="font-semibold mb-2">{use.title}</h4>
                      <p className="text-sm text-muted-foreground">{use.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Information Sharing */}
            <Card id="information-sharing" className="backdrop-blur-sm bg-background/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Shield className="h-6 w-6 text-chart-1" />
                  {PRIVACY_POLICY.sections.informationSharing.title}
                </CardTitle>
                <p className="text-muted-foreground">{PRIVACY_POLICY.sections.informationSharing.subtitle}</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {PRIVACY_POLICY.sections.informationSharing.sharing.map((share, shareIndex) => (
                    <div
                      key={shareIndex}
                      className="p-4 rounded-lg border border-border/50 hover:border-primary/20 transition-colors"
                    >
                      <h4 className="font-semibold mb-2">{share.title}</h4>
                      <p className="text-sm text-muted-foreground">{share.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Data Security */}
            <Card id="data-security" className="backdrop-blur-sm bg-background/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Lock className="h-6 w-6 text-chart-1" />
                  {PRIVACY_POLICY.sections.dataSecurity.title}
                </CardTitle>
                <p className="text-muted-foreground">{PRIVACY_POLICY.sections.dataSecurity.subtitle}</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {PRIVACY_POLICY.sections.dataSecurity.measures.map((measure, measureIndex) => (
                    <div
                      key={measureIndex}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <Shield className="h-5 w-5 text-chart-1 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{measure}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Your Rights */}
            <Card id="your-rights" className="backdrop-blur-sm bg-background/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <UserCheck className="h-6 w-6 text-chart-1" />
                  {PRIVACY_POLICY.sections.yourRights.title}
                </CardTitle>
                <p className="text-muted-foreground">{PRIVACY_POLICY.sections.yourRights.subtitle}</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {PRIVACY_POLICY.sections.yourRights.rights.map((right, rightIndex) => (
                    <div
                      key={rightIndex}
                      className="p-4 rounded-lg border border-border/50 hover:border-primary/20 transition-colors"
                    >
                      <h4 className="font-semibold mb-2">{right.title}</h4>
                      <p className="text-sm text-muted-foreground">{right.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Cookies */}
            <Card id="cookies" className="backdrop-blur-sm bg-background/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Cookie className="h-6 w-6 text-chart-1" />
                  {PRIVACY_POLICY.sections.cookies.title}
                </CardTitle>
                <p className="text-muted-foreground">{PRIVACY_POLICY.sections.cookies.subtitle}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {PRIVACY_POLICY.sections.cookies.types.map((type, typeIndex) => (
                  <div key={typeIndex} className="space-y-2">
                    <h4 className="font-semibold">{type.title}</h4>
                    <p className="text-sm text-muted-foreground">{type.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Children's Privacy */}
            <Card id="children" className="backdrop-blur-sm bg-background/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-chart-1" />
                  {PRIVACY_POLICY.sections.children.title}
                </CardTitle>
                <p className="text-muted-foreground">{PRIVACY_POLICY.sections.children.subtitle}</p>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{PRIVACY_POLICY.sections.children.content}</p>
              </CardContent>
            </Card>

            {/* Updates */}
            <Card id="updates" className="backdrop-blur-sm bg-background/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-chart-1" />
                  {PRIVACY_POLICY.sections.updates.title}
                </CardTitle>
                <p className="text-muted-foreground">{PRIVACY_POLICY.sections.updates.subtitle}</p>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{PRIVACY_POLICY.sections.updates.content}</p>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card id="contact" className="backdrop-blur-sm bg-background/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Mail className="h-6 w-6 text-chart-1" />
                  {PRIVACY_POLICY.sections.contact.title}
                </CardTitle>
                <p className="text-muted-foreground">{PRIVACY_POLICY.sections.contact.subtitle}</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {PRIVACY_POLICY.sections.contact.methods.map((method, methodIndex) => (
                    <div
                      key={methodIndex}
                      className="flex flex-col items-center text-center p-6 rounded-lg border border-border/50 hover:border-primary/20 transition-colors"
                    >
                      {method.type === 'Email' && <Mail className="h-8 w-8 text-chart-1 mb-3" />}
                      {method.type === 'Phone' && <Phone className="h-8 w-8 text-chart-2 mb-3" />}
                      {method.type === 'Mail' && <MapPin className="h-8 w-8 text-chart-3 mb-3" />}
                      <h4 className="font-semibold mb-1">{method.type}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{method.description}</p>
                      <p className="text-sm font-medium">{method.value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </SectionWrapper>
      </GradientBackground>
    </div>
  );
};

export default Privacy;