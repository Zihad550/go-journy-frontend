import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GradientBackground } from "@/components/ui/gradient-background";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserInfoQuery } from "@/redux/features/user/user-api";
import { getFeaturesByCategory } from "@/constants/features-constant";
import {
  ArrowRight,
  Car,
  CheckCircle,
  Clock,
  MessageCircle,
  Rocket,
  Settings,
  Shield,
  Users,
} from "lucide-react";
import { Link } from "react-router";


const tabConfig = {
  riders: {
    title: "Rider Experience",
    subtitle:
      "Book rides effortlessly with interactive maps, driver selection, and real-time tracking.",
    icon: Users,
    color: "primary",
    gradient: "from-primary to-chart-1",
  },
  drivers: {
    title: "Driver Tools",
    subtitle:
      "Complete driver platform with registration, availability management, and ride selection.",
    icon: Car,
    color: "chart-2",
    gradient: "from-chart-2 to-chart-3",
  },
  platform: {
    title: "Platform Features",
    subtitle:
      "Modern architecture with responsive design, role-based access, and real-time updates.",
    icon: Settings,
    color: "chart-1",
    gradient: "from-chart-1 to-chart-2",
  },
  safety: {
    title: "Security & Safety",
    subtitle:
      "Secure authentication, driver verification, and comprehensive data protection.",
    icon: Shield,
    color: "chart-4",
    gradient: "from-chart-4 to-chart-3",
  },
};

const Features = () => {
  const { data: userData } = useUserInfoQuery(undefined);
  const isAuthenticated = !!userData?.data;
  
  // Get features from centralized constant
  const features = getFeaturesByCategory();

  return (
    <GradientBackground className="min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16">
          <Badge
            variant="secondary"
            className="mb-6 text-sm px-6 py-2 bg-gradient-to-r from-primary/20 to-chart-1/20 border-primary/30 backdrop-blur-sm"
          >
            <Rocket className="mr-2 h-4 w-4" />
            Platform Features
          </Badge>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
            What Makes
            <span className="bg-gradient-to-r from-primary via-chart-1 to-chart-2 bg-clip-text text-transparent block">
              Go Journy Special
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
            Discover the powerful features that make our ride-sharing platform
            reliable, secure, and user-friendly for both riders and drivers.
          </p>
        </div>

        {/* Platform Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-16">
          {[
            {
              value: "99.9%",
              label: "Uptime",
              icon: CheckCircle,
              description: "Always available",
            },
            {
              value: "<2s",
              label: "Response Time",
              icon: Clock,
              description: "Lightning fast",
            },
            {
              value: "100%",
              label: "Secure",
              icon: Shield,
              description: "Encrypted data",
            },
            {
              value: "24/7",
              label: "Support",
              icon: MessageCircle,
              description: "Always here",
            },
          ].map((stat, index) => (
            <Card
              key={index}
              className="group bg-card/30 backdrop-blur-md border-border/30 hover:bg-card/50 hover:border-primary/30 transition-all duration-300 hover:scale-105"
            >
              <CardContent className="p-4 text-center">
                <stat.icon className="h-6 w-6 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" />
                <div className="text-2xl font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-semibold text-foreground mb-1">
                  {stat.label}
                </div>
                <div className="text-xs text-muted-foreground">
                  {stat.description}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Tabs */}
        <Tabs defaultValue="riders" className="max-w-6xl mx-auto">
          <div className="flex justify-center mb-12">
            <TabsList className="grid w-full max-w-2xl grid-cols-2 lg:grid-cols-4 h-auto bg-card/20 backdrop-blur-xl border border-border/30 rounded-2xl p-2">
              {Object.entries(tabConfig).map(([key, config]) => (
                <TabsTrigger
                  key={key}
                  value={key}
                  className="flex items-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-chart-1 data-[state=active]:text-white data-[state=active]:shadow-lg"
                >
                  <config.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{config.title}</span>
                  <span className="sm:hidden capitalize">
                    {key === "platform" ? "Tech" : key.slice(0, 4)}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {Object.entries(tabConfig).map(([key, config]) => (
            <TabsContent key={key} value={key} className="space-y-8">
              {/* Tab Header */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-3 mb-6">
                  <div
                    className={`p-3 bg-gradient-to-br from-${config.color}/20 to-${config.color}/10 rounded-xl backdrop-blur-sm`}
                  >
                    <config.icon className={`h-8 w-8 text-${config.color}`} />
                  </div>
                  <h2
                    className={`text-3xl sm:text-4xl font-bold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}
                  >
                    {config.title}
                  </h2>
                </div>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  {config.subtitle}
                </p>
              </div>

              {/* Feature Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features[key as keyof typeof features].map((feature) => (
                  <Card
                    key={feature.id}
                    className="group bg-gradient-to-br from-card/60 to-card/30 backdrop-blur-xl border-border/40 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors duration-300">
                          <feature.icon className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg font-bold mb-2">
                            {feature.title}
                          </CardTitle>
                          <Badge
                            variant="secondary"
                            className="text-xs font-semibold bg-primary/10 text-primary"
                          >
                            {feature.benefit}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Tab CTA - Hidden when user is logged in */}
              {!isAuthenticated && (
                <div className="text-center mt-12">
                  <Card
                    className={`bg-gradient-to-br from-${config.color}/10 via-${config.color}/5 to-transparent border-${config.color}/30 max-w-2xl mx-auto backdrop-blur-xl`}
                  >
                    <CardContent className="p-8">
                      <config.icon
                        className={`h-12 w-12 text-${config.color} mx-auto mb-4`}
                      />
                      <h3
                        className={`text-2xl font-bold mb-4 bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}
                      >
                        {key === "riders" && "Start Your Journey"}
                        {key === "drivers" && "Join Our Drivers"}
                        {key === "platform" && "Experience the Platform"}
                        {key === "safety" && "Stay Protected"}
                      </h3>
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        {key === "riders" &&
                          "Ready to experience seamless ride booking? Join thousands of satisfied riders."}
                        {key === "drivers" &&
                          "Become a driver and take control of your earning potential with our comprehensive tools."}
                        {key === "platform" &&
                          "Discover how our modern platform delivers reliability and performance you can trust."}
                        {key === "safety" &&
                          "Your safety is our priority. Experience secure, verified transportation every time."}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                          asChild
                          className={`bg-gradient-to-r ${config.gradient} hover:opacity-90 shadow-lg`}
                        >
                          <Link
                            to={
                              key === "drivers"
                                ? isAuthenticated
                                  ? "/driver-registration"
                                  : "/login"
                                : "/register"
                            }
                          >
                            <Rocket className="mr-2 h-4 w-4" />
                            {key === "drivers"
                              ? "Become a Driver"
                              : "Get Started"}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="outline" asChild>
                          <Link to="/contact">
                            <MessageCircle className="mr-2 h-4 w-4" />
                            Learn More
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </GradientBackground>
  );
};

export default Features;
