import { howItWorksSteps } from "@/data/landing-data";


export default function HowItWorks() {
    return (
        <section className="py-32 bg-background border-t border-border">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-20 max-w-3xl">
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">
                            How it works
                        </h2>
                        <p className="text-xl text-muted-foreground font-light leading-relaxed">
                            Get referred in three simple steps. We've streamlined the process to help you connect with the right people.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {howItWorksSteps.map((step, index) => (
                            <div
                                key={index}
                                className="group relative flex flex-col p-8 rounded-2xl border border-border bg-background hover:border-foreground/20 transition-all duration-300"
                            >
                                <div className="absolute top-8 right-8 text-6xl font-bold text-foreground/5 select-none pointer-events-none group-hover:text-foreground/10 transition-colors">
                                    0{index + 1}
                                </div>

                                <div className="mb-8 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-muted/30 text-foreground group-hover:scale-110 transition-transform duration-300">
                                    <step.icon className="w-6 h-6" />
                                </div>

                                <h3 className="text-2xl font-bold tracking-tight mb-4">{step.title}</h3>
                                <p className="text-muted-foreground leading-relaxed text-lg font-light">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
