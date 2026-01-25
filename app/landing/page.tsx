import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, PenLine, Heart, Sparkles, ArrowRight } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { LogoStained } from "@/components/ui/logo-stained";

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
            <LogoStained className="size-12" />
            <span className="text-xl font-semibold">Meno</span>
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

      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-32 sm:pb-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
            A quiet space for <span className="text-primary">reflection</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Journal your faith journey. Meditate on Scripture. Abide in the True
            Vine.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" asChild>
              <Link href="/signup" className="gap-2">
                Start journaling free
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <p className="text-sm text-muted-foreground">
              No credit card • No setup • Just write
            </p>
          </div>
        </div>

        {/* Visual Preview */}
        <div className="max-w-5xl mx-auto mt-16 sm:mt-24">
          <div className="rounded-xl border border-border bg-card shadow-2xl overflow-hidden">
            <div className="bg-muted/30 border-b border-border px-4 py-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <div className="p-8 sm:p-12 space-y-6">
              <div>
                <div className="text-sm text-muted-foreground mb-2">
                  Today's reflection
                </div>
                <div className="text-2xl font-semibold mb-4">
                  Morning gratitude
                </div>
                <div className="text-muted-foreground leading-relaxed">
                  This morning I'm reminded of Psalm 46:10 - "Be still, and know
                  that I am God." In the quiet moments before the day begins, I
                  feel Your presence most clearly...
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-primary">
                <BookOpen className="w-4 h-4" />
                <span>Psalm 46:10</span>
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
              Simple, focused tools to help you build a consistent practice of
              reflection and Scripture meditation.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <PenLine className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Daily journaling</h3>
              <p className="text-muted-foreground">
                A distraction-free space to capture your thoughts, prayers, and
                reflections.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Scripture connection</h3>
              <p className="text-muted-foreground">
                Connect entries with Bible verses and track your meditation
                journey.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Track your growth</h3>
              <p className="text-muted-foreground">
                See journaling streaks and reflect on how God has worked in your
                life.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Daily inspiration</h3>
              <p className="text-muted-foreground">
                Start each session with a curated Scripture verse to inspire
                reflection.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Private & secure</h3>
              <p className="text-muted-foreground">
                Your journal is completely private. Only you can access your
                entries.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Works everywhere</h3>
              <p className="text-muted-foreground">
                Journal from any device. Your entries sync seamlessly across all
                platforms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Scripture Quote */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <blockquote className="space-y-4">
            <p className="text-2xl sm:text-3xl text-foreground italic leading-relaxed">
              "Abide in me, and I in you. As the branch cannot bear fruit by
              itself, unless it abides in the vine, neither can you, unless you
              abide in me."
            </p>
            <footer className="text-primary font-medium">— John 15:4</footer>
          </blockquote>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24 bg-muted/30">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Start your journey today
          </h2>
          <p className="text-xl text-muted-foreground">
            Join others who are growing closer to God through daily reflection.
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
              <LogoStained className="w-6 h-6" />
              <span className="text-lg font-semibold">Meno</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 Meno. Built with care for spiritual growth.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
