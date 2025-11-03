"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Briefcase,
  DollarSign,
  Home,
  Heart,
  Users,
  Star,
  X,
  Clock,
  TreePine,
  FileText,
} from "lucide-react";
import D3FamilyTree from "@/components/D3FamilyTree";

interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  role: string;
  isEmailVerified: boolean;
  isMobileVerified: boolean;
  isApprovedByAdmin: boolean;
  gender: string;
  dob: string;
  deathday?: string;
  placeOfBirth: string;
  timeOfBirth: string;
  height: number;
  rasi: string;
  natchathiram: string;
  gothiram: string;
  primaryPhone: string;
  secondaryPhone?: string;
  qualification: string;
  jobDesc: string;
  salary: string;
  bioDesc: string;
  partnerDesc?: string;
  workPlace: string;
  nativePlace: string;
  address1: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  citizenship: string;
  kuladeivam: string;
  enableMarriageFlag: boolean;
  matchMakerId?: string;
  matchMaker?: {
    _id: string;
    firstName: string;
    lastName: string;
    gothiram?: string;
    nativePlace?: string;
    city?: string;
    profilePicture?: string;
    primaryPhone?: string;
    secondaryPhone?: string;
  };
  profilePicture: string;
  createdAt: string;
  updatedAt: string;
}

interface UserDetailsModalProps {
  userId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function UserDetailsModal({
  userId,
  isOpen,
  onClose,
}: UserDetailsModalProps) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("details");
  const [relationships, setRelationships] = useState<any[]>([]);
  const [treeLoading, setTreeLoading] = useState(false);

  useEffect(() => {
    if (userId && isOpen) {
      fetchUserProfile();
      if (activeTab === "family-tree") {
        fetchRelationships();
      }
    }
  }, [userId, isOpen, activeTab]);

