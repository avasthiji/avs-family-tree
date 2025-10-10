"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ArrowLeft, Clock } from "lucide-react";

function VerifyOTPPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [canResend, setCanResend] = useState(false);

  const userId = searchParams.get("userId");
  const identifier = searchParams.get("identifier");
  const type = searchParams.get("type");

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    if (!userId || !identifier || !type) {
      setError("Missing verification parameters. Please try registering again.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          otp,
          identifier,
          type,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "OTP verification failed");
        return;
      }

      setSuccess("OTP verified successfully! Logging you in...");
      
      // Auto-login the user
      if (data.autoLogin && data.user) {
        // Get the temporary password from sessionStorage
        const tempPassword = typeof window !== 'undefined' ? sessionStorage.getItem('temp_login_pass') : null;
        
        if (tempPassword) {
          // Use the verified credentials to sign in
          const result = await signIn("credentials", {
            email: data.user.email || '',
            mobile: data.user.mobile || '',
            password: tempPassword,
            redirect: false,
          });

          // Clear the temporary password
          if (typeof window !== 'undefined') {
            sessionStorage.removeItem('temp_login_pass');
          }

          if (result?.error) {
            // If auto-login fails, redirect to login page
            setSuccess("OTP verified! Please log in with your credentials.");
            setTimeout(() => {
              router.push("/auth/login");
            }, 2000);
          } else {
            // Successfully logged in, redirect to dashboard
            setTimeout(() => {
              router.push("/dashboard");
            }, 1500);
          }
        } else {
          // No password found, redirect to login
          setSuccess("OTP verified! Please log in with your credentials.");
          setTimeout(() => {
            router.push("/auth/login");
          }, 2000);
        }
      } else {
        // Fallback to login page
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      }

    } catch (error) {
      console.error("OTP verification error:", error);
      setError("An error occurred during verification. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!identifier || !type) return;

    setResendLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier,
          type,
          purpose: 'registration'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to resend OTP");
        return;
      }

      setSuccess("OTP resent successfully!");
      setTimeLeft(300);
      setCanResend(false);

    } catch (error) {
      console.error("Resend OTP error:", error);
      setError("An error occurred while resending OTP. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  if (!userId || !identifier || !type) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] via-white to-[#F8F9FA] flex items-center justify-center p-4">
        <Card className="avs-card border-0 shadow-2xl max-w-md">
          <CardContent className="p-8 text-center">
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                Invalid verification link. Please try registering again.
              </AlertDescription>
            </Alert>
            <Link href="/auth/register" className="mt-4 inline-block">
              <Button className="avs-button-primary">Register Again</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] via-white to-[#F8F9FA] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 text-gray-600 hover:text-[#E63946] transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        <Card className="avs-card border-0 shadow-2xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto avs-gradient rounded-full flex items-center justify-center mb-4">
              <span className="text-white font-bold text-xl">AVS</span>
            </div>
            <CardTitle className="text-2xl font-bold avs-text-gradient">Verify Your Account</CardTitle>
            <CardDescription>
              Enter the 6-digit OTP sent to your {type === 'email' ? 'email' : 'mobile number'}
            </CardDescription>
            <div className="mt-2">
              <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                {type === 'email' ? '📧' : '📱'} {identifier}
              </span>
            </div>
          </CardHeader>
          
          <CardContent>
            {error && (
              <Alert className="mb-4 border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert className="mb-4 border-green-200 bg-green-50">
                <AlertDescription className="text-green-800">{success}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <Label htmlFor="otp">Enter OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={handleOtpChange}
                  placeholder="123456"
                  className="mt-1 text-center text-2xl font-mono tracking-widest"
                  maxLength={6}
                />
              </div>

              {/* Timer */}
              <div className="text-center">
                {!canResend ? (
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>OTP expires in: {formatTime(timeLeft)}</span>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">OTP has expired</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full avs-button-primary"
                disabled={loading || otp.length !== 6}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify OTP"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-2">
                Didn't receive the OTP?
              </p>
              <Button
                variant="outline"
                onClick={handleResendOTP}
                disabled={!canResend || resendLoading}
                className="border-[#2A9D8F] text-[#2A9D8F] hover:bg-[#2A9D8F] hover:text-white"
              >
                {resendLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resending...
                  </>
                ) : (
                  "Resend OTP"
                )}
              </Button>
            </div>

            <div className="mt-4 text-center">
              <Link href="/auth/register" className="text-sm text-[#E63946] hover:underline">
                Back to Registration
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] via-white to-[#F8F9FA] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto avs-gradient rounded-full flex items-center justify-center mb-4 animate-pulse">
            <span className="text-white font-bold text-xl">AVS</span>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <VerifyOTPPageContent />
    </Suspense>
  );
}
