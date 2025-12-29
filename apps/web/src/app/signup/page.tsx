"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Train, Loader2, User, Mail, Phone, Lock, CreditCard, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import apiClient from "@/lib/axios-client";
import { API_ENDPOINTS } from "@/lib/constants";
import { useAuthStore } from "@/stores/auth-store";
import { AuthResponse } from "@/types/auth";

const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z
      .string()
      .regex(/^01[3-9]\d{8}$/, "Invalid Bangladesh phone number"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    nid: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const setUser = useAuthStore((state) => state.setUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setError("");

    try {
      const { confirmPassword, ...registerData } = data;
      const response = await apiClient.post<AuthResponse>(
        API_ENDPOINTS.AUTH.REGISTER,
        registerData
      );
      setUser(response.data.user);
      router.push("/dashboard");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Matching Login Design */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center px-12 py-16 text-white">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Train className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Jatra Railway</h1>
                <p className="text-white/80 text-sm">Join thousands of travelers</p>
              </div>
            </div>
            
            <h2 className="text-5xl font-bold mb-4 leading-tight">
              Start Your Journey
              <br />
              <span className="text-orange-400">With Us Today</span>
            </h2>
            <p className="text-xl text-white/90">
              Create your account in minutes and get instant access to book tickets nationwide.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-white">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
              <Train className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Jatra Railway</h1>
              <p className="text-sm text-gray-600">Create Account</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create account</h2>
            <p className="text-gray-600">Start booking your train tickets today</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
                <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                </div>
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 font-medium">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="name"
                    placeholder="John Doe"
                    className={`pl-11 h-12 rounded-xl ${errors.name ? "border-red-500" : ""}`}
                    {...register("name")}
                  />
                </div>
                {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700 font-medium">Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="phone"
                    placeholder="01XXXXXXXXX"
                    className={`pl-11 h-12 rounded-xl ${errors.phone ? "border-red-500" : ""}`}
                    {...register("phone")}
                  />
                </div>
                {errors.phone && <p className="text-sm text-red-600">{errors.phone.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  className={`pl-11 h-12 rounded-xl ${errors.email ? "border-red-500" : ""}`}
                  {...register("email")}
                />
              </div>
              {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nid" className="text-gray-700 font-medium">NID (Optional)</Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="nid"
                  placeholder="National ID Number"
                  className="pl-11 h-12 rounded-xl"
                  {...register("nid")}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••"
                    className={`pl-11 h-12 rounded-xl ${errors.password ? "border-red-500" : ""}`}
                    {...register("password")}
                  />
                </div>
                {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirm</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••"
                    className={`pl-11 h-12 rounded-xl ${errors.confirmPassword ? "border-red-500" : ""}`}
                    {...register("confirmPassword")}
                  />
                </div>
                {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Already have an account?</span>
              </div>
            </div>

            <Link href="/login">
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 border-2 border-gray-300 hover:border-blue-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl font-semibold transition-all duration-300"
              >
                Sign in instead
              </Button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
