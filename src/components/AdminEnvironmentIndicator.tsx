"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Crown, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AdminEnvironmentIndicator() {
  const pathname = usePathname();
  const { data: session } = useSession();
  
  const isAdminPath = pathname?.startsWith("/admin");
  const isAdmin = session?.user?.role === "admin";
  
  // Don't show indicator if not admin or on auth pages
  if (!isAdmin || pathname?.startsWith("/auth")) {
    return null;
  }
  
  return (
    <div className="fixed bottom-4 right-4 z-40">
      <div className={`transition-all duration-300 ${isAdminPath ? "scale-100 opacity-100" : "scale-90 opacity-60"}`}>
        <Badge 
          className={`
            px-4 py-2 text-sm font-semibold shadow-lg backdrop-blur-md
            ${isAdminPath 
              ? "bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 admin-badge-glow" 
              : "bg-white/90 text-gray-700 border border-gray-200"
            }
          `}
        >
          {isAdminPath ? (
            <>
              <Crown className="w-4 h-4 mr-2 inline" />
              Admin Mode Active
            </>
          ) : (
            <>
              <Shield className="w-4 h-4 mr-2 inline" />
              User Mode
            </>
          )}
        </Badge>
      </div>
    </div>
  );
}