  const fetchUserProfile = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/users/profile?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setUserProfile(data.user);
      } else {
        setError("Failed to fetch user profile");
      }
    } catch (err) {
      setError("Error loading user profile");
      console.error("Error fetching user profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "N/A";
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  const getAge = (dobString: string | null | undefined) => {
    if (!dobString) return "N/A";
    try {
      const dob = new Date(dobString);
      if (isNaN(dob.getTime())) return "N/A";
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < dob.getDate())
      ) {
        age--;
      }
      return age;
    } catch {
      return "N/A";
    }
  };

  const displayValue = (value: string | null | undefined, suffix: string = "") => {
    if (!value) return "N/A";
    return `${value}${suffix}`;
  };

  const displayNumber = (value: number | null | undefined, suffix: string = "") => {
    if (value === null || value === undefined) return "N/A";
    return `${value}${suffix}`;
  };

  const fetchRelationships = async () => {
    if (!userId) return;
    setTreeLoading(true);
    try {
      const response = await fetch(`/api/relationships?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setRelationships(data.relationships || []);
      } else {
        console.error("Failed to fetch relationships");
      }
    } catch (err) {
      console.error("Error fetching relationships:", err);
    } finally {
      setTreeLoading(false);
    }
  };

  const handleNodeClick = (clickedUserId: string) => {
    // Close current modal and let parent handle opening with new userId
    // The parent component will detect the userId change and reopen the modal
    if (onClose) {
      onClose();
      // Use a small timeout to allow the close animation, then trigger parent update
      setTimeout(() => {
        // This will be handled by parent components (family-tree page, search page)
        // They should listen for userId changes and reopen the modal
        window.dispatchEvent(new CustomEvent('userProfileNodeClick', { detail: { userId: clickedUserId } }));
      }, 100);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-7xl w-[95vw] sm:w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-2xl font-bold">
            User Profile Details
          </DialogTitle>
        </DialogHeader>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading profile...</span>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <div className="text-red-600 mb-2">❌ {error}</div>
            <Button onClick={fetchUserProfile} variant="outline">
              Try Again
            </Button>
          </div>
        )}

        {userProfile && (
          <div className="space-y-6">
            {/* Header Section */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start space-x-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage
                      src={userProfile.profilePicture}
                      alt={`${userProfile.firstName} ${userProfile.lastName}`}
                    />
                    <AvatarFallback className="text-2xl">
                      {getInitials(userProfile.firstName, userProfile.lastName)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h1 className="text-3xl font-bold text-gray-900">
                        {userProfile.firstName} {userProfile.lastName}
                      </h1>
                      <Badge
                        variant={
                          userProfile.isApprovedByAdmin
                            ? "default"
                            : "secondary"
                        }
                      >
                        {userProfile.isApprovedByAdmin ? "Approved" : "Pending"}
                      </Badge>
                    </div>

                    <div className="flex items-center space-x-4 text-gray-600 mb-4">
                      <span className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {displayValue(userProfile.gender)} • Age {getAge(userProfile.dob)}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {(() => {
                          const city = userProfile.city || "";
                          const state = userProfile.state || "";
                          const location = [city, state].filter(Boolean).join(", ");
                          return location || "N/A";
                        })()}
                      </span>
                    </div>

                    {userProfile.bioDesc && (
                      <p className="text-gray-700 leading-relaxed">
                        {userProfile.bioDesc}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="details" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Details
                </TabsTrigger>
                <TabsTrigger value="family-tree" className="flex items-center gap-2">
                  <TreePine className="h-4 w-4" />
                  Family Tree
                </TabsTrigger>
              </TabsList>

              {/* Details Tab */}
              <TabsContent value="details" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="h-5 w-5 mr-2" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <div>
                      <span className="text-sm text-gray-600">Email</span>
                      <div className="flex items-center space-x-2">
                        <span>{displayValue(userProfile.email)}</span>
                        <Badge
                          variant={
                            userProfile.isEmailVerified
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {userProfile.isEmailVerified
                            ? "Verified"
                            : "Unverified"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <div>
                      <span className="text-sm text-gray-600">Mobile</span>
                      <div className="flex items-center space-x-2">
                        <span>{displayValue(userProfile.mobile)}</span>
                        <Badge
                          variant={
                            userProfile.isMobileVerified
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {userProfile.isMobileVerified
                            ? "Verified"
                            : "Unverified"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <div>
                      <span className="text-sm text-gray-600">Primary Phone</span>
                      <div>{displayValue(userProfile.primaryPhone)}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <div>
                      <span className="text-sm text-gray-600">Secondary Phone</span>
                      <div>{displayValue(userProfile.secondaryPhone)}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Home className="h-4 w-4 text-gray-500" />
                    <div>
                      <span className="text-sm text-gray-600">Address</span>
                      <div>{displayValue(userProfile.address1)}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <div>
                      <span className="text-sm text-gray-600">City</span>
                      <div>{displayValue(userProfile.city)}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <div>
                      <span className="text-sm text-gray-600">State</span>
                      <div>{displayValue(userProfile.state)}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <div>
                      <span className="text-sm text-gray-600">Postal Code</span>
                      <div>{displayValue(userProfile.postalCode)}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <div>
                      <span className="text-sm text-gray-600">Country</span>
                      <div>{displayValue(userProfile.country)}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <div>
                      <span className="text-sm text-gray-600">Citizenship</span>
                      <div>{displayValue(userProfile.citizenship)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="h-4 w-4 text-gray-500" />
                    <div>
                      <span className="text-sm text-gray-600">Gender</span>
                      <div>{displayValue(userProfile.gender)}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <span className="text-sm text-gray-600">
                        Date of Birth
                      </span>
                      <div>{formatDate(userProfile.dob)}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <span className="text-sm text-gray-600">
                        Date of Death
                      </span>
                      <div>{formatDate(userProfile.deathday)}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <div>
                      <span className="text-sm text-gray-600">
                        Place of Birth
                      </span>
                      <div>{displayValue(userProfile.placeOfBirth)}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <div>
                      <span className="text-sm text-gray-600">
                        Time of Birth
                      </span>
                      <div>{displayValue(userProfile.timeOfBirth)}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Users className="h-4 w-4 text-gray-500" />
                    <div>
                      <span className="text-sm text-gray-600">Height</span>
                      <div>{displayNumber(userProfile.height, " cm")}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <div>
                      <span className="text-sm text-gray-600">Native Place</span>
                      <div>{displayValue(userProfile.nativePlace)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Astrological Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="h-5 w-5 mr-2" />
                    Astrological Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600">
                      Rasi (Zodiac):
                    </span>
                    <Badge variant="outline">{displayValue(userProfile.rasi)}</Badge>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600">
                      Natchathiram (Star):
                    </span>
                    <Badge variant="outline">{displayValue(userProfile.natchathiram)}</Badge>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600">Gothiram:</span>
                    <Badge variant="outline">{displayValue(userProfile.gothiram)}</Badge>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600">Kuladeivam:</span>
                    <Badge variant="outline">{displayValue(userProfile.kuladeivam)}</Badge>
                  </div>

                  {/* Matrimony Profile */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <Heart className="h-4 w-4 text-pink-500" />
                      <span className="text-sm font-medium text-gray-700">Matrimony Profile</span>
                      <Badge 
                        variant={userProfile.enableMarriageFlag ? "default" : "secondary"}
                        className={userProfile.enableMarriageFlag ? "bg-pink-100 text-pink-800" : ""}
                      >
                        {userProfile.enableMarriageFlag ? "Active" : "Inactive"}
                      </Badge>
                    </div>

                    {userProfile.enableMarriageFlag && userProfile.matchMaker && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Matchmaker</p>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={userProfile.matchMaker.profilePicture} />
                            <AvatarFallback className="text-xs">
                              {userProfile.matchMaker.firstName[0]}
                              {userProfile.matchMaker.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900">
                              {userProfile.matchMaker.firstName} {userProfile.matchMaker.lastName}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              {userProfile.matchMaker.gothiram && (
                                <span className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  {userProfile.matchMaker.gothiram}
                                </span>
                              )}
                              {(userProfile.matchMaker.nativePlace || userProfile.matchMaker.city) && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {userProfile.matchMaker.nativePlace || userProfile.matchMaker.city}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {userProfile.enableMarriageFlag && (
                      <div>
                        <span className="text-sm text-gray-600 block mb-2">Partner Description</span>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">
                          {displayValue(userProfile.partnerDesc) === "N/A" ? "N/A" : (userProfile.partnerDesc || "N/A")}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Professional Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Briefcase className="h-5 w-5 mr-2" />
                    Professional Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <GraduationCap className="h-4 w-4 text-gray-500" />
                    <div>
                      <span className="text-sm text-gray-600">
                        Qualification
                      </span>
                      <div>{displayValue(userProfile.qualification)}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Briefcase className="h-4 w-4 text-gray-500" />
                    <div>
                      <span className="text-sm text-gray-600">
                        Job Description
                      </span>
                      <div>{displayValue(userProfile.jobDesc)}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <div>
                      <span className="text-sm text-gray-600">Salary</span>
                      <div>{displayValue(userProfile.salary)}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <div>
                      <span className="text-sm text-gray-600">Work Place</span>
                      <div>{displayValue(userProfile.workPlace)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
                </div>

                {/* About Me Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      About Me
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <span className="text-sm text-gray-600 block mb-2">Bio Description</span>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {displayValue(userProfile.bioDesc) === "N/A" ? "N/A" : userProfile.bioDesc}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Family Tree Tab */}
              <TabsContent value="family-tree" className="mt-6">
                {treeLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2">Loading family tree...</span>
                  </div>
                ) : relationships.length === 0 ? (
                  <div className="text-center py-12">
                    <TreePine className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No relationships found
                    </h3>
                    <p className="text-gray-600">
                      This user hasn't added any family relationships yet.
                    </p>
                  </div>
                ) : (
                  <div className="w-full" style={{ height: '750px' }}>
                    <D3FamilyTree
                      relationships={relationships}
                      currentUserId={userId || ""}
                      currentUserName={`${userProfile.firstName} ${userProfile.lastName}`}
                      onNodeClick={handleNodeClick}
                    />
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {/* Marriage Information */}
            {/* {userProfile.enableMarriageFlag && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="h-5 w-5 mr-2" />
                    Marriage Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant="default" className="mb-4">
                    Marriage Profile Active
                  </Badge>

                  {userProfile.partnerDesc && (
                    <div>
                      <span className="text-sm text-gray-600 block mb-2">
                        Partner Description
                      </span>
                      <p className="text-gray-700 leading-relaxed">
                        {userProfile.partnerDesc}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )} */}

            {/* Account Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Role</span>
                  <Badge variant="outline">{userProfile.role}</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Account Created</span>
                  <span>{formatDate(userProfile.createdAt)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last Updated</span>
                  <span>{formatDate(userProfile.updatedAt)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
