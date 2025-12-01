import { pricingPlans } from "@/data/landing-data";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Pricing() {
  return (
    <section id="pricing" className="py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">Simple, transparent pricing</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
            Choose the plan that fits your career goals. No hidden fees.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={cn(
                "flex flex-col p-8 rounded-2xl border transition-all duration-300",
                plan.popular
                  ? "bg-foreground text-background border-foreground shadow-2xl scale-105 z-10"
                  : "bg-background border-border hover:border-foreground/20"
              )}
            >
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <p className={cn("text-sm", plan.popular ? "text-zinc-400" : "text-muted-foreground")}>
                  {plan.description}
                </p>
              </div>

              <div className="mb-8">
                <span className="text-5xl font-bold tracking-tight">{plan.price}</span>
                {plan.price !== "Custom" && (
                  <span className={cn("text-sm ml-2", plan.popular ? "text-zinc-400" : "text-muted-foreground")}>
                    /month
                  </span>
                )}
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check className={cn("w-4 h-4", plan.popular ? "text-background" : "text-foreground")} />
                    <span className="text-sm font-medium">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={cn(
                  "w-full h-12 rounded-lg font-semibold text-base",
                  plan.popular
                    ? "bg-background text-foreground hover:bg-background/90"
                    : "bg-foreground text-background hover:bg-foreground/90"
                )}
                variant={plan.popular ? "secondary" : "default"}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
