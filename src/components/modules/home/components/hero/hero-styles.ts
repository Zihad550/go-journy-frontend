// Style constants for HeroSection components

export const heroContainerStyles = {
  base: "px-4 sm:px-6 lg:px-8 relative overflow-hidden",
  gradient: "bg-gradient-to-br from-background via-background to-muted/20",
};

export const badgeStyles = {
  base: "px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 text-xs sm:text-sm font-medium bg-card/50 backdrop-blur-sm border border-primary/20 shadow-lg transition-all duration-300",
  responsive: "mb-3 sm:mb-4 md:mb-6",
};

export const titleStyles = {
  base: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold mb-3 sm:mb-4 md:mb-6 leading-tight transition-all duration-800",
  gradient: "bg-gradient-to-r from-foreground via-foreground to-foreground bg-clip-text text-transparent",
  span: "bg-gradient-to-r from-primary via-chart-1 to-chart-2 bg-clip-text text-transparent animate-gradient-x",
};

export const subtitleStyles = {
  base: "text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-3 sm:mb-4 md:mb-6 leading-relaxed",
  container: "mb-4 sm:mb-6 md:mb-8 max-w-4xl mx-auto px-2 sm:px-4 md:px-0 transition-all duration-600",
  driverMessage: "bg-gradient-to-r from-chart-2/10 via-chart-1/5 to-chart-2/10 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-chart-2/30 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]",
  driverText: "text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed",
  driverHighlight: "text-chart-2 font-bold text-base sm:text-lg md:text-xl inline-flex items-center gap-1.5 sm:gap-2",
  earnings: "text-foreground font-semibold bg-gradient-to-r from-chart-1 to-chart-2 bg-clip-text text-transparent",
};

export const ctaButtonStyles = {
  primary: "group w-full sm:w-auto px-5 sm:px-6 md:px-8 py-3.5 sm:py-4 md:py-6 text-sm sm:text-base md:text-lg font-semibold shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 min-h-[44px] sm:min-h-[48px] md:min-h-[56px] bg-gradient-to-r from-primary to-chart-1 hover:from-chart-1 hover:to-primary relative overflow-hidden touch-manipulation",
  secondary: "group w-full sm:w-auto px-5 sm:px-6 md:px-8 py-3.5 sm:py-4 md:py-6 text-sm sm:text-base md:text-lg font-semibold border-2 border-primary/50 backdrop-blur-sm bg-card/30 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 min-h-[44px] sm:min-h-[48px] md:min-h-[56px] hover:shadow-lg hover:-translate-y-1 relative overflow-hidden touch-manipulation",
  container: "flex flex-col gap-2.5 sm:gap-3 md:gap-4 justify-center items-center max-w-md sm:max-w-none mx-auto",
  wrapper: "space-y-3 sm:space-y-4 md:space-y-6 px-2 sm:px-0 transition-all duration-500",
};

export const floatingElementStyles = {
  circle: {
    primary: "absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-pulse",
    secondary: "absolute top-40 right-20 w-24 h-24 bg-chart-1/15 rounded-full blur-lg animate-bounce",
    tertiary: "absolute bottom-32 left-1/4 w-20 h-20 bg-chart-2/10 rounded-full blur-md animate-pulse",
    quaternary: "absolute bottom-20 right-1/3 w-28 h-28 bg-chart-3/12 rounded-full blur-lg animate-bounce",
  },
  icon: {
    sparkles: "absolute top-32 right-32 opacity-20 animate-float",
    zap: "absolute bottom-40 left-20 opacity-15 animate-float",
    star: "absolute top-1/2 right-16 opacity-10 animate-float",
  },
  grid: "absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]",
};

export const statCardStyles = {
  base: "group flex flex-col items-center gap-1 sm:gap-1.5 md:gap-2 p-2.5 sm:p-3 md:p-4 bg-card/60 backdrop-blur-md rounded-lg sm:rounded-xl border border-border/60 shadow-lg hover:shadow-xl min-h-[80px] sm:min-h-[100px] md:min-h-[120px] transition-all duration-300 hover:scale-105 hover:bg-card/70",
  icon: "w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform duration-300",
  value: "text-lg sm:text-xl md:text-2xl font-bold text-foreground group-hover:text-chart-1 transition-colors duration-300",
  label: "text-xs sm:text-sm text-muted-foreground text-center leading-tight",
};