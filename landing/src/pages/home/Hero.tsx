import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-background">
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="inline-flex items-center rounded-full border border-border px-3 py-1 text-sm font-medium text-muted-foreground bg-background mb-8 hover:bg-muted/50 transition-colors cursor-pointer">
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-current" />
            <span>New: AI-Powered Templates</span>
            <ArrowRight className="h-3 w-3 ml-1" />
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-foreground mb-8 max-w-5xl mx-auto leading-[1.1]">
          Get Referrals. <br />
          <span className="text-foreground/80">Land Your Dream Job.</span>
        </h1>

        <p className="mt-6 text-xl text-muted-foreground max-w-4xl mx-auto mb-10 leading-relaxed font-light">
          Generate AI-powered referral and follow-up messages tailored to the job description and company, while outreach tracking and follow-ups run automatically in one focused workflow.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-foreground text-background hover:bg-foreground/90 font-medium" asChild>
            <a href="/signup">Get Started</a>
          </Button>
          <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-border hover:bg-muted/50 font-medium" asChild>
            <a href="/login">Sign In</a>
          </Button>
        </div>
      </div>

      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] -z-10 opacity-30 dark:opacity-10" />
    </section>
  );
}
