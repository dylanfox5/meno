import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, PenLine, Heart, Sparkles, ArrowRight, Lock, Smartphone } from "lucide-react";
import { Logo } from "@/components/ui/logo";

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Logo />
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section — asymmetric split layout */}
      <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8 pt-16 pb-16 sm:pt-24 sm:pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left: headline + CTA */}
            <div className="lg:py-8">
              <p className="text-sm font-medium text-scripture tracking-widest uppercase mb-4">
                Scripture · Reflection · Prayer
              </p>
              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 leading-[1.05]">
                A quiet space for{" "}
                <span className="text-primary italic">reflection</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-10 max-w-md leading-relaxed">
                Journal your walk with Christ. Let Scripture speak into your
                life. Find joy in abiding.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <Button size="lg" asChild>
                  <Link href="/signup" className="gap-2">
                    Start journaling for free
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <p className="text-sm text-muted-foreground self-center">
                  No credit card · No setup · Just write
                </p>
              </div>
            </div>

            {/* Right: floating rotated journal card */}
            <div className="relative flex items-center justify-center lg:justify-end py-8 lg:py-0">
              {/* Rotation wrapper */}
              <div className="relative w-full max-w-sm lg:max-w-md" style={{ transform: "rotate(2deg)" }}>
                {/* Shadow page behind */}
                <div
                  className="absolute inset-0 rounded-2xl bg-parchment-border/50 border border-parchment-border"
                  style={{ transform: "rotate(-4deg) translate(-6px, 8px)" }}
                />
                {/* Main journal card */}
                <div
                  className="relative rounded-2xl border border-parchment-border bg-parchment shadow-2xl overflow-hidden"
                  style={{
                    backgroundImage: `repeating-linear-gradient(
                      transparent,
                      transparent calc(2rem - 1px),
                      oklch(0.88 0.02 80 / 0.45) calc(2rem - 1px),
                      oklch(0.88 0.02 80 / 0.45) 2rem
                    )`,
                    backgroundSize: "100% 2rem",
                    backgroundPositionY: "5rem",
                  }}
                >
                  {/* Card header */}
                  <div className="px-7 pt-7 pb-4 border-b border-parchment-border/60">
                    <p className="text-xs text-muted-foreground tracking-widest uppercase mb-1">
                      February 19, 2026
                    </p>
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-serif text-xl font-semibold text-foreground leading-snug">
                        Morning gratitude
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-scripture font-medium bg-scripture/10 px-2.5 py-1 rounded-full border border-scripture/20 shrink-0">
                        <BookOpen className="w-3 h-3" />
                        <span>Ps 46:10</span>
                      </div>
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="px-7 py-5" style={{ lineHeight: "2rem" }}>
                    <p className="font-serif text-sm text-foreground/85 italic leading-8">
                      Lord, this morning I'm wrestling with anxiety about the week ahead. But You remind me to{" "}
                      <span className="not-italic font-semibold text-foreground">"be still, and know that I am God."</span>
                    </p>
                    <p className="font-serif text-sm text-foreground/85 italic leading-8">
                      In the quiet before the day begins, I feel Your peace most clearly — like still water...
                    </p>
                    <p className="font-serif text-sm italic leading-8 text-foreground/35">
                      Continue writing...
                    </p>
                  </div>

                  {/* Card footer */}
                  <div className="px-7 py-4 border-t border-parchment-border/60 flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Tags:</span>
                    <span className="text-xs bg-muted/50 text-muted-foreground px-2 py-0.5 rounded-full">gratitude</span>
                    <span className="text-xs bg-muted/50 text-muted-foreground px-2 py-0.5 rounded-full">peace</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Everything you need, nothing you don't
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Christians have always read, meditated, and prayed. Meno is just
              a quiet place to do it.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <PenLine className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Daily journaling</h3>
              <p className="text-muted-foreground">
                A distraction-free space to pour out your heart before the
                Lord—your thoughts, prayers, struggles, and praises.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Scripture connection</h3>
              <p className="text-muted-foreground">
                Anchor your reflections in God's Word. Reference Bible verses in
                your entries and see how Scripture shapes your daily walk.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Track your growth</h3>
              <p className="text-muted-foreground">
                See your journaling consistency and how often you're meditating
                on Scripture. Reflect on God's faithfulness over time.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Guided prompts</h3>
              <p className="text-muted-foreground">
                Never stare at a blank page. Use thoughtful prompts to guide
                your reflection when you need inspiration.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Private & secure</h3>
              <p className="text-muted-foreground">
                Your journal is between you and God. Only you can access your
                entries.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Works everywhere</h3>
              <p className="text-muted-foreground">
                Journal from any device. Your reflections sync seamlessly so you
                can seek Him anywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Scripture Quote */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <blockquote className="space-y-4">
            <p className="font-serif text-2xl sm:text-3xl text-foreground italic leading-relaxed">
              "Abide in me, and I in you. As the branch cannot bear fruit by
              itself, unless it abides in the vine, neither can you, unless you
              abide in me."
            </p>
            <footer className="text-scripture font-medium">— John 15:4</footer>
          </blockquote>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24 bg-muted/30">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Begin reflecting today
          </h2>
          <p className="text-xl text-muted-foreground">
            Join believers who are seeking deeper joy in Christ through
            Scripture, reflection, and prayer.
          </p>
          <Button size="lg" asChild>
            <Link href="/signup" className="gap-2">
              Create your free account
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Logo className="size-4" />
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 Meno. Built for the glorifying of Christ and the joy of His
              people.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
