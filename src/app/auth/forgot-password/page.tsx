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
import {
  Loader2,
  ArrowLeft,
  Mail,
  Phone,
  Shield,
  CheckCircle2,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [identifierType, setIdentifierType] = useState<"email" | "mobile">(
    "email"
  );
  const [maskedIdentifier, setMaskedIdentifier] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!identifier) {
      setError("Email or mobile number is required");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to send OTP");
        return;
      }

      setSuccess(true);
      setIdentifierType(data.type);
      setMaskedIdentifier(data.identifier);

      // Redirect to reset password page after 2 seconds
      setTimeout(() => {
        router.push(
          `/auth/reset-password?identifier=${encodeURIComponent(
            identifier
          )}&type=${data.type}`
        );
      }, 2000);
    } catch (error) {
      console.error("Forgot password error:", error);
      setError("An error occurred. Please try again.");
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
            <div className="space-y-4 mt-8 max-w-md">
              <div className="flex items-start space-x-3">
                <Shield className="w-6 h-6 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg">
                    Secure Account Recovery
                  </h3>
                  <p className="text-sm text-white/90">
                    Reset your password securely using OTP verification
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Mail className="w-6 h-6 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg">Email Verification</h3>
                  <p className="text-sm text-white/90">
                    Use your registered email address
                  </p>
                </div>
              </div>
              {/* Mobile authentication hidden */}
              {/* <div className="flex items-start space-x-3">
                <Phone className="w-6 h-6 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg">Mobile Option</h3>
                  <p className="text-sm text-white/90">
                    Or use your registered mobile number
                  </p>
                </div>
              </div> */}
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg">Quick & Easy</h3>
                  <p className="text-sm text-white/90">
                    Get back to your account in just a few steps
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
          <div className="w-full max-w-md">
            {/* Back Button */}
            <Link
              href="/auth/login"
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Link>

            <Card className="border-0 shadow-xl">
              <CardHeader className="space-y-1 pb-6">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Forgot Password
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Enter your email address to receive an OTP
                </CardDescription>
              </CardHeader>

              <CardContent>
                {success ? (
                  <Alert className="bg-green-50 border-green-200 mb-6">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      OTP sent successfully to {maskedIdentifier}. Redirecting
                      to reset password page...
                    </AlertDescription>
                  </Alert>
                ) : (
                  <>
                    {error && (
                      <Alert className="bg-red-50 border-red-200 mb-6">
                        <AlertDescription className="text-red-800">
                          {error}
                        </AlertDescription>
                      </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="identifier" className="text-gray-700">
                          Email Address
                        </Label>
                        {/* Mobile authentication hidden - only email supported */}
                        <div className="relative">
                          <Input
                            id="identifier"
                            name="identifier"
                            type="email"
                            placeholder="Enter your email address"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            className="h-11 pl-10"
                            required
                            disabled={loading}
                          />
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <Mail className="w-5 h-5" />
                            {/* {identifier.includes("@") ? (
                              <Mail className="w-5 h-5" />
                            ) : (
                              <Phone className="w-5 h-5" />
                            )} */}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">
                          Enter the email address associated with your account
                        </p>
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-11 bg-gradient-to-r from-[#E63946] to-[#F77F00] hover:from-[#d32f3c] hover:to-[#e67100] text-white font-semibold"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending OTP...
                          </>
                        ) : (
                          "Send OTP"
                        )}
                      </Button>
                    </form>
                  </>
                )}

                {/* Additional Links */}
                <div className="mt-6 text-center space-y-2">
                  <p className="text-sm text-gray-600">
                    Remember your password?{" "}
                    <Link
                      href="/auth/login"
                      className="text-[#E63946] hover:text-[#d32f3c] font-semibold"
                    >
                      Login
                    </Link>
                  </p>
                  <p className="text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link
                      href="/auth/register"
                      className="text-[#E63946] hover:text-[#d32f3c] font-semibold"
                    >
                      Register
                    </Link>
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
