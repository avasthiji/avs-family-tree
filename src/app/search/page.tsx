"use client";

import { Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SearchBar from "@/components/SearchBar";
import Link from "next/link";
import { 
  User, 
  MapPin, 
  Briefcase,
  Heart,
  Mail,
  Phone,
  ArrowLeft,
  Search as SearchIcon
} from "lucide-react";

interface SearchResult {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  mobile?: string;
  gothiram?: string;
  nativePlace?: string;
  city?: string;
  state?: string;
  workPlace?: string;
  profilePicture?: string;
  gender?: string;
  enableMarriageFlag?: boolean;
  role?: string;
  isApprovedByAdmin?: boolean;
}

function SearchPageContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedUser, setSelectedUser] = useState<SearchResult | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push("/auth/login");
      return;
    }
  }, [session, status, router]);

  const handleSelectUser = (user: SearchResult) => {
    setSelectedUser(user);
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] via-white to-[#F8F9FA] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto avs-gradient rounded-full flex items-center justify-center mb-4 animate-pulse">
            <span className="text-white font-bold text-xl">AVS</span>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const isAdmin = session.user.role === 'admin';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] via-white to-[#F8F9FA]">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-10 h-10 avs-gradient rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">AVS</span>
              </div>
              <span className="text-xl font-bold avs-text-gradient">AVS Family Tree</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Search */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <SearchIcon className="h-8 w-8 mr-3 text-[#E63946]" />
            Search Community Members
          </h1>
          <p className="text-gray-600 mb-6">Find members by name, gothiram, or location</p>
          
          {/* Search Bar */}
          <SearchBar isAdmin={isAdmin} onSelectUser={handleSelectUser} />
        </div>

        {/* Selected User Details */}
        {selectedUser && (
          <Card className="avs-card border-0 shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>User Details</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedUser(null)}
                >
                  Clear
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                    <AvatarImage src={selectedUser.profilePicture} />
                    <AvatarFallback className="text-2xl avs-gradient text-white">
                      {selectedUser.firstName?.[0]}{selectedUser.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Details */}
                <div className="flex-1">
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {selectedUser.firstName} {selectedUser.lastName}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedUser.gender && (
                        <Badge variant="outline">{selectedUser.gender}</Badge>
                      )}
                      {selectedUser.enableMarriageFlag && (
                        <Badge className="bg-pink-100 text-pink-800">
                          <Heart className="h-3 w-3 mr-1" />
                          Matrimony Active
                        </Badge>
                      )}
                      {isAdmin && selectedUser.role === 'admin' && (
                        <Badge className="bg-red-100 text-red-800">Admin</Badge>
                      )}
                      {isAdmin && !selectedUser.isApprovedByAdmin && (
                        <Badge variant="outline" className="text-yellow-700">Pending Approval</Badge>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {selectedUser.gothiram && (
                      <div className="flex items-start gap-2">
                        <User className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600">Gothiram</p>
                          <p className="font-medium">{selectedUser.gothiram}</p>
                        </div>
                      </div>
                    )}

                    {selectedUser.nativePlace && (
                      <div className="flex items-start gap-2">
                        <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600">Native Place</p>
                          <p className="font-medium">{selectedUser.nativePlace}</p>
                        </div>
                      </div>
                    )}

                    {(selectedUser.city || selectedUser.state) && (
                      <div className="flex items-start gap-2">
                        <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600">Current Location</p>
                          <p className="font-medium">
                            {[selectedUser.city, selectedUser.state].filter(Boolean).join(', ')}
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedUser.workPlace && (
                      <div className="flex items-start gap-2">
                        <Briefcase className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600">Work Place</p>
                          <p className="font-medium">{selectedUser.workPlace}</p>
                        </div>
                      </div>
                    )}

                    {isAdmin && selectedUser.email && (
                      <div className="flex items-start gap-2">
                        <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="font-medium">{selectedUser.email}</p>
                        </div>
                      </div>
                    )}

                    {isAdmin && selectedUser.mobile && (
                      <div className="flex items-start gap-2">
                        <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600">Mobile</p>
                          <p className="font-medium">{selectedUser.mobile}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Help Text */}
        {!selectedUser && (
          <Card className="avs-card border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <SearchIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Search for Community Members</h3>
              <p className="text-gray-600 mb-4">
                Use the search bar above to find members by:
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <Badge variant="outline">Name</Badge>
                <Badge variant="outline">Gothiram</Badge>
                <Badge variant="outline">Native Place</Badge>
                <Badge variant="outline">City</Badge>
                <Badge variant="outline">Work Place</Badge>
                {isAdmin && (
                  <>
                    <Badge variant="outline">Email</Badge>
                    <Badge variant="outline">Mobile</Badge>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] via-white to-[#F8F9FA] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto avs-gradient rounded-full flex items-center justify-center mb-4 animate-pulse">
            <span className="text-white font-bold text-xl">AVS</span>
          </div>
          <p className="text-gray-600">Loading search...</p>
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
