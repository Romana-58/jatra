"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Train, Calendar, CreditCard, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Train className="w-16 h-16 text-[var(--primary)] animate-pulse mx-auto mb-4" />
          <p className="text-[var(--muted-foreground)]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--muted)]">
      {/* Header */}
      <header className="bg-white border-b border-[var(--border)]">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] rounded-full flex items-center justify-center">
              <Train className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-[var(--primary)]">Jatra Railway</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[var(--muted-foreground)]">Welcome, {user.name}</span>
            <Button variant="outline" size="sm">Logout</Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[var(--foreground)] mb-2">
            Welcome back, {user.name}!
          </h2>
          <p className="text-[var(--muted-foreground)]">
            Ready to book your next railway journey?
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <Calendar className="w-10 h-10 text-[var(--primary)] mb-2" />
              <CardTitle>Search Trains</CardTitle>
              <CardDescription>Find and book your next journey</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <Train className="w-10 h-10 text-[var(--accent)] mb-2" />
              <CardTitle>My Bookings</CardTitle>
              <CardDescription>View your booking history</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CreditCard className="w-10 h-10 text-[var(--secondary)] mb-2" />
              <CardTitle>Payments</CardTitle>
              <CardDescription>View payment history</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <User className="w-10 h-10 text-[var(--success)] mb-2" />
              <CardTitle>Profile</CardTitle>
              <CardDescription>Manage your account</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your recent bookings and activities</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-[var(--muted-foreground)] text-center py-8">
              No recent activity. Start by searching for trains!
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
