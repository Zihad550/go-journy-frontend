import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { GradientBackground } from "../../ui/gradient-background";

interface CTASectionProps {
  isRider: boolean;
}

export function CTASection({ isRider }: CTASectionProps) {
  if (isRider) return null;

  return (
    <GradientBackground className="py-20 px-4">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-3xl p-12 shadow-xl">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Join our platform today and experience the future of transportation
            with Go Journy. Safe, reliable, and convenient rides await you.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
              asChild
            >
              <a href="/register">
                Register Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-6 text-lg font-semibold border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-200"
              asChild
            >
              <a href="/login">Sign In</a>
            </Button>
          </div>
        </div>
      </div>
    </GradientBackground>
  );
}
