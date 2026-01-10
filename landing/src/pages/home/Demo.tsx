import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export default function Demo() {
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

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <section className="py-20 relative overflow-hidden bg-background">
      <div className="container mx-auto px-4">
        <div
          ref={containerRef}
          className={cn(
            "transition-all duration-1000 ease-out transform will-change-transform",
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-12"
          )}
        >
          <div className="relative mx-auto max-w-6xl rounded-xl border border-border bg-background shadow-2xl overflow-hidden ring-1 ring-black/5 dark:ring-white/10">
            <div className="absolute top-0 flex w-full items-center gap-2 bg-muted/30 px-4 py-3 border-b border-border">
              <div className="h-3 w-3 rounded-full bg-red-500/80" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
              <div className="h-3 w-3 rounded-full bg-green-500/80" />
              <div className="ml-4 flex-1 max-w-lg">
                <div className="h-6 w-full rounded-md bg-background border border-border/50 text-[10px] flex items-center px-2 text-muted-foreground">
                  outreach.so/dashboard
                </div>
              </div>
            </div>

            <div className="aspect-[16/10] w-full bg-background flex items-center justify-center p-1 pt-12">
              {/* Placeholder for actual demo content/image/video */}
              <div className="w-full h-full bg-muted/10 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-muted rounded-2xl mx-auto mb-4 animate-pulse" />
                  <p className="text-muted-foreground font-medium">Dashboard Preview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
