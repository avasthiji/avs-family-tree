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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import AppHeader from "@/components/AppHeader";
import { MATRIMONIAL_ENABLED, EVENT_ENABLED } from "@/lib/features";
import {
  Users,
  UserCheck,
  UserX,
  TreePine,
  Heart,
  Calendar,
  TrendingUp,
  Crown,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

interface DashboardStats {
  totalUsers: number;
  pendingApprovals: number;
  approvedUsers: number;
  activeMatrimony: number;
  totalRelationships: number;
  totalEvents: number;
}

interface PendingUser {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  mobile?: string;
  createdAt: string;
  isEmailVerified: boolean;
  isMobileVerified: boolean;
}

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    pendingApprovals: 0,
    approvedUsers: 0,
    activeMatrimony: 0,
    totalRelationships: 0,
    totalEvents: 0,
  });
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

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

    fetchDashboardData();
  }, [session, status, router]);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, pendingRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/users/pending"),
      ]);

      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data.stats);
      }

      if (pendingRes.ok) {
        const data = await pendingRes.json();
        setPendingUsers(data.users);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/approve`, {
        method: "POST",
      });

      if (response.ok) {
        fetchDashboardData();
      }
    } catch (error) {
      console.error("Error approving user:", error);
    }
  };

  const handleRejectUser = async (userId: string) => {
    if (!confirm("Are you sure you want to reject this user?")) return;

    try {
      const response = await fetch(`/api/admin/users/${userId}/reject`, {
        method: "POST",
      });

      if (response.ok) {
        fetchDashboardData();
      }
    } catch (error) {
      console.error("Error rejecting user:", error);
    }
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === pendingUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(pendingUsers.map((user) => user._id));
    }
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleBulkApprove = async () => {
    if (selectedUsers.length === 0) return;

    if (
      !confirm(
        `Are you sure you want to approve ${selectedUsers.length} user(s)?`
      )
    )
      return;

    setBulkActionLoading(true);
    try {
      await Promise.all(
        selectedUsers.map((userId) =>
          fetch(`/api/admin/users/${userId}/approve`, {
            method: "POST",
          })
        )
      );
      setSelectedUsers([]);
      fetchDashboardData();
    } catch (error) {
      console.error("Error approving users:", error);
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleBulkReject = async () => {
    if (selectedUsers.length === 0) return;

    if (
      !confirm(
        `Are you sure you want to reject ${selectedUsers.length} user(s)? This action cannot be undone.`
      )
    )
      return;

    setBulkActionLoading(true);
    try {
      await Promise.all(
        selectedUsers.map((userId) =>
          fetch(`/api/admin/users/${userId}/reject`, {
            method: "POST",
          })
        )
      );
      setSelectedUsers([]);
      fetchDashboardData();
    } catch (error) {
      console.error("Error rejecting users:", error);
    } finally {
      setBulkActionLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return <AdminLoader text="Loading admin dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] via-white to-[#F8F9FA]">
      {/* Navigation */}
      <AppHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage users, approvals, and community settings
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <Card className="avs-card border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <SearchBar isAdmin={true} onSelectUser={(user) => {}} />
                </div>
                <Link href="/search">
                  <Button className="avs-button-primary whitespace-nowrap">
                    Advanced Search
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Statistics Cards */}
        <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8`}>
          <Card className="avs-card border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.totalUsers}
                  </p>
                </div>
                <div className="w-12 h-12 avs-gradient rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="avs-card border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Pending Approvals
                  </p>
                  <p className="text-3xl font-bold text-[#F77F00]">
                    {stats.pendingApprovals}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-[#F77F00] to-[#E63946] rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="avs-card border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Approved Users</p>
                  <p className="text-3xl font-bold text-[#2A9D8F]">
                    {stats.approvedUsers}
                  </p>
                </div>
                <div className="w-12 h-12 avs-gradient-secondary rounded-lg flex items-center justify-center">
                  <UserCheck className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {MATRIMONIAL_ENABLED && (
            <Card className="avs-card border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      Active Matrimony
                    </p>
                    <p className="text-3xl font-bold text-[#7209B7]">
                      {stats.activeMatrimony}
                    </p>
                  </div>
                  <div className="w-12 h-12 avs-gradient-purple rounded-lg flex items-center justify-center">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="avs-card border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Relationships</p>
                  <p className="text-3xl font-bold text-[#4361EE]">
                    {stats.totalRelationships}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-[#2A9D8F] to-[#4361EE] rounded-lg flex items-center justify-center">
                  <TreePine className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {EVENT_ENABLED && (
            <Card className="avs-card border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Events</p>
                    <p className="text-3xl font-bold text-[#E63946]">
                      {stats.totalEvents}
                    </p>
                  </div>
                  <div className="w-12 h-12 avs-gradient rounded-lg flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Pending Approvals Table */}
        <Card className="avs-card border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-[#F77F00]" />
                  Pending User Approvals
                </CardTitle>
                <CardDescription>
                  Review and approve new user registrations
                </CardDescription>
              </div>

              {selectedUsers.length > 0 && (
                <div className="flex gap-2">
                  <Badge
                    variant="outline"
                    className="text-blue-700 border-blue-300"
                  >
                    {selectedUsers.length} selected
                  </Badge>
                  <Button
                    size="sm"
                    onClick={handleBulkApprove}
                    disabled={bulkActionLoading}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve Selected
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleBulkReject}
                    disabled={bulkActionLoading}
                    className="border-red-300 text-red-700 hover:bg-red-50"
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject Selected
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {pendingUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <UserCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No pending approvals</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <input
                          type="checkbox"
                          checked={
                            selectedUsers.length === pendingUsers.length &&
                            pendingUsers.length > 0
                          }
                          onChange={handleSelectAll}
                          className="h-4 w-4 rounded border-gray-300 text-[#E63946] focus:ring-[#E63946] cursor-pointer"
                        />
                      </TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Verification</TableHead>
                      <TableHead>Registered</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingUsers.map((user) => (
                      <TableRow
                        key={user._id}
                        className={
                          selectedUsers.includes(user._id) ? "bg-blue-50" : ""
                        }
                      >
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user._id)}
                            onChange={() => handleSelectUser(user._id)}
                            className="h-4 w-4 rounded border-gray-300 text-[#E63946] focus:ring-[#E63946] cursor-pointer"
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {user.firstName} {user.lastName}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {user.email && <div>{user.email}</div>}
                            {user.mobile && <div>{user.mobile}</div>}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {user.isEmailVerified && (
                              <Badge
                                variant="outline"
                                className="text-green-700 border-green-300"
                              >
                                Email ✓
                              </Badge>
                            )}
                            {user.isMobileVerified && (
                              <Badge
                                variant="outline"
                                className="text-green-700 border-green-300"
                              >
                                Mobile ✓
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(user.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleApproveUser(user._id)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRejectUser(user._id)}
                              className="border-red-300 text-red-700 hover:bg-red-50"
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          <Card className="avs-card border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Users className="h-5 w-5 mr-2 text-[#E63946]" />
                All Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                View and manage all registered users
              </p>
              <Link href="/admin/users">
                <Button className="w-full" variant="outline">
                  Manage Users
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="avs-card border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <TrendingUp className="h-5 w-5 mr-2 text-[#2A9D8F]" />
                Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                View analytics and community reports
              </p>
              <Link href="/admin/reports">
                <Button className="w-full" variant="outline">
                  View Reports
                </Button>
              </Link>
            </CardContent>
          </Card>

          {EVENT_ENABLED && (
            <Card className="avs-card border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Calendar className="h-5 w-5 mr-2 text-[#7209B7]" />
                  Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Create and manage community events
                </p>
                <Link href="/admin/events">
                  <Button className="w-full" variant="outline">
                    Manage Events
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          <Card className="avs-card border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <TreePine className="h-5 w-5 mr-2 text-[#4361EE]" />
                Gothiram
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Manage gothiram dropdown values
              </p>
              <Link href="/admin/gothiram">
                <Button className="w-full" variant="outline">
                  Manage Gothiram
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
