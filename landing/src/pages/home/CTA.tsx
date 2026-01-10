import { Button } from "@/components/ui/button";

export default function CTA() {
  return (
    <section className="py-32 border-t border-border bg-background">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8 max-w-4xl mx-auto">
          Ready to accelerate your career?
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 font-light">
          Join thousands of professionals who have already landed their dream jobs using our platform.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="h-14 px-10 text-lg rounded-full bg-foreground text-background hover:bg-foreground/90 font-medium" asChild>
            <a href="/signup">Get Started Now</a>
          </Button>
          <Button size="lg" variant="outline" className="h-14 px-10 text-lg rounded-full border-border hover:bg-muted/50 font-medium" asChild>
            <a href="https://cal.com/sahil-gupta-7/15min?overlayCalendar=true" target="_blank">Contact Sales</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
