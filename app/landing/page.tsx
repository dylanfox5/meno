import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, PenLine, Heart, Sparkles } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
              <span className="font-serif text-lg font-semibold">M</span>
            </div>
            <span className="font-serif text-xl font-semibold">Meno</span>
          </div>
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
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Abide in Christ through{" "}
            <span className="text-primary">daily reflection</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed">
            A simple, beautiful space for journaling your faith journey,
            meditating on Scripture, and growing closer to God.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="text-lg">
              <Link href="/signup">Start Journaling Free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            No credit card required. Start reflecting today.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Everything you need for spiritual growth
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Meno helps you build a consistent practice of reflection, prayer,
            and Scripture meditation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-border">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <PenLine className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                Daily Journaling
              </h3>
              <p className="text-muted-foreground">
                Capture your thoughts, prayers, and reflections in a beautiful,
                distraction-free environment.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                Scripture Integration
              </h3>
              <p className="text-muted-foreground">
                Connect your journal entries with Bible verses and track your
                Scripture meditation journey.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                Track Your Growth
              </h3>
              <p className="text-muted-foreground">
                See your journaling streaks and reflect on how God has been
                working in your life over time.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                Daily Inspiration
              </h3>
              <p className="text-muted-foreground">
                Start each session with a curated verse to inspire your
                reflection and set your mind on things above.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
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
              <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                Private & Secure
              </h3>
              <p className="text-muted-foreground">
                Your journal is completely private. Only you can see your
                entries - they're encrypted and secure.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
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
              <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                Works Everywhere
              </h3>
              <p className="text-muted-foreground">
                Journal from any device - desktop, tablet, or phone. Your
                entries sync seamlessly across all devices.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonial Section (Add real ones later) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Card className="border-border bg-muted/50">
          <CardContent className="p-8 sm:p-12 text-center">
            <p className="font-serif text-xl sm:text-2xl text-foreground italic mb-4">
              "Abide in me, and I in you. As the branch cannot bear fruit by
              itself, unless it abides in the vine, neither can you, unless you
              abide in me."
            </p>
            <p className="text-sm text-primary font-medium">— John 15:4</p>
          </CardContent>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center bg-primary/5 rounded-2xl p-12 border border-primary/20">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Begin your journey today
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join others who are growing closer to God through daily reflection
            and Scripture meditation.
          </p>
          <Button size="lg" asChild className="text-lg">
            <Link href="/signup">Start Journaling Free</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                <span className="font-serif text-sm font-semibold">M</span>
              </div>
              <span className="font-serif text-lg font-semibold">Meno</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 Meno. Built with ❤️ for spiritual growth.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
