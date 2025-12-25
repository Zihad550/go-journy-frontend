import { Card } from "@/components/ui/card";
import { GradientBackground } from "@/components/ui/gradient-background";
import { ABOUT_CONTENT } from "@/constants/content-constant";
import { usePublicStats } from "@/hooks/use-public-stats";
import type { IAchievement } from "@/types";

function AchievementsSection() {
  const { stats: publicStats } = usePublicStats();

  const achievements: IAchievement[] = ABOUT_CONTENT.achievements.map(
    (item, index) => {
      if (index === 0) {
        return {
          ...item,
          metric: publicStats?.rides
            ? `${(publicStats.rides / 1000).toFixed(0)}K+`
            : item.metric,
        };
      }
      if (index === 1) {
        return {
          ...item,
          metric: publicStats?.totalDriverEarnings
            ? `$${(publicStats.totalDriverEarnings / 1000000).toFixed(0)}M+`
            : item.metric,
        };
      }
      if (index === 3) {
        return {
          ...item,
          metric: publicStats?.drivers
            ? `${publicStats.drivers.toLocaleString()}+`
            : item.metric,
        };
      }
      return item;
    },
  );

  return (
    <GradientBackground className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Our Achievements
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Milestones that reflect our commitment to excellence and community
            impact.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {achievements.map((item: IAchievement, index: number) => {
            const Icon = item.icon;
            return (
              <Card
                key={index}
                className="p-8 text-center hover:shadow-lg transition-shadow"
              >
                <Icon className={`h-12 w-12 mx-auto mb-4 ${item.colorClass}`} />
                <div className="text-3xl font-bold mb-2">{item.metric}</div>
                <h3 className="font-semibold mb-2">{item.label}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </GradientBackground>
  );
}

export default AchievementsSection;
