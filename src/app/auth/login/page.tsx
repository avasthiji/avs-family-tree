"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Logo from "@/components/Logo";
import { Loader2, ArrowLeft, Users, Heart, TreePine, Globe, Calendar } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    mobile: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginType, setLoginType] = useState<"email" | "mobile">("email");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.password) {
      setError("Password is required");
      return;
    }

    if (loginType === "email" && !formData.email) {
      setError("Email is required");
      return;
    }

    if (loginType === "mobile" && !formData.mobile) {
      setError("Mobile number is required");
      return;
    }

    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: loginType === "email" ? formData.email : undefined,
        mobile: loginType === "mobile" ? formData.mobile : undefined,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error === "CredentialsSignin" 
          ? "Invalid email/mobile or password" 
          : result.error);
        return;
      }

      if (result?.ok) {
        // Redirect based on user status
        router.push("/dashboard");
      }

    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login. Please try again.");
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
                <Logo size="xl" className="rounded-full bg-white/20 p-4" showAnimation={true} />
              </div>
              <h1 className="text-4xl font-bold text-center mb-2">AVS Family Tree</h1>
              <p className="text-xl text-white/90 text-center">அகில இந்திய வேளாளர் சங்கம்</p>
            </div>

            {/* Features */}
            <div className="space-y-6 w-full max-w-md">
              <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Connect with Family</h3>
                  <p className="text-sm text-white/80">Discover your heritage and family connections</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <TreePine className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Build Your Tree</h3>
                  <p className="text-sm text-white/80">Create and maintain your family genealogy</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Global Community</h3>
                  <p className="text-sm text-white/80">Join AVS families worldwide</p>
                </div>
              </div>
            </div>

            {/* Back to Home */}
            <div className="mt-12">
              <Link href="/" className="inline-flex items-center space-x-2 text-white/80 hover:text-white transition-colors">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4">
                <Logo size="lg" className="rounded-full" />
              </div>
              <h1 className="text-2xl font-bold avs-text-gradient">AVS Family Tree</h1>
              <Link href="/" className="inline-flex items-center space-x-2 text-gray-600 hover:text-[#E63946] transition-colors mt-4">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Home</span>
              </Link>
            </div>

            <Card className="avs-card border-0 shadow-2xl">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 lg:hidden">
                  <Logo size="lg" className="rounded-full" />
                </div>
                <CardTitle className="text-2xl font-bold avs-text-gradient">Welcome Back</CardTitle>
                <CardDescription>
                  Sign in to your AVS Family Tree account
                </CardDescription>
              </CardHeader>
          
              <CardContent>
            {error && (
              <Alert className="mb-4 border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            {/* Login Type Toggle */}
            <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
              <button
                type="button"
                onClick={() => setLoginType("email")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  loginType === "email"
                    ? "bg-white text-[#E63946] shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Email
              </button>
              <button
                type="button"
                onClick={() => setLoginType("mobile")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  loginType === "mobile"
                    ? "bg-white text-[#E63946] shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Mobile
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {loginType === "email" ? (
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="mt-1"
                    placeholder="your@email.com"
                  />
                </div>
              ) : (
                <div>
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <Input
                    id="mobile"
                    name="mobile"
                    type="tel"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    required
                    className="mt-1"
                    placeholder="9876543210"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="mt-1"
                />
              </div>

              <div className="flex items-center justify-between">
                <Link 
                  href="/auth/forgot-password" 
                  className="text-sm text-[#E63946] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full avs-button-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link href="/auth/register" className="text-[#E63946] hover:underline font-medium">
                      Sign up
                    </Link>
                  </p>
                </div>

                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">
                    Demo accounts available after seeding the database
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
