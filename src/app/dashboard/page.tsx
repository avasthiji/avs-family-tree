"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader } from "@/components/ui/loader";
import {
  Users,
  TreePine,
  Heart,
  Calendar,
  Search,
  Settings,
  User,
  LogOut,
  Crown,
  Shield,
} from "lucide-react";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import UserDetailsModal from "@/components/UserDetailsModal";
import AppHeader from "@/components/AppHeader";
import { MATRIMONIAL_ENABLED, EVENT_ENABLED } from "@/lib/features";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileUserId, setProfileUserId] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return; // Still loading

    if (!session) {
      router.push("/auth/login");
      return;
    }

    // Check if user is approved by admin
    if (!session.user.isApprovedByAdmin) {
      router.push("/pending-approval");
      return;
    }
  }, [session, status, router]);

  const handleViewProfile = (userId: string) => {
    setProfileUserId(userId);
    setProfileModalOpen(true);
  };

  useEffect(() => {
    // Listen for node clicks from the modal's family tree tab
    const handleUserProfileNodeClick = (event: CustomEvent) => {
      const { userId } = event.detail;
      setProfileUserId(userId);
      setProfileModalOpen(true);
    };

    window.addEventListener('userProfileNodeClick', handleUserProfileNodeClick as EventListener);
    return () => {
      window.removeEventListener('userProfileNodeClick', handleUserProfileNodeClick as EventListener);
    };
  }, []);

  if (status === "loading") {
    return <Loader variant="page" text="Loading..." size="lg" />;
  }

  if (!session) {
    return null;
  }

  const user = session.user;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] via-white to-[#F8F9FA]">
      {/* Navigation */}
      <AppHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to your AVS Family Tree Dashboard
          </h1>
          <p className="text-gray-600">
            Connect with your family, discover your heritage, and build lasting
            relationships.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <Card className="avs-card border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <SearchBar
                    isAdmin={user.role === "admin"}
                    onSelectUser={(user) => {
                      handleViewProfile(user._id);
                    }}
                    onViewProfile={handleViewProfile}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Alerts */}
        {!user.isEmailVerified && (
          <Alert className="mb-6 border-yellow-200 bg-yellow-50">
            <Shield className="h-4 w-4" />
            <AlertDescription className="text-yellow-800">
              Your email is not verified. Please verify your email to access all
              features.
            </AlertDescription>
          </Alert>
        )}

        {!user.isMobileVerified && (
          <Alert className="mb-6 border-yellow-200 bg-yellow-50">
            <Shield className="h-4 w-4" />
            <AlertDescription className="text-yellow-800">
              Your mobile number is not verified. Please verify your mobile
              number for better security.
            </AlertDescription>
          </Alert>
        )}

        {/* Quick Actions */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${
            MATRIMONIAL_ENABLED && EVENT_ENABLED
              ? "xl:grid-cols-5"
              : MATRIMONIAL_ENABLED || EVENT_ENABLED
              ? "xl:grid-cols-4"
              : "xl:grid-cols-3"
          } gap-6 mb-8`}
        >
          <Card className="avs-card border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="pb-3">
              <div className="w-12 h-12 avs-gradient rounded-lg flex items-center justify-center mb-2">
                <Users className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg">My Relationships</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                Manage your family connections and build your family tree.
              </CardDescription>
              <Link href="/relationships">
                <Button className="w-full avs-button-primary">Manage</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="avs-card border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="pb-3">
              <div className="w-12 h-12 avs-gradient rounded-lg flex items-center justify-center mb-2">
                <Search className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg">Find Relatives</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                Search for family members and relatives in the AVS community.
              </CardDescription>
              <Link href="/search">
                <Button className="w-full avs-button-primary">
                  Search Now
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="avs-card border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="pb-3">
              <div className="w-12 h-12 avs-gradient-secondary rounded-lg flex items-center justify-center mb-2">
                <TreePine className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg">Family Tree</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                Build and visualize your family tree with our interactive tools.
              </CardDescription>
              <Link href="/family-tree">
                <Button className="w-full avs-button-secondary">
                  View Tree
                </Button>
              </Link>
            </CardContent>
          </Card>

          {MATRIMONIAL_ENABLED && (
            <Card className="avs-card border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 bg-gradient-to-r from-[#F77F00] to-[#E63946] rounded-lg flex items-center justify-center mb-2">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">Matrimony</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Browse profiles and find your perfect match within the AVS
                  community.
                </CardDescription>
                <Link href="/matrimony">
                  <Button className="w-full bg-gradient-to-r from-[#F77F00] to-[#E63946] text-white hover:shadow-lg">
                    Browse Profiles
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {EVENT_ENABLED && (
            <Card className="avs-card border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 avs-gradient-purple rounded-lg flex items-center justify-center mb-2">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">Events</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Stay updated with AVS community events and gatherings.
                </CardDescription>
                <Link href="/events">
                  <Button className="w-full avs-gradient-purple text-white hover:shadow-lg">
                    View Events
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Admin Section */}
        {user.role === "admin" && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Admin Panel
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="avs-card border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-[#E63946]" />
                    User Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    Manage user registrations, approvals, and roles.
                  </CardDescription>
                  <Link href="/admin/users">
                    <Button variant="outline" className="w-full">
                      Manage Users
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="avs-card border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2 text-[#2A9D8F]" />
                    Reports
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    View analytics and reports about the community.
                  </CardDescription>
                  <Link href="/admin/reports">
                    <Button variant="outline" className="w-full">
                      View Reports
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {EVENT_ENABLED && (
                <Card className="avs-card border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-[#7209B7]" />
                      Event Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">
                      Create and manage community events.
                    </CardDescription>
                    <Link href="/admin/events">
                      <Button variant="outline" className="w-full">
                        Manage Events
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <Card className="avs-card border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest interactions with the AVS community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No recent activity yet. Start exploring the community!</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Profile Details Modal */}
      <UserDetailsModal
        userId={profileUserId}
        isOpen={profileModalOpen}
        onClose={() => {
          setProfileModalOpen(false);
          setProfileUserId(null);
        }}
      />
    </div>
  );
}
