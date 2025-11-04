"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  Shield,
  Key,
} from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [identifier, setIdentifier] = useState("");
  const [identifierType, setIdentifierType] = useState<"email" | "mobile">(
    "email"
  );
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState(3);

  useEffect(() => {
    const identifierParam = searchParams.get("identifier");
    const typeParam = searchParams.get("type") as "email" | "mobile";

    if (identifierParam) {
      setIdentifier(identifierParam);
    }
    if (typeParam) {
      setIdentifierType(typeParam);
    }
  }, [searchParams]);

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validation
    if (!identifier) {
      setError("Identifier is required");
      return;
    }

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    if (!newPassword) {
      setError("Password is required");
      return;
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier,
          otp,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to reset password");
        if (data.remainingAttempts !== undefined) {
          setRemainingAttempts(data.remainingAttempts);
        }
        return;
      }

      setSuccess(true);

      // Redirect to login page after 2 seconds
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (error) {
      console.error("Reset password error:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError("");
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
        setError(data.error || "Failed to resend OTP");
        return;
      }

      setError("");
      setSuccess(false);
      setOtp("");
      setRemainingAttempts(3);
      alert("OTP sent successfully!");
    } catch (error) {
      console.error("Resend OTP error:", error);
      setError("Failed to resend OTP. Please try again.");
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
                <Key className="w-6 h-6 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg">OTP Verification</h3>
                  <p className="text-sm text-white/90">
                    Enter the OTP sent to your email
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Lock className="w-6 h-6 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg">Strong Password</h3>
                  <p className="text-sm text-white/90">
                    Create a secure password for your account
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Shield className="w-6 h-6 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg">Secure Reset</h3>
                  <p className="text-sm text-white/90">
                    Your account security is our priority
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
              href="/auth/forgot-password"
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>

            <Card className="border-0 shadow-xl">
              <CardHeader className="space-y-1 pb-6">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Reset Password
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Enter the OTP and create a new password
                </CardDescription>
              </CardHeader>

              <CardContent>
                {success ? (
                  <Alert className="bg-green-50 border-green-200 mb-6">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Password reset successfully! Redirecting to login page...
                    </AlertDescription>
                  </Alert>
                ) : (
                  <>
                    {error && (
                      <Alert className="bg-red-50 border-red-200 mb-6">
                        <AlertDescription className="text-red-800">
                          {error}
                          {remainingAttempts < 3 && remainingAttempts > 0 && (
                            <span className="block mt-1 text-sm">
                              {remainingAttempts} attempt(s) remaining
                            </span>
                          )}
                        </AlertDescription>
                      </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* OTP Input */}
                      <div className="space-y-2">
                        <Label htmlFor="otp" className="text-gray-700">
                          Enter OTP
                        </Label>
                        <Input
                          id="otp"
                          name="otp"
                          type="text"
                          placeholder="Enter 6-digit OTP"
                          value={otp}
                          onChange={(e) =>
                            setOtp(
                              e.target.value.replace(/\D/g, "").slice(0, 6)
                            )
                          }
                          className="h-11 text-center text-2xl tracking-widest font-bold"
                          maxLength={6}
                          required
                          disabled={loading}
                        />
                        <p className="text-xs text-gray-500">
                          Check your email for the OTP
                        </p>
                      </div>

                      {/* New Password */}
                      <div className="space-y-2">
                        <Label htmlFor="newPassword" className="text-gray-700">
                          New Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            name="newPassword"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="h-11 pr-10"
                            required
                            disabled={loading}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-gray-500">
                          At least 8 characters with uppercase, lowercase, and
                          number
                        </p>
                      </div>

                      {/* Confirm Password */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="confirmPassword"
                          className="text-gray-700"
                        >
                          Confirm Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="h-11 pr-10"
                            required
                            disabled={loading}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-11 bg-gradient-to-r from-[#E63946] to-[#F77F00] hover:from-[#d32f3c] hover:to-[#e67100] text-white font-semibold"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Resetting Password...
                          </>
                        ) : (
                          "Reset Password"
                        )}
                      </Button>

                      {/* Resend OTP */}
                      <div className="text-center">
                        <button
                          type="button"
                          onClick={handleResendOTP}
                          className="text-sm text-[#E63946] hover:text-[#d32f3c] font-semibold"
                          disabled={loading}
                        >
                          Didn't receive OTP? Resend
                        </button>
                      </div>
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
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#E63946]" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
