"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
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
import UserProfileModal from "@/components/UserProfileModal";
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { AdminLoader } from "@/components/ui/loader";
import { toast } from "sonner";

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
  isApprovedByAdmin?: boolean;
  role?: string;
}

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isInitialMount = useRef(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    pendingApprovals: 0,
    approvedUsers: 0,
    activeMatrimony: 0,
    totalRelationships: 0,
    totalEvents: 0,
  });
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [userFilter, setUserFilter] = useState<"all" | "pending" | "approved">(
    "pending"
  );
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    limit: 25,
  });
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileUserId, setProfileUserId] = useState<string | null>(null);

  const handleViewProfile = (userId: string) => {
    setProfileUserId(userId);
    setProfileModalOpen(true);
  };

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
    isInitialMount.current = false;
  }, [session, status, router]);

  // Refetch users when filter changes (but not on initial mount)
  useEffect(() => {
    if (
      !isInitialMount.current &&
      session?.user?.role === "admin" &&
      status !== "loading"
    ) {
      setLoading(true);
      fetchDashboardData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userFilter]);

  // Refetch users when page changes (but not on initial mount)
  useEffect(() => {
    if (
      !isInitialMount.current &&
      session?.user?.role === "admin" &&
      status !== "loading"
    ) {
      setLoading(true);
      fetchDashboardData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.currentPage]);

  const fetchDashboardData = async () => {
    try {
      // Determine which endpoint to use based on filter
      let usersEndpoint = "/api/admin/users/pending";
      if (userFilter === "all") {
        usersEndpoint = `/api/admin/users?page=${pagination.currentPage}&limit=${pagination.limit}`;
      } else if (userFilter === "approved") {
        usersEndpoint = `/api/admin/users?status=approved&page=${pagination.currentPage}&limit=${pagination.limit}`;
      } else {
        // For pending, we need to add pagination params
        usersEndpoint = `/api/admin/users?status=pending&page=${pagination.currentPage}&limit=${pagination.limit}`;
      }

      const [statsRes, usersRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch(usersEndpoint),
      ]);

      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data.stats);
      }

      if (usersRes.ok) {
        const data = await usersRes.json();
        setPendingUsers(data.users);
        // Update pagination if available
        if (data.pagination) {
          setPagination({
            currentPage: data.pagination.currentPage,
            totalPages: data.pagination.totalPages,
            totalUsers: data.pagination.totalUsers,
            limit: data.pagination.limit,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  const handleApproveUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/approve`, {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(
          `${data.user.firstName} ${data.user.lastName} has been approved! An email notification has been sent.`
        );

        // If we're on a page that becomes empty after approval, go to previous page
        if (pendingUsers.length === 1 && pagination.currentPage > 1) {
          setPagination((prev) => ({
            ...prev,
            currentPage: prev.currentPage - 1,
          }));
        } else {
          fetchDashboardData();
        }
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to approve user");
      }
    } catch (error) {
      console.error("Error approving user:", error);
      toast.error("An error occurred while approving the user");
    }
  };

  const handleRejectUser = async (userId: string) => {
    if (!confirm("Are you sure you want to reject this user?")) return;

    try {
      const response = await fetch(`/api/admin/users/${userId}/reject`, {
        method: "POST",
      });

      if (response.ok) {
        toast.success(
          "User has been rejected and removed. An email notification has been sent."
        );

        // If we're on a page that becomes empty after rejection, go to previous page
        if (pendingUsers.length === 1 && pagination.currentPage > 1) {
          setPagination((prev) => ({
            ...prev,
            currentPage: prev.currentPage - 1,
          }));
        } else {
          fetchDashboardData();
        }
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to reject user");
      }
    } catch (error) {
      console.error("Error rejecting user:", error);
      toast.error("An error occurred while rejecting the user");
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

      toast.success(
        `${selectedUsers.length} user(s) have been approved! Email notifications have been sent.`
      );
      setSelectedUsers([]);

      // If we're approving all users on the current page, go to previous page
      if (
        selectedUsers.length === pendingUsers.length &&
        pagination.currentPage > 1
      ) {
        setPagination((prev) => ({
          ...prev,
          currentPage: prev.currentPage - 1,
        }));
      } else {
        fetchDashboardData();
      }
    } catch (error) {
      console.error("Error approving users:", error);
      toast.error("An error occurred while approving users");
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

      toast.success(
        `${selectedUsers.length} user(s) have been rejected and removed. Email notifications have been sent.`
      );
      setSelectedUsers([]);

      // If we're rejecting all users on the current page, go to previous page
      if (
        selectedUsers.length === pendingUsers.length &&
        pagination.currentPage > 1
      ) {
        setPagination((prev) => ({
          ...prev,
          currentPage: prev.currentPage - 1,
        }));
      } else {
        fetchDashboardData();
      }
    } catch (error) {
      console.error("Error rejecting users:", error);
      toast.error("An error occurred while rejecting users");
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleCardClick = (filter: "all" | "pending" | "approved") => {
    setUserFilter(filter);
    setSelectedUsers([]); // Clear selection when changing filter
    setPagination((prev) => ({ ...prev, currentPage: 1 })); // Reset to page 1
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
    setSelectedUsers([]); // Clear selection when changing page
  };

  if (status === "loading" || initialLoading) {
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
                  <SearchBar
                    isAdmin={true}
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

        {/* Statistics Cards */}
        <div
          className={`grid md:grid-cols-2 lg:grid-cols-${
            MATRIMONIAL_ENABLED ? 3 : 4
          } gap-6 mb-8`}
        >
          <Card
            className={`avs-card border-0 shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${
              userFilter === "all" ? "ring-2 ring-[#E63946]" : ""
            }`}
            onClick={() => handleCardClick("all")}
          >
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

          <Card
            className={`avs-card border-0 shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${
              userFilter === "pending" ? "ring-2 ring-[#F77F00]" : ""
            }`}
            onClick={() => handleCardClick("pending")}
          >
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

          <Card
            className={`avs-card border-0 shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${
              userFilter === "approved" ? "ring-2 ring-[#2A9D8F]" : ""
            }`}
            onClick={() => handleCardClick("approved")}
          >
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

        {/* Users Table */}
        <Card className="avs-card border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  {userFilter === "all" && (
                    <>
                      <Users className="h-5 w-5 mr-2 text-[#E63946]" />
                      All Users
                    </>
                  )}
                  {userFilter === "pending" && (
                    <>
                      <Clock className="h-5 w-5 mr-2 text-[#F77F00]" />
                      Pending User Approvals
                    </>
                  )}
                  {userFilter === "approved" && (
                    <>
                      <UserCheck className="h-5 w-5 mr-2 text-[#2A9D8F]" />
                      Approved Users
                    </>
                  )}
                </CardTitle>
                <CardDescription>
                  {userFilter === "all" &&
                    "View all registered users in the system"}
                  {userFilter === "pending" &&
                    "Review and approve new user registrations"}
                  {userFilter === "approved" &&
                    "View all approved and active users"}
                </CardDescription>
              </div>

              {selectedUsers.length > 0 && userFilter === "pending" && (
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
            {loading && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex items-center justify-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#E63946]"></div>
                <span className="text-sm text-gray-700 font-medium">
                  Loading users...
                </span>
              </div>
            )}
            {!loading && pendingUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {userFilter === "all" && (
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                )}
                {userFilter === "pending" && (
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                )}
                {userFilter === "approved" && (
                  <UserCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                )}
                <p>
                  {userFilter === "all" && "No users found"}
                  {userFilter === "pending" && "No pending approvals"}
                  {userFilter === "approved" && "No approved users"}
                </p>
              </div>
            ) : !loading && pendingUsers.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {userFilter === "pending" && (
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
                        )}
                        <TableHead>Name</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Verification</TableHead>
                        {userFilter !== "pending" && (
                          <TableHead>Status</TableHead>
                        )}
                        <TableHead>Registered</TableHead>
                        {userFilter === "pending" && (
                          <TableHead>Actions</TableHead>
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingUsers.map((user) => (
                        <TableRow
                          key={user._id}
                          className={
                            selectedUsers.includes(user._id) &&
                            userFilter === "pending"
                              ? "bg-blue-50"
                              : ""
                          }
                        >
                          {userFilter === "pending" && (
                            <TableCell>
                              <input
                                type="checkbox"
                                checked={selectedUsers.includes(user._id)}
                                onChange={() => handleSelectUser(user._id)}
                                className="h-4 w-4 rounded border-gray-300 text-[#E63946] focus:ring-[#E63946] cursor-pointer"
                              />
                            </TableCell>
                          )}
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
                          {userFilter !== "pending" && (
                            <TableCell>
                              {user.isApprovedByAdmin ? (
                                <Badge className="bg-green-100 text-green-800 border-green-300">
                                  Approved
                                </Badge>
                              ) : (
                                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                                  Pending
                                </Badge>
                              )}
                            </TableCell>
                          )}
                          <TableCell>
                            {new Date(user.createdAt).toLocaleDateString()}
                          </TableCell>
                          {userFilter === "pending" && (
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
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="mt-6 flex items-center justify-between border-t pt-4">
                    <div className="text-sm text-gray-600">
                      Showing{" "}
                      <span className="font-medium">
                        {(pagination.currentPage - 1) * pagination.limit + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-medium">
                        {Math.min(
                          pagination.currentPage * pagination.limit,
                          pagination.totalUsers
                        )}
                      </span>{" "}
                      of{" "}
                      <span className="font-medium">
                        {pagination.totalUsers}
                      </span>{" "}
                      users
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handlePageChange(pagination.currentPage - 1)
                        }
                        disabled={pagination.currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </Button>
                      <div className="flex items-center gap-2">
                        {Array.from(
                          { length: Math.min(5, pagination.totalPages) },
                          (_, i) => {
                            let pageNum;
                            if (pagination.totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (pagination.currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (
                              pagination.currentPage >=
                              pagination.totalPages - 2
                            ) {
                              pageNum = pagination.totalPages - 4 + i;
                            } else {
                              pageNum = pagination.currentPage - 2 + i;
                            }

                            return (
                              <Button
                                key={pageNum}
                                variant={
                                  pagination.currentPage === pageNum
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                onClick={() => handlePageChange(pageNum)}
                                className={
                                  pagination.currentPage === pageNum
                                    ? "avs-button-primary"
                                    : ""
                                }
                              >
                                {pageNum}
                              </Button>
                            );
                          }
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handlePageChange(pagination.currentPage + 1)
                        }
                        disabled={
                          pagination.currentPage === pagination.totalPages
                        }
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : null}
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

      {/* User Profile Modal */}
      <UserProfileModal
        userId={profileUserId}
        open={profileModalOpen}
        onOpenChange={setProfileModalOpen}
      />
    </div>
  );
}
