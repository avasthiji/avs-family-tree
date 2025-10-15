"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AdminLoader } from "@/components/ui/loader";
import { Clock, CheckCircle, User, LogOut, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function PendingApprovalPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push("/auth/login");
      return;
    }

    // If already approved, redirect to dashboard
    if (session.user.isApprovedByAdmin) {
      router.push("/dashboard");
      return;
    }
  }, [session, status, router]);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const handleRefresh = () => {
    router.refresh();
    window.location.reload();
  };

  if (status === "loading") {
    return <AdminLoader text="Loading..." />;
  }

  if (!session) {
    return null;
  }

  const user = session.user;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] via-white to-[#F8F9FA]">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 avs-gradient rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">AVS</span>
              </div>
              <span className="text-xl font-bold avs-text-gradient">AVS Family Tree</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {user.firstName} {user.lastName}
              </span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto avs-gradient rounded-full flex items-center justify-center mb-6 shadow-xl">
            <Clock className="h-12 w-12 text-white animate-pulse" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Pending Approval</h1>
          <p className="text-gray-600">Your registration is under review</p>
        </div>

        <Card className="avs-card border-0 shadow-xl mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2 text-[#E63946]" />
              Account Status
            </CardTitle>
            <CardDescription>
              Your account details and verification status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Full Name</p>
                <p className="font-semibold text-gray-900">{user.firstName} {user.lastName}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Contact</p>
                <p className="font-semibold text-gray-900">{user.email || user.mobile}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-green-800">
                    {user.isEmailVerified ? 'Email Verified' : user.isMobileVerified ? 'Mobile Verified' : 'Account Verified'}
                  </span>
                </div>
                <span className="text-xs text-green-600 font-semibold">✓ COMPLETE</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-yellow-600 mr-2 animate-pulse" />
                  <span className="text-sm font-medium text-yellow-800">Admin Approval</span>
                </div>
                <span className="text-xs text-yellow-600 font-semibold">⏳ PENDING</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Alert className="mb-6 border-blue-200 bg-blue-50">
          <AlertDescription className="text-blue-800">
            <strong className="block mb-2">What happens next?</strong>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>An administrator will review your registration</li>
              <li>You'll receive an email notification once approved</li>
              <li>Typical approval time: 24-48 hours</li>
              <li>You can check back anytime to see your status</li>
            </ul>
          </AlertDescription>
        </Alert>

        <Card className="avs-card border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              If you have any questions or concerns about your registration, please contact our support team.
            </p>
            <div className="flex gap-3">
              <Button 
                onClick={handleRefresh}
                className="avs-button-primary"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Check Status
              </Button>
              <Link href="/profile">
                <Button variant="outline">
                  <User className="h-4 w-4 mr-2" />
                  View Profile
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Thank you for your patience. We appreciate your interest in joining the AVS Family Tree community!</p>
        </div>
      </div>
    </div>
  );
}

