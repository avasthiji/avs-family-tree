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
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader } from "@/components/ui/loader";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Heart,
  Calendar,
  Home,
  Edit,
  Save,
  X,
  Shield,
  CheckCircle,
  Download,
} from "lucide-react";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import BackButton from "@/components/BackButton";
import { MATRIMONIAL_ENABLED } from "@/lib/features";
import { toast } from "sonner";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [originalUserData, setOriginalUserData] = useState<any>(null);
  const [gothirams, setGothirams] = useState<
    Array<{ _id: string; name: string; tamilName: string }>
  >([]);
  const [rasiList, setRasiList] = useState<
    Array<{ _id: string; name: string; tamilName: string }>
  >([]);
  const [nakshatramList, setNakshatramList] = useState<
    Array<{ _id: string; name: string; tamilName: string }>
  >([]);
  const [kuladeivamList, setKuladeivamList] = useState<
    Array<{
      _id: string;
      name: string;
      tamilName?: string;
    }>
  >([]);
  const [avsMatchmakers, setAvsMatchmakers] = useState<
    Array<{
      _id: string;
      firstName: string;
      lastName: string;
      gothiram?: string;
      nativePlace?: string;
      city?: string;
      profilePicture?: string;
    }>
  >([]);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/auth/login");
      return;
    }

    // Fetch user profile data
    fetchUserProfile();
  }, [session, status, router]);

  const fetchUserProfile = async () => {
    try {
      const [profileRes, gothiramRes, rasiRes, nakshatramRes, kuladeivamRes, matchmakersRes] =
        await Promise.all([
          fetch("/api/users/profile"),
          fetch("/api/gothiram"),
          fetch("/api/rasi"),
          fetch("/api/nakshatram"),
          fetch("/api/kuladeivam"),
          fetch("/api/matchmakers"),
        ]);

      if (profileRes.ok) {
        const data = await profileRes.json();
        // Convert matchMaker back to matchMakerId for state consistency
        const userData = { ...data.user };
        if (userData.matchMaker && !userData.matchMakerId) {
          userData.matchMakerId = userData.matchMaker._id || userData.matchMaker;
        }
        // Store both current and original data
        setUserData(userData);
        setOriginalUserData(JSON.parse(JSON.stringify(userData))); // Deep copy
      } else {
        console.error("Profile API failed:", profileRes.status);
        // Set empty userData to prevent infinite loading
        setUserData({});
      }

      if (gothiramRes.ok) {
        const data = await gothiramRes.json();
        console.log("Gothiram data:", data.gothirams);
        setGothirams(data.gothirams || []);
      } else {
        console.error("Gothiram API failed:", gothiramRes.status);
      }

      if (rasiRes.ok) {
        const data = await rasiRes.json();
        console.log("Rasi data:", data.rasi);
        setRasiList(data.rasi || []);
      } else {
        console.error("Rasi API failed:", rasiRes.status);
      }

      if (matchmakersRes.ok) {
        const data = await matchmakersRes.json();
        setAvsMatchmakers(data.matchmakers || []);
      } else {
        console.error("Matchmakers API failed:", matchmakersRes.status);
      }

      if (nakshatramRes.ok) {
        const data = await nakshatramRes.json();
        console.log("Nakshatram data:", data.nakshatram);
        setNakshatramList(data.nakshatram || []);
      } else {
        console.error("Nakshatram API failed:", nakshatramRes.status);
      }

      if (kuladeivamRes.ok) {
        const data = await kuladeivamRes.json();
        console.log("Kuladeivam data:", data.kuladeivam);
        setKuladeivamList(data.kuladeivam || []);
      } else {
        console.error("Kuladeivam API failed:", kuladeivamRes.status);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      // Set empty userData to prevent infinite loading
      setUserData({});
    }
  };

  const handleSave = async () => {
    setLoading(true);

    try {
      // Prepare the data to send, ensuring matchMakerId is included even if undefined
      const dataToSend = {
        ...userData,
        matchMakerId: userData?.matchMakerId || undefined,
      };
      
      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const data = await response.json();
        toast.error(data.error || "Failed to update profile");
        return;
      }

      toast.success("Profile updated successfully!");
      setEditing(false);
      fetchUserProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred while updating profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset userData to original values from API
    if (originalUserData) {
      setUserData(JSON.parse(JSON.stringify(originalUserData))); // Deep copy
    }
    setEditing(false);
  };

  if (status === "loading" || !userData) {
    return <Loader variant="page" text="Loading profile..." size="lg" />;
  }

  const user = session?.user;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] via-white to-[#F8F9FA]">
      {/* Navigation */}
      <AppHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BackButton href="/dashboard" label="Back to Dashboard" />
        
        {/* Profile Header */}
        <Card className="avs-card border-0 shadow-xl mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                <AvatarImage src={userData?.profilePicture} />
                <AvatarFallback className="text-3xl font-bold avs-gradient text-white">
                  {user?.firstName?.[0]}
                  {user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {user?.firstName} {user?.lastName}
                </h1>
                <p className="text-gray-600 mb-4">
                  {userData?.bioDesc || "No bio description yet"}
                </p>

                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {user?.isEmailVerified && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Email Verified
                    </span>
                  )}
                  {/* {user?.isMobileVerified && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Mobile Verified
                    </span>
                  )} */}
                  {user?.isApprovedByAdmin && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <Shield className="w-3 h-3 mr-1" />
                      Admin Approved
                    </span>
                  )}
                  {MATRIMONIAL_ENABLED && userData?.enableMarriageFlag && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                      <Heart className="w-3 h-3 mr-1" />
                      Matrimony Active
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Tabs */}
        <Tabs defaultValue="basic" className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <TabsList className="grid grid-cols-5 w-full max-w-3xl">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="professional">Professional</TabsTrigger>
              <TabsTrigger value="cultural">Astrology</TabsTrigger>
              <TabsTrigger value="about">About Me</TabsTrigger>
            </TabsList>
            {!editing ? (
              <Button
                onClick={() => setEditing(true)}
                className="avs-button-primary whitespace-nowrap"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  disabled={loading}
                  className="avs-button-primary whitespace-nowrap"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  disabled={loading}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </div>

          {/* Basic Information */}
          <TabsContent value="basic">
            <Card className="avs-card border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Personal details and demographics
                </CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label>Gender</Label>
                  <Select
                    value={userData?.gender || ""}
                    onValueChange={(value) =>
                      setUserData({ ...userData, gender: value })
                    }
                    disabled={!editing}
                  >
                    <SelectTrigger className="mt-1 w-full">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Date of Birth</Label>
                  <Input
                    type="date"
                    value={
                      userData?.dob
                        ? new Date(userData.dob).toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      setUserData({ ...userData, dob: e.target.value })
                    }
                    disabled={!editing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Date of Death</Label>
                  <Input
                    type="date"
                    value={
                      userData?.deathday
                        ? new Date(userData.deathday).toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      setUserData({ ...userData, deathday: e.target.value })
                    }
                    disabled={!editing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Place of Birth</Label>
                  <Input
                    value={userData?.placeOfBirth || ""}
                    onChange={(e) =>
                      setUserData({ ...userData, placeOfBirth: e.target.value })
                    }
                    disabled={!editing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Time of Birth</Label>
                  <Input
                    type="time"
                    value={userData?.timeOfBirth || ""}
                    onChange={(e) =>
                      setUserData({ ...userData, timeOfBirth: e.target.value })
                    }
                    disabled={!editing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Height (cm)</Label>
                  <Input
                    type="number"
                    value={userData?.height || ""}
                    onChange={(e) =>
                      setUserData({ ...userData, height: e.target.value })
                    }
                    min={100}
                    max={250}
                    disabled={!editing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Native Place</Label>
                  <Input
                    value={userData?.nativePlace || ""}
                    onChange={(e) =>
                      setUserData({ ...userData, nativePlace: e.target.value })
                    }
                    disabled={!editing}
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Information */}
          <TabsContent value="contact">
            <Card className="avs-card border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Phone numbers and address details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label>Primary Phone</Label>
                    <Input
                      value={userData?.primaryPhone || ""}
                      onChange={(e) =>
                        setUserData({
                          ...userData,
                          primaryPhone: e.target.value,
                        })
                      }
                      disabled={!editing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Secondary Phone</Label>
                    <Input
                      value={userData?.secondaryPhone || ""}
                      onChange={(e) =>
                        setUserData({
                          ...userData,
                          secondaryPhone: e.target.value,
                        })
                      }
                      disabled={!editing}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label>Address Line 1</Label>
                  <Input
                    value={userData?.address1 || ""}
                    onChange={(e) =>
                      setUserData({ ...userData, address1: e.target.value })
                    }
                    disabled={!editing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Address Line 2</Label>
                  <Input
                    value={userData?.address2 || ""}
                    onChange={(e) =>
                      setUserData({ ...userData, address2: e.target.value })
                    }
                    disabled={!editing}
                    className="mt-1"
                  />
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <Label>City</Label>
                    <Input
                      value={userData?.city || ""}
                      onChange={(e) =>
                        setUserData({ ...userData, city: e.target.value })
                      }
                      disabled={!editing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>State</Label>
                    <Input
                      value={userData?.state || ""}
                      onChange={(e) =>
                        setUserData({ ...userData, state: e.target.value })
                      }
                      disabled={!editing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Postal Code</Label>
                    <Input
                      value={userData?.postalCode || ""}
                      onChange={(e) =>
                        setUserData({ ...userData, postalCode: e.target.value })
                      }
                      disabled={!editing}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label>Country</Label>
                    <Input
                      value={userData?.country || ""}
                      onChange={(e) =>
                        setUserData({ ...userData, country: e.target.value })
                      }
                      disabled={!editing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Citizenship</Label>
                    <Input
                      value={userData?.citizenship || ""}
                      onChange={(e) =>
                        setUserData({
                          ...userData,
                          citizenship: e.target.value,
                        })
                      }
                      disabled={!editing}
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Professional Information */}
          <TabsContent value="professional">
            <Card className="avs-card border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Professional Information</CardTitle>
                <CardDescription>Education and career details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Qualification</Label>
                  <Input
                    value={userData?.qualification || ""}
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        qualification: e.target.value,
                      })
                    }
                    disabled={!editing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Job Description</Label>
                  <Input
                    value={userData?.jobDesc || ""}
                    onChange={(e) =>
                      setUserData({ ...userData, jobDesc: e.target.value })
                    }
                    disabled={!editing}
                    className="mt-1"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label>Salary Range</Label>
                    <Input
                      value={userData?.salary || ""}
                      onChange={(e) =>
                        setUserData({ ...userData, salary: e.target.value })
                      }
                      disabled={!editing}
                      className="mt-1"
                      placeholder="e.g., 500000+"
                    />
                  </div>
                  <div>
                    <Label>Work Place</Label>
                    <Input
                      value={userData?.workPlace || ""}
                      onChange={(e) =>
                        setUserData({ ...userData, workPlace: e.target.value })
                      }
                      disabled={!editing}
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Astrological Information */}
          <TabsContent value="cultural">
            <Card className="avs-card border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Astrological Information</CardTitle>
                <CardDescription>
                  Traditional AVS community details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <Label className="flex items-center gap-2">
                      Rasi
                      <a
                        href="/culturals_pdf/Rasi.pdf"
                        download="Rasi.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-gray-900"
                        aria-label="Download Rasi file"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    </Label>
                    <Select
                      value={userData?.rasi || ""}
                      onValueChange={(value) =>
                        setUserData({ ...userData, rasi: value })
                      }
                      disabled={!editing}
                    >
                      <SelectTrigger className="mt-1 w-full">
                        <SelectValue placeholder="Select rasi" />
                      </SelectTrigger>
                      <SelectContent>
                        {rasiList.map((rasi) => (
                          <SelectItem key={rasi._id} value={rasi.name}>
                            {rasi.name}
                            {/* {rasi.tamilName && ` (${rasi.tamilName})`} */}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="flex items-center gap-2">
                      Natchathiram
                      <a
                        href="/culturals_pdf/Nakshathiram%20List.pdf"
                        download="Natchathiram.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-gray-900"
                        aria-label="Download Natchathiram file"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    </Label>
                    <Select
                      value={userData?.natchathiram || ""}
                      onValueChange={(value) =>
                        setUserData({ ...userData, natchathiram: value })
                      }
                      disabled={!editing}
                    >
                      <SelectTrigger className="mt-1 w-full">
                        <SelectValue placeholder="Select natchathiram" />
                      </SelectTrigger>
                      <SelectContent>
                        {nakshatramList.map((nakshatram) => (
                          <SelectItem
                            key={nakshatram._id}
                            value={nakshatram.name}
                          >
                            {nakshatram.name}
                            {/* {nakshatram.tamilName &&
                              ` (${nakshatram.tamilName})`} */}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="flex items-center gap-2">
                      Gothiram
                      <a
                        href="/culturals_pdf/Gothiram.pdf"
                        download="Gothiram.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-gray-900"
                        aria-label="Download Gothiram file"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    </Label>
                    <Select
                      value={userData?.gothiram || ""}
                      onValueChange={(value) =>
                        setUserData({ ...userData, gothiram: value })
                      }
                      disabled={!editing}
                    >
                      <SelectTrigger className="mt-1 w-full">
                        <SelectValue placeholder="Select gothiram" />
                      </SelectTrigger>
                      <SelectContent>
                        {gothirams.map((gothiram) => (
                          <SelectItem key={gothiram._id} value={gothiram.name}>
                            {gothiram.name}
                            {/* {gothiram.tamilName && ` (${gothiram.tamilName})`} */}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label className="flex items-center gap-2">
                    Kuladeivam
                    <a
                      href="/culturals_pdf/Gowthram_God_of_Worship_List.pdf"
                      download="Kuladeivam.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-gray-900"
                      aria-label="Download Kuladeivam file"
                    >
                      <Download className="h-4 w-4" />
                    </a>
                  </Label>
                  <Select
                    value={userData?.kuladeivam || ""}
                    onValueChange={(value) =>
                      setUserData({ ...userData, kuladeivam: value })
                    }
                    disabled={!editing}
                  >
                    <SelectTrigger className="mt-1 w-full">
                      <SelectValue placeholder="Select kuladeivam" />
                    </SelectTrigger>
                    <SelectContent>
                      {kuladeivamList.map((kuladeivam) => (
                        <SelectItem
                          key={kuladeivam._id}
                          value={kuladeivam.name}
                        >
                          {kuladeivam.name}
                          {/* {kuladeivam.tamilName && ` (${kuladeivam.tamilName})`} */}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Matrimony Section */}

                <div className="border-t pt-6 mt-6">
                  <h4 className="font-semibold text-sm text-gray-700 mb-4">
                    Matrimony Profile
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="enableMarriageFlag"
                        checked={userData?.enableMarriageFlag || false}
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            enableMarriageFlag: e.target.checked,
                          })
                        }
                        disabled={!editing}
                        className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                      />
                      <Label
                        htmlFor="enableMarriageFlag"
                        className="cursor-pointer text-sm font-medium"
                      >
                        Enable Matrimony Profile
                      </Label>
                    </div>

                    {userData?.enableMarriageFlag && (
                      <>
                        <div>
                          <Label
                            htmlFor="matchmakerSelect"
                            className="text-sm font-medium"
                          >
                            Select Matchmaker (Optional)
                          </Label>
                          <Select
                            value={userData?.matchMakerId || "none"}
                            onValueChange={(value) =>
                              setUserData({
                                ...userData,
                                matchMakerId: value === "none" ? undefined : value,
                              })
                            }
                            disabled={!editing}
                          >
                            <SelectTrigger id="matchmakerSelect" className="w-full">
                              <SelectValue placeholder="Select an AVS Matchmaker" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              {avsMatchmakers.map((matchmaker) => (
                                <SelectItem key={matchmaker._id} value={matchmaker._id}>
                                  {matchmaker.firstName} {matchmaker.lastName}
                                  {matchmaker.gothiram && ` - ${matchmaker.gothiram}`}
                                  {(matchmaker.nativePlace || matchmaker.city) &&
                                    ` (${matchmaker.nativePlace || matchmaker.city})`}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-gray-500 mt-1">
                            Choose someone who can help with your matrimony search
                          </p>
                        </div>
                        <div>
                          <Label htmlFor="partnerDesc" className="text-sm font-medium">
                            Partner Description
                          </Label>
                          <Textarea
                            id="partnerDesc"
                            value={userData?.partnerDesc || ""}
                            onChange={(e) =>
                              setUserData({
                                ...userData,
                                partnerDesc: e.target.value,
                              })
                            }
                            disabled={!editing}
                            className="mt-1"
                            placeholder="Describe your ideal partner..."
                            rows={5}
                            maxLength={500}
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            {(userData?.partnerDesc || "").length}/500 characters
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* About Me */}
          <TabsContent value="about">
            <Card className="avs-card border-0 shadow-lg">
              <CardHeader>
                <CardTitle>About Me</CardTitle>
                <CardDescription>
                  Personal biography and partner preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Bio Description</Label>
                  <Textarea
                    value={userData?.bioDesc || ""}
                    onChange={(e) =>
                      setUserData({ ...userData, bioDesc: e.target.value })
                    }
                    disabled={!editing}
                    className="mt-1"
                    placeholder="Tell us about yourself..."
                    rows={5}
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {(userData?.bioDesc || "").length}/500 characters
                  </p>
                </div>
                {MATRIMONIAL_ENABLED && (
                  <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="enableMarriageFlag"
                        checked={userData?.enableMarriageFlag || false}
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            enableMarriageFlag: e.target.checked,
                          })
                        }
                        disabled={!editing}
                        className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                      />
                      <Label
                        htmlFor="enableMarriageFlag"
                        className="cursor-pointer"
                      >
                        Enable Matrimony Profile (Make my profile visible for
                        matrimony matches)
                      </Label>
                    </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Bottom Save Button */}
        {editing && (
          <div className="flex justify-end gap-2 mt-6">
            <Button
              onClick={handleSave}
              disabled={loading}
              className="avs-button-primary min-w-[150px]"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              disabled={loading}
              className="min-w-[100px]"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
