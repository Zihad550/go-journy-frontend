import { Sparkles, Zap, Star } from 'lucide-react';

export function FloatingElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating decorative circles */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
      <div
        className="absolute top-40 right-20 w-24 h-24 bg-chart-1/15 rounded-full blur-lg animate-bounce"
        style={{ animationDelay: '1s', animationDuration: '3s' }}
      ></div>
      <div
        className="absolute bottom-32 left-1/4 w-20 h-20 bg-chart-2/10 rounded-full blur-md animate-pulse"
        style={{ animationDelay: '2s' }}
      ></div>
      <div
        className="absolute bottom-20 right-1/3 w-28 h-28 bg-chart-3/12 rounded-full blur-lg animate-bounce"
        style={{ animationDelay: '0.5s', animationDuration: '4s' }}
      ></div>

      {/* Floating icons */}
      <div className="absolute top-32 right-32 opacity-20 animate-float">
        <Sparkles className="w-8 h-8 text-primary" />
      </div>
      <div
        className="absolute bottom-40 left-20 opacity-15 animate-float"
        style={{ animationDelay: '1.5s' }}
      >
        <Zap className="w-6 h-6 text-chart-1" />
      </div>
      <div
        className="absolute top-1/2 right-16 opacity-10 animate-float"
        style={{ animationDelay: '3s' }}
      >
        <Star className="w-7 h-7 text-chart-2" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>
    </div>
  );
}