import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import QuickActionCard, { type QuickActionCardProps } from "./quick-action-card";

interface QuickActionsSectionProps {
  quickActions: QuickActionCardProps[];
}

const QuickActionsSection = ({ quickActions }: QuickActionsSectionProps) => {
  return (
    <Card className="backdrop-blur-sm bg-background/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-chart-3" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {quickActions.map((qa) => (
            <QuickActionCard key={qa.id} {...qa} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActionsSection;

