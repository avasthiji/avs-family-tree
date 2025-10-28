"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Logo from "@/components/Logo";
import { Loader2, ArrowLeft, Users, Heart, TreePine } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password
    ) {
      setError("First name, last name, email, and password are required");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords does not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      setSuccess(
        "Registration successful! Please check your email for OTP verification."
      );

      // Store password temporarily in sessionStorage for auto-login after OTP verification
      if (typeof window !== "undefined") {
        sessionStorage.setItem("temp_login_pass", formData.password);
      }

      // Redirect to OTP verification page
      setTimeout(() => {
        router.push(
          `/auth/verify-otp?userId=${
            data.userId
          }&identifier=${encodeURIComponent(data.identifier)}&type=${data.type}`
        );
      }, 2000);
    } catch (error) {
      console.error("Registration error:", error);
      setError("An error occurred during registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Split Screen Layout */}
      <div className="flex h-screen">
        {/* Left Side - Logo and Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#E63946] via-[#F77F00] to-[#E63946] relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full"></div>
            <div className="absolute top-40 right-20 w-24 h-24 bg-white rounded-full"></div>
            <div className="absolute bottom-20 left-20 w-40 h-40 bg-white rounded-full"></div>
            <div className="absolute bottom-40 right-10 w-28 h-28 bg-white rounded-full"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-center items-center text-white p-12 min-h-full m-auto">
            {/* Logo */}
            <div className="mb-8">
              <div className="w-32 h-32 mx-auto mb-6 relative">
                <Logo
                  size="xl"
                  className="rounded-full bg-white/20 p-4"
                  showAnimation={true}
                />
              </div>
              <h1 className="text-4xl font-bold text-center mb-2">
                AVS Family Tree
              </h1>
              <p className="text-xl text-white/90 text-center">
                அகில இந்திய வேளாளர் சங்கம்
              </p>
            </div>

            {/* Features */}
            <div className="space-y-6 w-full max-w-md">
              <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Join the Community</h3>
                  <p className="text-sm text-white/80">
                    Connect with AVS families across the globe
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <TreePine className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Preserve Heritage</h3>
                  <p className="text-sm text-white/80">
                    Document your family history for future generations
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Build Connections</h3>
                  <p className="text-sm text-white/80">
                    Discover relatives and strengthen family bonds
                  </p>
                </div>
              </div>
            </div>

            {/* Back to Home */}
            <div className="mt-12">
              <Link
                href="/"
                className="inline-flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <h1 className="text-2xl font-bold avs-text-gradient">
                AVS Family Tree
              </h1>
              <Link
                href="/"
                className="inline-flex items-center space-x-2 text-gray-600 hover:text-[#E63946] transition-colors mt-4"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Home</span>
              </Link>
            </div>

            <Card className="avs-card border-0 shadow-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold avs-text-gradient">
                  Join AVS Family Tree
                </CardTitle>
                <CardDescription>
                  Create your account and connect with the AVS community
                </CardDescription>
              </CardHeader>

              <CardContent>
                {error && (
                  <Alert className="mb-4 border-red-200 bg-red-50">
                    <AlertDescription className="text-red-800">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="mb-4 border-green-200 bg-green-50">
                    <AlertDescription className="text-green-800">
                      {success}
                    </AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Minimum 8 characters
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full avs-button-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link
                      href="/auth/login"
                      className="text-[#E63946] hover:underline font-medium"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>

                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">
                    By creating an account, you agree to our terms of service
                    and privacy policy. Your account will be reviewed by our
                    admin team before activation.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
