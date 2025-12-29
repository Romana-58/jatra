"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Train, Loader2, Shield, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import apiClient from "@/lib/axios-client";
import { API_ENDPOINTS } from "@/lib/constants";
import { useAuthStore } from "@/stores/auth-store";
import { AuthResponse } from "@/types/auth";

const loginSchema = z.object({
  emailOrPhone: z.string().min(1, "Email or phone is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const TEST_ACCOUNTS = {
  ADMIN: {
    email: "admin@jatra.com",
    password: "admin123",
  },
  USER: {
    email: "user@jatra.com",
    password: "user123",
  },
};

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const setUser = useAuthStore((state) => state.setUser);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const fillTestCredentials = (role: "ADMIN" | "USER") => {
    const credentials = TEST_ACCOUNTS[role];
    setValue("emailOrPhone", credentials.email);
    setValue("password", credentials.password);
    setError("");
  };

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
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
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
            {/* Quick Login Options */}
            <div className="bg-gradient-to-r from-blue-50 to-orange-50 border border-blue-200 rounded-md p-4">
              <p className="font-semibold text-gray-700 mb-3 text-sm">
                🧪 Quick Login:
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-auto py-3 flex flex-col items-center gap-2 hover:bg-blue-100 hover:border-blue-400 transition-all"
                  onClick={() => fillTestCredentials("ADMIN")}
                >
                  <Shield className="w-5 h-5 text-blue-600" />
                  <div className="text-center">
                    <div className="font-semibold text-sm">Admin</div>
                    <div className="text-xs text-gray-500">Full Access</div>
                  </div>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-auto py-3 flex flex-col items-center gap-2 hover:bg-orange-100 hover:border-orange-400 transition-all"
                  onClick={() => fillTestCredentials("USER")}
                >
                  <User className="w-5 h-5 text-orange-600" />
                  <div className="text-center">
                    <div className="font-semibold text-sm">User</div>
                    <div className="text-xs text-gray-500">Regular User</div>
                  </div>
                </Button>
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
                <p className="text-sm text-[var(--error)]">
                  {errors.emailOrPhone.message}
                </p>
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
                <p className="text-sm text-[var(--error)]">
                  {errors.password.message}
                </p>
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
