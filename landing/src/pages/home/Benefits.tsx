import { benefits } from "@/data/landing-data";
import { Check } from "lucide-react";

export default function Benefits() {
  return (
    <section className="py-32 bg-muted/30 border-y border-border">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-20 items-center max-w-6xl mx-auto">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-8">
              Why choose our platform?
            </h2>
            <p className="text-xl text-muted-foreground mb-10 font-light leading-relaxed">
              We provide the tools and network you need to bypass the resume black hole and get your application in front of real people.
            </p>

            <ul className="space-y-6">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-4">
                  <div className="mt-1 h-5 w-5 rounded-full bg-foreground text-background flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3" />
                  </div>
                  <span className="text-lg font-medium">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="bg-background border border-border rounded-2xl p-8 shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 border border-border rounded-xl bg-muted/20">
                  <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600 font-bold text-sm">
                    JD
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">John Doe</h4>
                    <p className="text-xs text-muted-foreground">Software Engineer at Google</p>
                  </div>
                  <div className="ml-auto text-[10px] font-medium bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    Referred
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 border border-border rounded-xl bg-muted/20 opacity-60">
                  <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600 font-bold text-sm">
                    JS
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Jane Smith</h4>
                    <p className="text-xs text-muted-foreground">Product Manager at Meta</p>
                  </div>
                  <div className="ml-auto text-[10px] font-medium bg-zinc-100 text-zinc-700 px-2 py-1 rounded-full">
                    Pending
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 border border-border rounded-xl bg-muted/20 opacity-40">
                  <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600 font-bold text-sm">
                    MK
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Mike Kim</h4>
                    <p className="text-xs text-muted-foreground">Designer at Airbnb</p>
                  </div>
                  <div className="ml-auto text-[10px] font-medium bg-zinc-100 text-zinc-700 px-2 py-1 rounded-full">
                    Interview
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
