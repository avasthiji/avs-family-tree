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
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminLoader } from "@/components/ui/loader";
import AppHeader from "@/components/AppHeader";
import { MATRIMONIAL_ENABLED } from "@/lib/features";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Users,
  UserCheck,
  UserX,
  Search,
  CheckCircle,
  XCircle,
  Crown,
  Heart,
  Mail,
  Phone,
  MapPin,
  Building2,
  Calendar,
  Filter,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Shield,
  User as UserIcon,
  ChevronDown,
  X,
  Trash2,
  AlertCircle,
} from "lucide-react";
import UserDetailsModal from "@/components/UserDetailsModal";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  mobile?: string;
  role: string;
  isEmailVerified: boolean;
  isMobileVerified: boolean;
  isApprovedByAdmin: boolean;
  enableMarriageFlag: boolean;
  createdAt: string;
  gothiram?: string;
  nativePlace?: string;
  city?: string;
  approvedBy?: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  deletedAt?: string | null;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  limit: number;
}

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "approved" | "pending"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    limit: 50,
  });
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [userCounts, setUserCounts] = useState({
    all: 0,
    approved: 0,
    pending: 0,
  });
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

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

    fetchUsers();
    fetchUserCounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status, router, statusFilter, pagination.currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        status: statusFilter,
        page: pagination.currentPage.toString(),
        limit: pagination.limit.toString(),
      });

      if (searchQuery) {
        params.append("search", searchQuery);
      }

      const response = await fetch(`/api/admin/users?${params}`);

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  const fetchUserCounts = async () => {
    try {
      const allParams = new URLSearchParams({ status: "all", limit: "1" });
      const approvedParams = new URLSearchParams({
        status: "approved",
        limit: "1",
      });
      const pendingParams = new URLSearchParams({
        status: "pending",
        limit: "1",
      });

      if (searchQuery && searchQuery.trim()) {
        allParams.append("search", searchQuery.trim());
        approvedParams.append("search", searchQuery.trim());
        pendingParams.append("search", searchQuery.trim());
      }

      // Fetch counts for all categories in parallel
      const [allResponse, approvedResponse, pendingResponse] =
        await Promise.all([
          fetch(`/api/admin/users?${allParams}`),
          fetch(`/api/admin/users?${approvedParams}`),
          fetch(`/api/admin/users?${pendingParams}`),
        ]);

      if (allResponse.ok && approvedResponse.ok && pendingResponse.ok) {
        const allData = await allResponse.json();
        const approvedData = await approvedResponse.json();
        const pendingData = await pendingResponse.json();

        setUserCounts({
          all: allData.pagination.totalUsers,
          approved: approvedData.pagination.totalUsers,
          pending: pendingData.pagination.totalUsers,
        });
      }
    } catch (error) {
      console.error("Error fetching user counts:", error);
    }
  };

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    fetchUsers();
    fetchUserCounts(); // Update counts based on search
  };

  const handleClearSearch = async () => {
    setSearchQuery("");
    setPagination((prev) => ({ ...prev, currentPage: 1 }));

    // Fetch without search query
    try {
      setLoading(true);

      // Fetch users without search
      const params = new URLSearchParams({
        status: statusFilter,
        page: "1",
        limit: pagination.limit.toString(),
      });

      const response = await fetch(`/api/admin/users?${params}`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
        setPagination(data.pagination);
      }

      // Fetch counts without search
      const allParams = new URLSearchParams({ status: "all", limit: "1" });
      const approvedParams = new URLSearchParams({
        status: "approved",
        limit: "1",
      });
      const pendingParams = new URLSearchParams({
        status: "pending",
        limit: "1",
      });

      const [allResponse, approvedResponse, pendingResponse] =
        await Promise.all([
          fetch(`/api/admin/users?${allParams}`),
          fetch(`/api/admin/users?${approvedParams}`),
          fetch(`/api/admin/users?${pendingParams}`),
        ]);

      if (allResponse.ok && approvedResponse.ok && pendingResponse.ok) {
        const allData = await allResponse.json();
        const approvedData = await approvedResponse.json();
        const pendingData = await pendingResponse.json();

        setUserCounts({
          all: allData.pagination.totalUsers,
          approved: approvedData.pagination.totalUsers,
          pending: pendingData.pagination.totalUsers,
        });
      }
    } catch (error) {
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
        const data = await response.json();
        toast.success(
          `${data.user.firstName} ${data.user.lastName} has been approved! An email notification has been sent.`
        );
        fetchUsers();
        fetchUserCounts(); // Update counts after approval
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
    if (!confirm("Are you sure you want to reject and delete this user?"))
      return;

    try {
      const response = await fetch(`/api/admin/users/${userId}/reject`, {
        method: "POST",
      });

      if (response.ok) {
        toast.success(
          "User has been rejected and removed. An email notification has been sent."
        );
        fetchUsers();
        fetchUserCounts(); // Update counts after rejection
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
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((user) => user._id));
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
      fetchUsers();
      fetchUserCounts(); // Update counts after bulk approval
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
      fetchUsers();
      fetchUserCounts(); // Update counts after bulk rejection
    } catch (error) {
      console.error("Error rejecting users:", error);
      toast.error("An error occurred while rejecting users");
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
  };

  const handleChangeRole = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        fetchUsers();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to update role");
      }
    } catch (error) {
      console.error("Error changing user role:", error);
      alert("Failed to update role");
    }
  };

  const handleBulkMakeAdmin = async () => {
    if (selectedUsers.length === 0) return;

    if (
      !confirm(
        `Are you sure you want to make ${selectedUsers.length} user(s) admin?`
      )
    )
      return;

    setBulkActionLoading(true);
    try {
      await Promise.all(
        selectedUsers.map((userId) =>
          fetch(`/api/admin/users/${userId}/role`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ role: "admin" }),
          })
        )
      );
      setSelectedUsers([]);
      fetchUsers();
    } catch (error) {
      console.error("Error promoting users:", error);
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleBulkMakeUser = async () => {
    if (selectedUsers.length === 0) return;

    if (
      !confirm(
        `Are you sure you want to change ${selectedUsers.length} user(s) to regular user role?`
      )
    )
      return;

    setBulkActionLoading(true);
    try {
      await Promise.all(
        selectedUsers.map((userId) =>
          fetch(`/api/admin/users/${userId}/role`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ role: "user" }),
          })
        )
      );
      setSelectedUsers([]);
      fetchUsers();
    } catch (error) {
      console.error("Error changing users:", error);
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to delete ${userName}? This will remove them from all relationships.`))
      return;

    try {
      const response = await fetch(`/api/admin/users/${userId}/delete`, {
        method: "POST",
      });

      if (response.ok) {
        toast.success("User deleted successfully and removed from all relationships");
        fetchUsers();
        fetchUserCounts();
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("An error occurred while deleting the user");
    }
  };

  const handleApprovedByClick = (userId: string) => {
    setSelectedUserId(userId);
    setIsUserModalOpen(true);
  };

  if (status === "loading" || initialLoading) {
    return <AdminLoader text="Loading users..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] via-white to-[#F8F9FA]">
      <AppHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <Users className="h-8 w-8 mr-3 text-[#E63946]" />
            User Management
          </h1>
          <p className="text-gray-600">
            Manage all registered users and their permissions
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="avs-card border-0 shadow-lg mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Search by name, email, or mobile..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    className="pl-10 pr-10"
                  />
                </div>
              </div>
              <Button onClick={handleSearch} className="avs-button-primary">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Button onClick={fetchUsers} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Status Tabs */}
        <Tabs
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as any)}
          className="mb-8"
        >
          <TabsList className="grid w-full md:w-auto grid-cols-3 gap-2">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              All Users ({userCounts.all})
            </TabsTrigger>
            <TabsTrigger value="approved" className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              Approved ({userCounts.approved})
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <UserX className="h-4 w-4" />
              Pending ({userCounts.pending})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={statusFilter} className="mt-6">
            <Card className="avs-card border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>
                      {statusFilter === "all" && "All Users"}
                      {statusFilter === "approved" && "Approved Users"}
                      {statusFilter === "pending" && "Pending Approvals"}
                    </CardTitle>
                    <CardDescription>
                      {statusFilter === "all" &&
                        "Complete list of all registered users"}
                      {statusFilter === "approved" && "Users approved by admin"}
                      {statusFilter === "pending" &&
                        "Users awaiting admin approval"}
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
                      {statusFilter === "pending" && (
                        <>
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
                            className="border-red-300 text-red-700 hover:bg-red-100 hover:border-red-400 hover:text-red-800"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject Selected
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        onClick={handleBulkMakeAdmin}
                        disabled={bulkActionLoading}
                        className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white"
                      >
                        <Crown className="h-4 w-4 mr-1" />
                        Make Admin
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleBulkMakeUser}
                        disabled={bulkActionLoading}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        <UserIcon className="h-4 w-4 mr-1" />
                        Make User
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
                {!loading && users.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No users found</p>
                    <p className="text-sm">
                      Try adjusting your filters or search query
                    </p>
                  </div>
                ) : users.length > 0 ? (
                  <>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12">
                              <input
                                type="checkbox"
                                checked={
                                  selectedUsers.length === users.length &&
                                  users.length > 0
                                }
                                onChange={handleSelectAll}
                                className="h-4 w-4 rounded border-gray-300 text-[#E63946] focus:ring-[#E63946] cursor-pointer"
                              />
                            </TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Status</TableHead>
                            {(statusFilter === "all" || statusFilter === "approved") && (
                              <TableHead>Approved By</TableHead>
                            )}
                            <TableHead>Joined</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {users.map((user) => (
                            <TableRow
                              key={user._id}
                              className={
                                selectedUsers.includes(user._id)
                                  ? "bg-blue-50"
                                  : ""
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
                              <TableCell>
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {user.firstName} {user.lastName}
                                  </p>
                                  {user.gothiram && (
                                    <p className="text-xs text-gray-500">
                                      {user.gothiram}
                                    </p>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  {user.email && (
                                    <div className="flex items-center gap-1 mb-1">
                                      <Mail className="h-3 w-3 text-gray-400" />
                                      <span className="text-xs">
                                        {user.email}
                                      </span>
                                      {user.isEmailVerified ? (
                                        <CheckCircle className="h-3 w-3 text-green-600" />
                                      ) : (
                                        <AlertCircle className="h-3 w-3 text-yellow-600" />
                                      )}
                                    </div>
                                  )}
                                  {user.mobile && (
                                    <div className="flex items-center gap-1">
                                      <Phone className="h-3 w-3 text-gray-400" />
                                      <span className="text-xs">
                                        {user.mobile}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                {user.isApprovedByAdmin ? (
                                  <Badge className="bg-green-100 text-green-800 border-green-300">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Approved
                                  </Badge>
                                ) : (
                                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                                    <UserX className="w-3 h-3 mr-1" />
                                    Pending
                                  </Badge>
                                )}
                              </TableCell>
                              {(statusFilter === "all" || statusFilter === "approved") && (
                                <TableCell>
                                  {user.approvedBy ? (
                                    <button
                                      onClick={() => handleApprovedByClick(user.approvedBy!._id)}
                                      className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium cursor-pointer"
                                    >
                                      {user.approvedBy.firstName} {user.approvedBy.lastName}
                                    </button>
                                  ) : (
                                    <span className="text-gray-400 text-sm">N/A</span>
                                  )}
                                </TableCell>
                              )}
                              <TableCell>
                                <div className="flex items-center gap-1 text-xs text-gray-600">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(
                                    user.createdAt
                                  ).toLocaleDateString()}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  {user._id !== session?.user.id && (
                                    <>
                                      <Button
                                        size="sm"
                                        onClick={() =>
                                          handleApproveUser(user._id)
                                        }
                                        disabled={user.isApprovedByAdmin}
                                        className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                      >
                                        <CheckCircle className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() =>
                                          handleRejectUser(user._id)
                                        }
                                        disabled={user.isApprovedByAdmin}
                                        className="border-red-300 text-red-700 hover:bg-red-100 hover:border-red-400 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                      >
                                        <XCircle className="h-4 w-4" />
                                      </Button>
                                    </>
                                  )}
                                  {user._id !== session?.user.id && (
                                    <>
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="border-gray-300"
                                          >
                                            {user.role === "admin" && (
                                              <>
                                                <Crown className="h-4 w-4 mr-1 text-orange-500" />
                                                Admin
                                              </>
                                            )}
                                            {user.role === "matchmaker" && (
                                              <>
                                                <Heart className="h-4 w-4 mr-1 text-purple-500" />
                                                Matchmaker
                                              </>
                                            )}
                                            {user.role === "user" && (
                                              <>
                                                <UserIcon className="h-4 w-4 mr-1 text-gray-500" />
                                                User
                                              </>
                                            )}
                                            <ChevronDown className="h-3 w-3 ml-1" />
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                          <DropdownMenuItem
                                            onClick={() =>
                                              handleChangeRole(user._id, "admin")
                                            }
                                            disabled={user.role === "admin"}
                                          >
                                            <Crown className="h-4 w-4 mr-2 text-orange-500" />
                                            Admin
                                            {user.role === "admin" && (
                                              <CheckCircle className="h-4 w-4 ml-auto text-green-600" />
                                            )}
                                          </DropdownMenuItem>
                                          {MATRIMONIAL_ENABLED && (
                                            <DropdownMenuItem
                                              onClick={() =>
                                                handleChangeRole(
                                                  user._id,
                                                  "matchmaker"
                                                )
                                              }
                                              disabled={
                                                user.role === "matchmaker"
                                              }
                                            >
                                              <Heart className="h-4 w-4 mr-2 text-purple-500" />
                                              Matchmaker
                                              {user.role === "matchmaker" && (
                                                <CheckCircle className="h-4 w-4 ml-auto text-green-600" />
                                              )}
                                            </DropdownMenuItem>
                                          )}
                                          <DropdownMenuItem
                                            onClick={() =>
                                              handleChangeRole(user._id, "user")
                                            }
                                            disabled={user.role === "user"}
                                          >
                                            <UserIcon className="h-4 w-4 mr-2 text-gray-500" />
                                            User
                                            {user.role === "user" && (
                                              <CheckCircle className="h-4 w-4 ml-auto text-green-600" />
                                            )}
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() =>
                                          handleDeleteUser(
                                            user._id,
                                            `${user.firstName} ${user.lastName}`
                                          )
                                        }
                                        className="border-red-300 text-red-700 hover:bg-red-100 hover:border-red-400 hover:text-red-800"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                      <div className="mt-6 flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          Showing{" "}
                          {(pagination.currentPage - 1) * pagination.limit + 1}{" "}
                          to{" "}
                          {Math.min(
                            pagination.currentPage * pagination.limit,
                            pagination.totalUsers
                          )}{" "}
                          of {pagination.totalUsers} users
                        </div>
                        <div className="flex gap-2">
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
          </TabsContent>
        </Tabs>
      </div>
      <UserDetailsModal
        userId={selectedUserId}
        isOpen={isUserModalOpen}
        onClose={() => {
          setIsUserModalOpen(false);
          setSelectedUserId(null);
        }}
      />
    </div>
  );
}
