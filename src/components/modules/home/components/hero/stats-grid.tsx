import { Users, Car, MapPin, Star } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { animationClasses } from "@/lib/animations";
import { STATISTICS } from "@/constants/content-constant";

interface StatItem {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: string;
  delay: string;
}

interface StatsGridProps {
  className?: string;
}

export function StatsGrid({ className = "" }: StatsGridProps) {
  const statsAnimation = useScrollAnimation<HTMLUListElement>({
    animationType: "slideUp",
    duration: 700,
    threshold: 0.2,
  });

  const stats: StatItem[] = [
    {
      icon: (
        <Users className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-chart-1 group-hover:scale-110 transition-transform duration-300" />
      ),
      value: STATISTICS.users,
      label: "Active Users",
      color: "text-chart-1",
      delay: animationClasses.delay75,
    },
    {
      icon: (
        <Car className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-chart-2 group-hover:scale-110 transition-transform duration-300" />
      ),
      value: STATISTICS.drivers,
      label: "Drivers",
      color: "text-chart-2",
      delay: animationClasses.delay100,
    },
    {
      icon: (
        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-chart-3 group-hover:scale-110 transition-transform duration-300" />
      ),
      value: STATISTICS.cities,
      label: "Cities",
      color: "text-chart-3",
      delay: animationClasses.delay150,
    },
    {
      icon: (
        <Star className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-chart-4 group-hover:scale-110 transition-transform duration-300" />
      ),
      value: STATISTICS.rating,
      label: "Rating",
      color: "text-chart-4",
      delay: animationClasses.delay200,
    },
  ];

  return (
    <ul
      ref={statsAnimation.ref}
      className={`grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2 sm:gap-3 md:gap-4 lg:gap-6 mb-6 sm:mb-8 md:mb-10 lg:mb-12 max-w-4xl mx-auto px-2 sm:px-0 transition-all duration-700 ${
        statsAnimation.isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8"
      } ${className}`}
      aria-label="Platform statistics"
    >
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`group flex flex-col items-center gap-1 sm:gap-1.5 md:gap-2 p-2.5 sm:p-3 md:p-4 bg-card/60 backdrop-blur-md rounded-lg sm:rounded-xl border border-border/60 shadow-lg hover:shadow-xl min-h-[80px] sm:min-h-[100px] md:min-h-[120px] transition-all duration-300 hover:scale-105 hover:bg-card/70 ${stat.delay}`}
          role="listitem"
        >
          {stat.icon}
          <span
            className={`text-lg sm:text-xl md:text-2xl font-bold text-foreground group-hover:${stat.color} transition-colors duration-300`}
          >
            {stat.value}
          </span>
          <span className="text-xs sm:text-sm text-muted-foreground text-center leading-tight">
            {stat.label}
          </span>
        </div>
      ))}
    </ul>
  );
}
