import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
      }
    );

    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <section className="relative pt-24 pb-20 md:pt-36 md:pb-16 overflow-hidden bg-background">
      <div ref={containerRef} className="container mx-auto px-4 text-center relative z-10">
        {/* Badge - First element (0ms delay) */}
        <div
          className={cn(
            "transition-all duration-700 ease-out transform will-change-transform",
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-12"
          )}
        >
          <div className="inline-flex items-center rounded-full border border-border px-3 py-1 text-sm font-medium text-muted-foreground bg-background mb-8 hover:bg-muted/50 transition-colors cursor-pointer">
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-current" />
              <span>New: AI-Powered Templates</span>
              <ArrowRight className="h-3 w-3 ml-1" />
            </span>
          </div>
        </div>

        {/* Heading - Second element (100ms delay) */}
        <div
          className={cn(
            "transition-all duration-700 ease-out transform will-change-transform delay-100",
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-12"
          )}
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-foreground mb-5 max-w-5xl mx-auto leading-[1]">
            Get Referrals. <br />
            <span className="text-foreground/80">Land Your Dream Job.</span>
          </h1>
        </div>

        {/* Description - Third element (200ms delay) */}
        <div
          className={cn(
            "transition-all duration-700 ease-out transform will-change-transform delay-200",
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-12"
          )}
        >
          <p className="mt-2 text-xl text-muted-foreground max-w-4xl mx-auto mb-8 leading-relaxed font-light">
            Generate AI-powered referral and follow-up messages tailored to the job description and company, while outreach tracking and follow-ups run automatically in one focused workflow.
          </p>
        </div>

        {/* Buttons - Fourth element (300ms delay) */}
        <div
          className={cn(
            "transition-all duration-700 ease-out transform will-change-transform delay-300",
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-12"
          )}
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-foreground text-background hover:bg-foreground/90 font-medium" asChild>
              <a href={import.meta.env.VITE_APP_URL + "/signup"}>Get Started</a>
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-border hover:bg-muted/50 font-medium" asChild>
              <a href={import.meta.env.VITE_APP_URL + "/login"}>Sign In</a>
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] -z-10 opacity-30 dark:opacity-10" />
    </section>
  );
}
