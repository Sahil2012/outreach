import { features } from "@/data/landing-data";
import { cn } from "@/lib/utils";

export default function Features() {
  return (
    <section id="features" className="py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-20 max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">Everything you need to succeed</h2>
            <p className="text-xl text-muted-foreground font-light">
              Powerful features designed to help you manage your job search and get referrals faster.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border border-border bg-background p-8 hover:border-foreground/20 transition-colors duration-300",
                  index === 0 || index === 3 ? "md:col-span-2" : "md:col-span-1"
                )}
              >
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/5 text-primary group-hover:bg-primary/10 transition-colors">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3 tracking-tight">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
