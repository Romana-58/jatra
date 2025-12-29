import Link from "next/link";
import { Train, Clock, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--primary)] via-[var(--secondary)] to-[var(--primary)]">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
            <Train className="w-7 h-7 text-[var(--primary)]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Jatra Railway</h1>
            <p className="text-xs text-white/80">Smart Booking System</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link href="/login">
            <Button
              variant="outline"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button variant="accent">Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-5xl md:text-6xl font-bold text-white leading-tight">
            Book Train Tickets
            <br />
            <span className="bg-gradient-to-r from-[var(--accent)] to-orange-400 bg-clip-text text-transparent">
              Faster & Smarter
            </span>
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Experience hassle-free train booking with real-time seat
            availability, instant confirmations, and secure payments
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Link href="/dashboard">
              <Button size="lg" variant="accent" className="text-lg px-8">
                Search Trains
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                size="lg"
                variant="outline"
                className="bg-white text-[var(--primary)] hover:bg-white/90 text-lg px-8"
              >
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <Zap className="w-12 h-12 text-[var(--accent)] mb-2" />
              <CardTitle className="text-white">Instant Booking</CardTitle>
              <CardDescription className="text-white/70">
                Book tickets in under 2 minutes with our streamlined process
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <Clock className="w-12 h-12 text-[var(--accent)] mb-2" />
              <CardTitle className="text-white">Real-Time Updates</CardTitle>
              <CardDescription className="text-white/70">
                Get live seat availability and instant confirmation
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <Shield className="w-12 h-12 text-[var(--accent)] mb-2" />
              <CardTitle className="text-white">Secure Payments</CardTitle>
              <CardDescription className="text-white/70">
                Multiple payment options with bank-grade security
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <Train className="w-12 h-12 text-[var(--accent)] mb-2" />
              <CardTitle className="text-white">Digital Tickets</CardTitle>
              <CardDescription className="text-white/70">
                Get QR code tickets instantly on your phone
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-20 border-t border-white/20">
        <div className="text-center text-white/70 text-sm">
          <p>&copy; 2025 Jatra Railway. Built with ❤️ for Bangladesh Railway</p>
        </div>
      </footer>
    </div>
  );
}
