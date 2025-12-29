"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Train, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import apiClient from "@/lib/axios-client";
import { API_ENDPOINTS } from "@/lib/constants";
import { useAuthStore } from "@/stores/auth-store";
import { AuthResponse } from "@/types/auth";

const loginSchema = z.object({
  emailOrPhone: z.string().min(1, "Email or phone is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const setUser = useAuthStore((state) => state.setUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await apiClient.post<AuthResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        data
      );
      setUser(response.data.user);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--primary)] via-[var(--secondary)] to-[var(--primary)] p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] rounded-full flex items-center justify-center">
            <Train className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-base">
            Sign in to book your next railway journey
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {/* Test Credentials */}
            <div className="bg-gradient-to-r from-blue-50 to-orange-50 border border-blue-200 rounded-md p-4 text-sm">
              <p className="font-semibold text-gray-700 mb-2">🧪 Test Credentials:</p>
              <div className="space-y-1 text-gray-600">
                <div className="flex justify-between">
                  <span>Admin:</span>
                  <code className="bg-white px-2 py-0.5 rounded text-xs">admin@jatra.com / admin123</code>
                </div>
                <div className="flex justify-between">
                  <span>User:</span>
                  <code className="bg-white px-2 py-0.5 rounded text-xs">user@jatra.com / user123</code>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-[var(--error)]/10 border border-[var(--error)] text-[var(--error)] px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="emailOrPhone">Email or Phone</Label>
              <Input
                id="emailOrPhone"
                placeholder="Enter your email or phone number"
                {...register("emailOrPhone")}
                className={errors.emailOrPhone ? "border-[var(--error)]" : ""}
              />
              {errors.emailOrPhone && (
                <p className="text-sm text-[var(--error)]">{errors.emailOrPhone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-[var(--primary)] hover:text-[var(--accent)] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register("password")}
                className={errors.password ? "border-[var(--error)]" : ""}
              />
              {errors.password && (
                <p className="text-sm text-[var(--error)]">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              variant="default"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </CardContent>

          <CardFooter className="flex-col space-y-4">
            <div className="text-center text-sm text-[var(--muted-foreground)]">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-[var(--primary)] hover:text-[var(--accent)] font-semibold transition-colors"
              >
                Create account
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
