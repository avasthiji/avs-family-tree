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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import AppHeader from "@/components/AppHeader";
import BackButton from "@/components/BackButton";
import { MATRIMONIAL_ENABLED } from "@/lib/features";
import {
  Users,
  UserCheck,
  Heart,
  TreePine,
  TrendingUp,
  Calendar,
  Crown,
  MapPin,
  Building2,
  GraduationCap,
  UserCircle,
  Download,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { AdminLoader } from "@/components/ui/loader";

interface ReportStats {
  totalUsers: number;
  approvedUsers: number;
  pendingUsers: number;
  maleUsers: number;
  femaleUsers: number;
  activeMatrimony: number;
  totalRelationships: number;
}

interface DemographicData {
  gothiram: { name: string; count: number }[];
  nativePlace: { name: string; count: number }[];
  city: { name: string; count: number }[];
}

interface UserGrowth {
  month: string;
  count: number;
}

export default function AdminReportsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ReportStats>({
    totalUsers: 0,
    approvedUsers: 0,
    pendingUsers: 0,
    maleUsers: 0,
    femaleUsers: 0,
    activeMatrimony: 0,
    totalRelationships: 0,
  });

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/auth/login");
      return;
    }

    if (session.user.role !== "admin") {
      router.push("/dashboard");
      return;
    }

    fetchReportData();
  }, [session, status, router]);

  const fetchReportData = async () => {
    try {
      const response = await fetch("/api/admin/reports");
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    // Simple CSV export functionality
    const csvContent = `AVS Family Tree - Analytics Report
Generated: ${new Date().toLocaleDateString()}

SUMMARY STATISTICS
Total Users,${stats.totalUsers}
Approved Users,${stats.approvedUsers}
Pending Approvals,${stats.pendingUsers}
Male Users,${stats.maleUsers}
Female Users,${stats.femaleUsers}
Total Relationships,${stats.totalRelationships}

GENDER DISTRIBUTION
Male,${stats.maleUsers}
Female,${stats.femaleUsers}
`;

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `avs-report-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  if (status === "loading" || loading) {
    return <AdminLoader text="Loading reports..." />;
  }

  const approvalRate =
    stats.totalUsers > 0
      ? ((stats.approvedUsers / stats.totalUsers) * 100).toFixed(1)
      : 0;

  const matrimonyRate =
    stats.approvedUsers > 0
      ? ((stats.activeMatrimony / stats.approvedUsers) * 100).toFixed(1)
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] via-white to-[#F8F9FA]">
      {/* Navigation */}
      <AppHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BackButton href="/admin/dashboard" label="Back to Admin Dashboard" />
        
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
              <BarChart3 className="h-8 w-8 mr-3 text-[#E63946]" />
              Analytics & Reports
            </h1>
            <p className="text-gray-600">
              Comprehensive insights into your AVS community
            </p>
          </div>
          <Button onClick={exportToCSV} className="avs-button-primary">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Key Metrics */}
        <div
          className={`grid md:grid-cols-2 ${
            MATRIMONIAL_ENABLED ? "lg:grid-cols-4" : "lg:grid-cols-3"
          } gap-6 mb-8`}
        >
          <Card className="avs-card border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 avs-gradient rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <p className="text-sm text-gray-600 mb-1">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.totalUsers}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                All registered members
              </p>
            </CardContent>
          </Card>

          <Card className="avs-card border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 avs-gradient-secondary rounded-lg flex items-center justify-center">
                  <UserCheck className="h-6 w-6 text-white" />
                </div>
                <Badge className="bg-green-100 text-green-800">
                  {approvalRate}%
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-1">Approved Users</p>
              <p className="text-3xl font-bold text-[#2A9D8F]">
                {stats.approvedUsers}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Active community members
              </p>
            </CardContent>
          </Card>

          {MATRIMONIAL_ENABLED && (
            <Card className="avs-card border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 avs-gradient-purple rounded-lg flex items-center justify-center">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <Badge className="bg-pink-100 text-pink-800">
                    {matrimonyRate}%
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-1">Matrimony Active</p>
                <p className="text-3xl font-bold text-[#7209B7]">
                  {stats.activeMatrimony}
                </p>
                <p className="text-xs text-gray-500 mt-2">Seeking matches</p>
              </CardContent>
            </Card>
          )}

          <Card className="avs-card border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[#2A9D8F] to-[#4361EE] rounded-lg flex items-center justify-center">
                  <TreePine className="h-6 w-6 text-white" />
                </div>
                <Activity className="h-5 w-5 text-blue-500" />
              </div>
              <p className="text-sm text-gray-600 mb-1">Relationships</p>
              <p className="text-3xl font-bold text-[#4361EE]">
                {stats.totalRelationships}
              </p>
              <p className="text-xs text-gray-500 mt-2">Family connections</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Reports Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          {/* <TabsList className="grid grid-cols-4 w-full max-w-3xl">
            <TabsTrigger value="overview">
              <PieChart className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="demographics">
              <MapPin className="h-4 w-4 mr-2" />
              Demographics
            </TabsTrigger>
            {MATRIMONIAL_ENABLED && (
              <TabsTrigger value="matrimony">
                <Heart className="h-4 w-4 mr-2" />
                Matrimony
              </TabsTrigger>
            )}
            <TabsTrigger value="activity">
              <Activity className="h-4 w-4 mr-2" />
              Activity
            </TabsTrigger>
          </TabsList> */}

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="avs-card border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>User Status Breakdown</CardTitle>
                  <CardDescription>
                    Current user approval status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center">
                        <UserCheck className="h-5 w-5 mr-3 text-green-600" />
                        <span className="font-medium text-gray-900">
                          Approved
                        </span>
                      </div>
                      <span className="text-2xl font-bold text-green-600">
                        {stats.approvedUsers}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 mr-3 text-yellow-600" />
                        <span className="font-medium text-gray-900">
                          Pending
                        </span>
                      </div>
                      <span className="text-2xl font-bold text-yellow-600">
                        {stats.pendingUsers}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <Users className="h-5 w-5 mr-3 text-gray-600" />
                        <span className="font-medium text-gray-900">Total</span>
                      </div>
                      <span className="text-2xl font-bold text-gray-900">
                        {stats.totalUsers}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="avs-card border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Gender Distribution</CardTitle>
                  <CardDescription>User demographics by gender</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center">
                        <UserCircle className="h-5 w-5 mr-3 text-blue-600" />
                        <span className="font-medium text-gray-900">Male</span>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-blue-600">
                          {stats.maleUsers}
                        </span>
                        <p className="text-xs text-gray-500">
                          {stats.totalUsers > 0
                            ? (
                                (stats.maleUsers / stats.totalUsers) *
                                100
                              ).toFixed(1)
                            : 0}
                          %
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-pink-50 rounded-lg">
                      <div className="flex items-center">
                        <UserCircle className="h-5 w-5 mr-3 text-pink-600" />
                        <span className="font-medium text-gray-900">
                          Female
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-pink-600">
                          {stats.femaleUsers}
                        </span>
                        <p className="text-xs text-gray-500">
                          {stats.totalUsers > 0
                            ? (
                                (stats.femaleUsers / stats.totalUsers) *
                                100
                              ).toFixed(1)
                            : 0}
                          %
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Demographics Tab */}
          <TabsContent value="demographics">
            <Card className="avs-card border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Demographic Insights</CardTitle>
                <CardDescription>
                  Distribution by location and community details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <MapPin className="h-16 w-16 mx-auto mb-4 opacity-30" />
                  <h3 className="text-lg font-medium mb-2">
                    Demographic Analytics
                  </h3>
                  <p className="text-sm">
                    Detailed demographic breakdowns by Gothiram, Native Place,
                    and City
                  </p>
                  <p className="text-sm mt-2">
                    Coming soon with enhanced analytics features
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Matrimony Tab */}
          {MATRIMONIAL_ENABLED && (
            <TabsContent value="matrimony">
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <Card className="avs-card border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto avs-gradient-purple rounded-full flex items-center justify-center mb-3">
                        <Heart className="h-6 w-6 text-white" />
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        Active Profiles
                      </p>
                      <p className="text-3xl font-bold text-[#7209B7]">
                        {stats.activeMatrimony}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="avs-card border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto bg-blue-500 rounded-full flex items-center justify-center mb-3">
                        <UserCircle className="h-6 w-6 text-white" />
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        Male Profiles
                      </p>
                      <p className="text-3xl font-bold text-blue-600">
                        {/* This would need actual data */}-
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="avs-card border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto bg-pink-500 rounded-full flex items-center justify-center mb-3">
                        <UserCircle className="h-6 w-6 text-white" />
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        Female Profiles
                      </p>
                      <p className="text-3xl font-bold text-pink-600">
                        {/* This would need actual data */}-
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="avs-card border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Matrimony Statistics</CardTitle>
                  <CardDescription>
                    Insights into matrimony profile activity
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">
                          Activation Rate
                        </p>
                        <p className="text-sm text-gray-600">
                          Percentage of approved users with active matrimony
                          profiles
                        </p>
                      </div>
                      <span className="text-3xl font-bold text-[#7209B7]">
                        {matrimonyRate}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Activity Tab */}
          <TabsContent value="activity">
            <Card className="avs-card border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Community Activity</CardTitle>
                <CardDescription>
                  Recent activity and engagement metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                    <div className="flex items-center">
                      <TreePine className="h-8 w-8 mr-4 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">
                          Family Connections
                        </p>
                        <p className="text-sm text-gray-600">
                          Total relationships mapped
                        </p>
                      </div>
                    </div>
                    <span className="text-3xl font-bold text-blue-600">
                      {stats.totalRelationships}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mt-6">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Users className="h-5 w-5 mr-2 text-gray-600" />
                        <p className="font-medium text-gray-900">
                          Registration Trend
                        </p>
                      </div>
                      <p className="text-sm text-gray-600">
                        Track user growth over time
                      </p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Activity className="h-5 w-5 mr-2 text-gray-600" />
                        <p className="font-medium text-gray-900">
                          Engagement Metrics
                        </p>
                      </div>
                      <p className="text-sm text-gray-600">
                        Monitor community participation
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Summary Section */}
        <Card className="avs-card border-0 shadow-lg mt-8">
          <CardHeader>
            <CardTitle>Report Summary</CardTitle>
            <CardDescription>Key insights and recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-[#E63946] rounded-full mt-2 mr-3"></div>
                <p className="text-sm text-gray-700">
                  <strong>{stats.totalUsers} total users</strong> registered in
                  the AVS Family Tree system
                </p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-[#2A9D8F] rounded-full mt-2 mr-3"></div>
                <p className="text-sm text-gray-700">
                  <strong>{approvalRate}% approval rate</strong> with{" "}
                  {stats.approvedUsers} approved members actively participating
                </p>
              </div>
              {MATRIMONIAL_ENABLED && (
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-[#7209B7] rounded-full mt-2 mr-3"></div>
                  <p className="text-sm text-gray-700">
                    <strong>{stats.activeMatrimony} matrimony profiles</strong>{" "}
                    ({matrimonyRate}% of approved users) seeking matches
                  </p>
                </div>
              )}
              <div className="flex items-start">
                <div className="w-2 h-2 bg-[#4361EE] rounded-full mt-2 mr-3"></div>
                <p className="text-sm text-gray-700">
                  <strong>
                    {stats.totalRelationships} family relationships
                  </strong>{" "}
                  mapped, building a comprehensive family tree
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
