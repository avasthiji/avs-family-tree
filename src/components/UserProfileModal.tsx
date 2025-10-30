"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Heart,
  Shield,
  CheckCircle,
  Users,
  Network,
  Plus,
  TreePine,
  Loader2,
} from "lucide-react";
import FamilyTreeView from "@/components/FamilyTreeView";
import { toast } from "sonner";
import D3FamilyTree from "./D3FamilyTree";

interface UserData {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  mobile?: string;
  primaryPhone?: string;
  secondaryPhone?: string;
  gothiram?: string;
  nativePlace?: string;
  city?: string;
  state?: string;
  country?: string;
  workPlace?: string;
  jobDesc?: string;
  qualification?: string;
  profilePicture?: string;
  gender?: string;
  dob?: string;
  height?: number;
  rasi?: string;
  natchathiram?: string;
  kuladeivam?: string;
  bioDesc?: string;
  partnerDesc?: string;
  enableMarriageFlag?: boolean;
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
  role?: string;
  isApprovedByAdmin?: boolean;
  isEmailVerified?: boolean;
  isMobileVerified?: boolean;
}

interface Relationship {
  _id: string;
  personId1: any;
  personId2: any;
  relationType: string;
  isApproved: boolean;
}

interface UserProfileModalProps {
  userId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RELATIONSHIP_TYPES = [
  "Father",
  "Mother",
  "Spouse",
  "Son",
  "Daughter",
  "Brother",
  "Sister",
  "Older Sibling",
  "Younger Sibling",
  "Grand Father",
  "Grand Mother",
  "Uncle",
  "Aunt",
  "Cousin",
  "Nephew",
  "Niece",
  "Other",
];

export default function UserProfileModal({
  userId,
  open,
  onOpenChange,
}: UserProfileModalProps) {
  const { data: session } = useSession();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  // Add relationship state
  const [showAddRelationship, setShowAddRelationship] = useState(false);
  const [relationType, setRelationType] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isAdmin = session?.user?.role === "admin";

  useEffect(() => {
    if (open && userId) {
      fetchUserData();
      fetchUserRelationships();
    } else {
      // Reset state when modal closes
      setUserData(null);
      setRelationships([]);
      setActiveTab("profile");
      setShowAddRelationship(false);
      setRelationType("");
      setDescription("");
    }
  }, [open, userId]);

  const fetchUserData = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/users/profile?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setUserData(data.user);
      } else {
        toast.error("Failed to load user profile");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Error loading user profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRelationships = async () => {
    if (!userId) return;
    try {
      const response = await fetch(`/api/relationships?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setRelationships(data.relationships || []);
      }
    } catch (error) {
      console.error("Error fetching relationships:", error);
    }
  };

  const handleAddRelationship = async () => {
    if (!userId || !relationType) {
      toast.error("Please select a relationship type");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/relationships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personId2: userId,
          relationType,
          description,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Relationship added successfully!");
        setShowAddRelationship(false);
        setRelationType("");
        setDescription("");
        // Refresh relationships
        fetchUserRelationships();
      } else {
        toast.error(data.error || "Failed to add relationship");
      }
    } catch (error) {
      console.error("Error adding relationship:", error);
      toast.error("Error adding relationship");
    } finally {
      setSubmitting(false);
    }
  };

  if (!userId) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-7xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={userData?.profilePicture} />
              <AvatarFallback className="avs-gradient text-white">
                {userData?.firstName?.[0]}
                {userData?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-xl">
                {userData?.firstName} {userData?.lastName}
              </div>
              {userData?.gothiram && (
                <div className="text-sm text-gray-500 font-normal">
                  {userData.gothiram}
                </div>
              )}
            </div>
          </DialogTitle>
          <DialogDescription>
            View complete profile, family tree, and add relationships
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#E63946]" />
          </div>
        ) : (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="family-tree">
                <TreePine className="h-4 w-4 mr-2" />
                Family Tree
              </TabsTrigger>
              {/* <TabsTrigger value="add-relationship">
                <Plus className="h-4 w-4 mr-2" />
                Add Relationship
              </TabsTrigger> */}
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Profile Information</span>
                    <div className="flex gap-2">
                      {userData?.isEmailVerified && (
                        <Badge variant="outline" className="text-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Email Verified
                        </Badge>
                      )}
                      {userData?.isApprovedByAdmin && (
                        <Badge variant="outline" className="text-blue-600">
                          <Shield className="h-3 w-3 mr-1" />
                          Admin Approved
                        </Badge>
                      )}
                      {userData?.enableMarriageFlag && (
                        <Badge variant="outline" className="text-pink-600">
                          <Heart className="h-3 w-3 mr-1" />
                          Matrimony Active
                        </Badge>
                      )}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Basic Info */}
                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-3">
                      Basic Information
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      {userData?.gender && (
                        <div className="flex items-start gap-2">
                          <User className="h-5 w-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-600">Gender</p>
                            <p className="font-medium">{userData.gender}</p>
                          </div>
                        </div>
                      )}
                      {userData?.dob && (
                        <div className="flex items-start gap-2">
                          <User className="h-5 w-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-600">
                              Date of Birth
                            </p>
                            <p className="font-medium">
                              {new Date(userData.dob).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      )}
                      {userData?.height && (
                        <div className="flex items-start gap-2">
                          <User className="h-5 w-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-600">Height</p>
                            <p className="font-medium">{userData.height} cm</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contact Info - Only show to admin */}
                  {isAdmin && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-3">
                        Contact Information
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        {userData?.email && (
                          <div className="flex items-start gap-2">
                            <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-600">Email</p>
                              <p className="font-medium">{userData.email}</p>
                            </div>
                          </div>
                        )}
                        {userData?.mobile && (
                          <div className="flex items-start gap-2">
                            <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-600">Mobile</p>
                              <p className="font-medium">{userData.mobile}</p>
                            </div>
                          </div>
                        )}
                        {userData?.primaryPhone && (
                          <div className="flex items-start gap-2">
                            <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-600">
                                Primary Phone
                              </p>
                              <p className="font-medium">
                                {userData.primaryPhone}
                              </p>
                            </div>
                          </div>
                        )}
                        {userData?.secondaryPhone && (
                          <div className="flex items-start gap-2">
                            <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-600">
                                Secondary Phone
                              </p>
                              <p className="font-medium">
                                {userData.secondaryPhone}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Location */}
                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-3">
                      Location
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      {userData?.nativePlace && (
                        <div className="flex items-start gap-2">
                          <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-600">
                              Native Place
                            </p>
                            <p className="font-medium">
                              {userData.nativePlace}
                            </p>
                          </div>
                        </div>
                      )}
                      {(userData?.city || userData?.state) && (
                        <div className="flex items-start gap-2">
                          <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-600">
                              Current Location
                            </p>
                            <p className="font-medium">
                              {[userData?.city, userData?.state]
                                .filter(Boolean)
                                .join(", ")}
                            </p>
                          </div>
                        </div>
                      )}
                      {userData?.country && (
                        <div className="flex items-start gap-2">
                          <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-600">Country</p>
                            <p className="font-medium">{userData.country}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Professional */}
                  {(userData?.qualification ||
                    userData?.jobDesc ||
                    userData?.workPlace) && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-3">
                        Professional Information
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        {userData?.qualification && (
                          <div className="flex items-start gap-2">
                            <Briefcase className="h-5 w-5 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-600">
                                Qualification
                              </p>
                              <p className="font-medium">
                                {userData.qualification}
                              </p>
                            </div>
                          </div>
                        )}
                        {userData?.jobDesc && (
                          <div className="flex items-start gap-2">
                            <Briefcase className="h-5 w-5 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-600">
                                Job Description
                              </p>
                              <p className="font-medium">{userData.jobDesc}</p>
                            </div>
                          </div>
                        )}
                        {userData?.workPlace && (
                          <div className="flex items-start gap-2">
                            <Briefcase className="h-5 w-5 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-600">
                                Work Place
                              </p>
                              <p className="font-medium">
                                {userData.workPlace}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Cultural/Astrological */}
                  {(userData?.gothiram ||
                    userData?.rasi ||
                    userData?.natchathiram ||
                    userData?.kuladeivam ||
                    userData?.enableMarriageFlag !== undefined) && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-3">
                        Astrological Details
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        {userData?.gothiram && (
                          <div className="flex items-start gap-2">
                            <User className="h-5 w-5 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-600">Gothiram</p>
                              <p className="font-medium">{userData.gothiram}</p>
                            </div>
                          </div>
                        )}
                        {userData?.rasi && (
                          <div className="flex items-start gap-2">
                            <User className="h-5 w-5 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-600">Rasi</p>
                              <p className="font-medium">{userData.rasi}</p>
                            </div>
                          </div>
                        )}
                        {userData?.natchathiram && (
                          <div className="flex items-start gap-2">
                            <User className="h-5 w-5 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-600">
                                Natchathiram
                              </p>
                              <p className="font-medium">
                                {userData.natchathiram}
                              </p>
                            </div>
                          </div>
                        )}
                        {userData?.kuladeivam && (
                          <div className="flex items-start gap-2">
                            <User className="h-5 w-5 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-600">
                                Kuladeivam
                              </p>
                              <p className="font-medium">
                                {userData.kuladeivam}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Matrimony Status and Matchmaker Details */}
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-2 mb-3">
                          <Heart className="h-4 w-4 text-pink-500" />
                          <span className="text-sm text-gray-600">Matrimony Status:</span>
                          <Badge 
                            variant={userData.enableMarriageFlag ? "default" : "secondary"}
                            className={userData.enableMarriageFlag ? "bg-pink-100 text-pink-800" : ""}
                          >
                            {userData.enableMarriageFlag ? "Active" : "Inactive"}
                          </Badge>
                        </div>

                        {/* Matchmaker Details - Only show if matrimony is enabled */}
                        {userData.enableMarriageFlag && userData.matchMaker && (
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm font-medium text-gray-700 mb-2">
                              Matchmaker
                            </p>
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={userData.matchMaker.profilePicture} />
                                <AvatarFallback className="text-xs">
                                  {userData.matchMaker.firstName[0]}
                                  {userData.matchMaker.lastName[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {userData.matchMaker.firstName} {userData.matchMaker.lastName}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                  {userData.matchMaker.gothiram && (
                                    <span className="flex items-center gap-1">
                                      <User className="h-3 w-3" />
                                      {userData.matchMaker.gothiram}
                                    </span>
                                  )}
                                  {(userData.matchMaker.nativePlace || userData.matchMaker.city) && (
                                    <span className="flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      {userData.matchMaker.nativePlace || userData.matchMaker.city}
                                    </span>
                                  )}
                                </div>
                                {(userData.matchMaker.primaryPhone || userData.matchMaker.secondaryPhone) && (
                                  <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                                    {userData.matchMaker.primaryPhone && (
                                      <span className="flex items-center gap-1">
                                        <Phone className="h-3 w-3" />
                                        {userData.matchMaker.primaryPhone}
                                      </span>
                                    )}
                                    {userData.matchMaker.secondaryPhone && (
                                      <span className="flex items-center gap-1">
                                        <Phone className="h-3 w-3" />
                                        {userData.matchMaker.secondaryPhone}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Matrimony Information */}
                  {userData?.enableMarriageFlag && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-3">
                        Matrimony Information
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Heart className="h-5 w-5 text-pink-500" />
                          <span className="text-sm font-medium text-pink-700">
                            Matrimony Profile Active
                          </span>
                        </div>
                        
                        {userData?.matchMaker && (
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm font-medium text-gray-700 mb-2">
                              Matchmaker
                            </p>
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={userData.matchMaker.profilePicture} />
                                <AvatarFallback className="avs-gradient text-white text-xs">
                                  {userData.matchMaker.firstName[0]}
                                  {userData.matchMaker.lastName[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {userData.matchMaker.firstName} {userData.matchMaker.lastName}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                  {userData.matchMaker.gothiram && (
                                    <span className="flex items-center gap-1">
                                      <User className="h-3 w-3" />
                                      {userData.matchMaker.gothiram}
                                    </span>
                                  )}
                                  {(userData.matchMaker.nativePlace || userData.matchMaker.city) && (
                                    <span className="flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      {userData.matchMaker.nativePlace || userData.matchMaker.city}
                                    </span>
                                  )}
                                </div>
                                {(userData.matchMaker.primaryPhone || userData.matchMaker.secondaryPhone) && (
                                  <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                                    {userData.matchMaker.primaryPhone && (
                                      <span className="flex items-center gap-1">
                                        <Phone className="h-3 w-3" />
                                        {userData.matchMaker.primaryPhone}
                                      </span>
                                    )}
                                    {userData.matchMaker.secondaryPhone && (
                                      <span className="flex items-center gap-1">
                                        <Phone className="h-3 w-3" />
                                        {userData.matchMaker.secondaryPhone}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Bio */}
                  {userData?.bioDesc && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-3">
                        About
                      </h4>
                      <p className="text-gray-700">{userData.bioDesc}</p>
                    </div>
                  )}

                  {/* Partner Description - Only if matrimony is active */}
                  {userData?.enableMarriageFlag && userData?.partnerDesc && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-3">
                        Partner Preferences
                      </h4>
                      <p className="text-gray-700">{userData.partnerDesc}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Family Tree Tab */}
            <TabsContent value="family-tree" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Network className="h-5 w-5 text-[#E63946]" />
                    Family Tree
                  </CardTitle>
                  <CardDescription>
                    {userData?.firstName}'s family relationships and connections
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {relationships.length === 0 ? (
                    <div className="text-center py-12">
                      <TreePine className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No Family Connections Yet
                      </h3>
                      <p className="text-gray-600">
                        This user hasn't added any family relationships yet.
                      </p>
                    </div>
                  ) : (
                    <D3FamilyTree
                      relationships={relationships}
                      currentUserId={userId}
                      currentUserName={`${userData?.firstName} ${userData?.lastName}`}
                    />
                  )}
                </CardContent>
              </Card>

              {/* Relationships List */}
              {relationships.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>
                      Relationships ({relationships.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {relationships.map((rel) => {
                        const isUserPerson1 = rel.personId1?._id === userId;
                        const otherPerson = isUserPerson1
                          ? rel.personId2
                          : rel.personId1;

                        return (
                          <div
                            key={rel._id}
                            className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100"
                          >
                            <div className="flex items-center space-x-4">
                              <Avatar className="h-10 w-10">
                                <AvatarImage
                                  src={otherPerson?.profilePicture}
                                />
                                <AvatarFallback className="avs-gradient text-white">
                                  {otherPerson?.firstName?.[0]}
                                  {otherPerson?.lastName?.[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold text-gray-900">
                                  {otherPerson?.firstName}{" "}
                                  {otherPerson?.lastName}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {rel.relationType}
                                </p>
                                {otherPerson?.gothiram && (
                                  <p className="text-xs text-gray-500">
                                    {otherPerson.gothiram}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div>
                              {rel.isApproved ? (
                                <Badge className="bg-green-100 text-green-800">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Approved
                                </Badge>
                              ) : (
                                <Badge className="bg-yellow-100 text-yellow-800">
                                  Pending
                                </Badge>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Add Relationship Tab */}
            <TabsContent value="add-relationship" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5 text-[#E63946]" />
                    Add Relationship with {userData?.firstName}
                  </CardTitle>
                  <CardDescription>
                    Define how you are related to this person
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Selected User Display */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={userData?.profilePicture} />
                        <AvatarFallback className="avs-gradient text-white">
                          {userData?.firstName?.[0]}
                          {userData?.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {userData?.firstName} {userData?.lastName}
                        </p>
                        <div className="flex gap-3 text-xs text-gray-600">
                          {userData?.gothiram && (
                            <span>
                              <User className="inline h-3 w-3 mr-1" />
                              {userData.gothiram}
                            </span>
                          )}
                          {userData?.nativePlace && (
                            <span>
                              <MapPin className="inline h-3 w-3 mr-1" />
                              {userData.nativePlace}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Relationship Type */}
                  <div>
                    <Label>How is {userData?.firstName} related to you?</Label>
                    <Select
                      value={relationType}
                      onValueChange={setRelationType}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select relationship type" />
                      </SelectTrigger>
                      <SelectContent>
                        {RELATIONSHIP_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">
                      Example: If {userData?.firstName} is your father, select
                      "Father"
                    </p>
                  </div>

                  {/* Description */}
                  <div>
                    <Label>Description (Optional)</Label>
                    <Textarea
                      className="mt-2"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Add any additional notes about this relationship..."
                      rows={3}
                      maxLength={500}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {description.length}/500 characters
                    </p>
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleAddRelationship}
                      disabled={!relationType || submitting}
                      className="avs-button-primary flex-1"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Relationship
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Info Box */}
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <Shield className="h-5 w-5 text-amber-600 mt-0.5" />
                      <div>
                        <p className="font-semibold text-amber-900 text-sm mb-1">
                          Relationship Approval
                        </p>
                        <p className="text-xs text-amber-700">
                          Your relationship will be pending until approved by
                          the other person or an admin. Once approved, it will
                          appear in both family trees.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
