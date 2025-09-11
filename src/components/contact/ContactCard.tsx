import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, ExternalLink } from "lucide-react";
import { useState } from "react";

interface ContactCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  contactInfo: string;
  href: string;
  isExternal?: boolean;
  available?: boolean;
  responseTime?: string;
  badge?: string;
  buttonText: string;
}

const ContactCard = ({
  title,
  description,
  icon,
  contactInfo,
  href,
  isExternal = false,
  available = true,
  responseTime,
  badge,
  buttonText,
}: ContactCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (isExternal) {
      window.open(href, "_blank", "noopener,noreferrer");
    } else {
      window.location.href = href;
    }
  };

  return (
    <Card
      className={`group relative overflow-hidden transition-all duration-300 hover:shadow-lg border ${
        available
          ? "border-border hover:border-primary/30"
          : "border-muted bg-muted/50"
      } ${isHovered ? "transform hover:scale-[1.02] hover:-translate-y-1" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hover Effect Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-chart-1/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <CardHeader className="pb-3 relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`relative p-3 rounded-full transition-all duration-300 ${
                available
                  ? "bg-primary/10 text-primary group-hover:bg-primary/20"
                  : "bg-muted-foreground/10 text-muted-foreground"
              }`}
            >
              {icon}
              {/* Availability Indicator */}
              {available && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
              )}
            </div>
            <div>
              <CardTitle
                className={`text-lg flex items-center gap-2 ${
                  available ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {title}
                {isExternal && (
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                )}
              </CardTitle>
              {badge && (
                <Badge variant="secondary" className="mt-1 text-xs">
                  {badge}
                </Badge>
              )}
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex flex-col items-end gap-1">
            {available ? (
              <Badge
                variant="default"
                className="bg-green-100 text-green-700 hover:bg-green-100"
              >
                Online
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                Offline
              </Badge>
            )}
            {responseTime && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {responseTime}
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 relative z-10">
        <p
          className={`text-sm mb-4 ${
            available ? "text-muted-foreground" : "text-muted-foreground/70"
          }`}
        >
          {description}
        </p>

        <div className="space-y-3">
          {/* Contact Information */}
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div>
              <div className="text-sm font-medium text-foreground">
                {contactInfo}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <Button
            className={`w-full transition-all duration-300 ${
              available ? "hover:shadow-md" : "opacity-60 cursor-not-allowed"
            }`}
            disabled={!available}
            onClick={handleClick}
            size="sm"
          >
            {buttonText}
            {isExternal && <ExternalLink className="ml-2 h-4 w-4" />}
          </Button>

          {/* Additional Info for Unavailable Channels */}
          {!available && (
            <p className="text-xs text-muted-foreground text-center">
              This channel is currently unavailable. Please try another contact
              method.
            </p>
          )}
        </div>
      </CardContent>

      {/* Animated Border Effect */}
      <div className="absolute inset-0 border border-primary/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </Card>
  );
};

export default ContactCard;
