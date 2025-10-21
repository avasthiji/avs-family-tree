"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  User,
  LogOut,
  Crown,
  Heart,
  Settings,
  Shield,
  LayoutDashboard,
  Sparkles,
  ChevronDown,
  Users,
  TrendingUp,
  TreePine,
} from "lucide-react";

export default function AppHeader() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [viewMode, setViewMode] = useState<"user" | "admin">(
    pathname?.startsWith("/admin") ? "admin" : "user"
  );

  if (!session?.user) return null;

  const user = session.user;
  const isAdmin = user.role === "admin";
  const isMatchmaker = user.role === "matchmaker";

  const getInitials = (firstName: string, lastName?: string) => {
    return `${firstName.charAt(0)}${lastName?.charAt(0) || ""}`.toUpperCase();
  };

  const handleModeSwitch = (mode: "user" | "admin") => {
    setViewMode(mode);
    if (mode === "admin") {
      router.push("/admin/dashboard");
    } else {
      router.push("/dashboard");
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/auth/login" });
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-3 group">
            <div className="rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <Logo size="md" className="rounded-xl" />
            </div>
            <div>
              <span className="text-xl font-bold avs-text-gradient block">
                AVS Family Tree
              </span>
              <span className="text-xs text-gray-500">
                அகில இந்திய வேளாளர் சங்கம்
              </span>
            </div>
          </Link>

          {/* Right Side - Profile & Actions */}
          <div className="flex items-center space-x-4">
            {/* Mode Switcher for Admin */}
            {isAdmin && (
              <div className="hidden md:flex items-center gap-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-1 border border-gray-200">
                <button
                  onClick={() => handleModeSwitch("user")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                    viewMode === "user"
                      ? "bg-white text-gray-900 shadow-md"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <User className="w-4 h-4" />
                  User View
                </button>
                <button
                  onClick={() => handleModeSwitch("admin")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                    viewMode === "admin"
                      ? "bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-md"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Crown className="w-4 h-4" />
                  Admin View
                </button>
              </div>
            )}

            {/* Role Badge */}
            {isAdmin && (
              <Badge className="hidden sm:flex items-center gap-1 bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 shadow-md px-3 py-1">
                <Crown className="w-3 h-3" />
                Administrator
              </Badge>
            )}
            {isMatchmaker && (
              <Badge className="hidden sm:flex items-center gap-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-md px-3 py-1">
                <Heart className="w-3 h-3" />
                Matchmaker
              </Badge>
            )}

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-12 rounded-xl hover:bg-gray-100 px-3 py-2 transition-all duration-300 hover:shadow-md"
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-9 w-9 border-2 border-white shadow-lg ring-2 ring-gray-200">
                      <AvatarFallback className="avs-gradient text-white font-semibold text-sm">
                        {getInitials(user.firstName, user.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-semibold text-gray-900 leading-tight">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-gray-500 leading-tight">
                        {user.email || user.mobile}
                      </p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-72 p-2 shadow-2xl border border-gray-200 rounded-xl"
              >
                {/* Profile Header */}
                <div className="px-3 py-4 bg-gradient-to-br from-gray-50 to-white rounded-lg mb-2">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12 border-2 border-white shadow-lg ring-2 ring-gray-200">
                      <AvatarFallback className="avs-gradient text-white font-semibold">
                        {getInitials(user.firstName, user.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email || user.mobile}
                      </p>
                      <div className="flex gap-1 mt-1">
                        {user.isEmailVerified && (
                          <Badge
                            variant="outline"
                            className="text-xs px-1.5 py-0 h-5 text-green-700 border-green-300"
                          >
                            Email ✓
                          </Badge>
                        )}
                        {/* {user.isMobileVerified && (
                          <Badge variant="outline" className="text-xs px-1.5 py-0 h-5 text-green-700 border-green-300">
                            Mobile ✓
                          </Badge>
                        )} */}
                      </div>
                    </div>
                  </div>
                </div>

                <DropdownMenuLabel className="text-xs text-gray-500 px-3">
                  Quick Actions
                </DropdownMenuLabel>

                <DropdownMenuItem asChild>
                  <Link
                    href="/dashboard"
                    className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <LayoutDashboard className="mr-3 h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium">Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/profile"
                    className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <User className="mr-3 h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium">My Profile</span>
                  </Link>
                </DropdownMenuItem>

                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="text-xs text-gray-500 px-3">
                      Admin Tools
                    </DropdownMenuLabel>

                    <DropdownMenuItem asChild>
                      <Link
                        href="/admin/reports"
                        className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <TrendingUp className="mr-3 h-4 w-4 text-gray-600" />
                        <span className="text-sm font-medium">Reports</span>
                      </Link>
                    </DropdownMenuItem>

                    {/* hide for now */}
                    {/* <DropdownMenuItem asChild>
                      <Link
                        href="/admin/gothiram"
                        className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <TreePine className="mr-3 h-4 w-4 text-gray-600" />
                        <span className="text-sm font-medium">
                          Manage Gothiram
                        </span>
                      </Link>
                    </DropdownMenuItem> */}
                  </>
                )}

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center px-3 py-2 cursor-pointer hover:bg-red-50 rounded-lg transition-colors text-red-600"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  <span className="text-sm font-medium">Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
