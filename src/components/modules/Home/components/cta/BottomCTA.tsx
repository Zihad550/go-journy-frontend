import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

export function BottomCTA() {
  return (
    <div className="text-center">
      <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 sm:p-10 shadow-xl">
        <h3 className="text-xl sm:text-2xl font-bold mb-4 text-foreground">
          Already part of the Go Journy family?
        </h3>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Sign in to access your dashboard, track your rides, manage your
          earnings, and more.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto px-8 py-4 text-lg font-semibold border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 min-h-[56px] hover:scale-105"
            asChild
          >
            <Link to="/login">
              Sign In to Dashboard
              <ArrowRight className="ml-2 w-5 h-5" aria-hidden="true" />
            </Link>
          </Button>

          <div className="text-sm text-muted-foreground">or</div>

          <Button
            variant="ghost"
            size="lg"
            className="w-full sm:w-auto px-8 py-4 text-lg font-semibold hover:bg-muted transition-all duration-300 min-h-[56px]"
            asChild
          >
            <Link to="/contact">Need Help? Contact Us</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}