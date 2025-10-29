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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import SearchBar from "@/components/SearchBar";
import UserProfileModal from "@/components/UserProfileModal";
import { AdminLoader } from "@/components/ui/loader";
import Link from "next/link";
import { toast } from "sonner";
import {
  Users,
  Plus,
  Trash2,
  Edit,
  ArrowLeft,
  MapPin,
  User,
  CheckCircle,
  Clock,
  Eye,
  X,
} from "lucide-react";

interface RelationshipData {
  _id: string;
  personId1: any;
  personId2: any;
  relationType: string;
  description?: string;
  isApproved: boolean;
  createdBy?: any;
  createdAt: string;
}

interface SearchResult {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  mobile?: string;
  gothiram?: string;
  nativePlace?: string;
  city?: string;
  profilePicture?: string;
  gender?: string;
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

export default function RelationshipsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [relationships, setRelationships] = useState<RelationshipData[]>([]);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SearchResult | null>(null);
  const [selectedRelationship, setSelectedRelationship] =
    useState<RelationshipData | null>(null);
  const [relationType, setRelationType] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileUserId, setProfileUserId] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) return router.push("/auth/login");
    if (!session.user.isApprovedByAdmin)
      return router.push("/pending-approval");
    fetchRelationships();
  }, [session, status]);

  const fetchRelationships = async () => {
    try {
      const response = await fetch("/api/relationships");
      if (response.ok) {
        const data = await response.json();
        setRelationships(data.relationships);
      }
    } catch {
      toast.error("Failed to load relationships");
    } finally {
      setLoading(false);
    }
  };

  const handleAddRelationship = async () => {
    if (!selectedUser || !relationType)
      return toast.error("Select user & relationship type");

    // Validate: Cannot add relationship with yourself
    if (selectedUser._id === session?.user.id) {
      return toast.error("You cannot add a relationship with yourself");
    }

    // Validate: Check if relationship already exists
    const relationshipExists = relationships.some((rel) => {
      const otherId =
        rel.personId1._id === session?.user.id
          ? rel.personId2._id
          : rel.personId1._id;
      return otherId === selectedUser._id;
    });

    if (relationshipExists) {
      return toast.error("A relationship already exists with this user");
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/relationships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personId2: selectedUser._id,
          relationType,
          description,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Relationship added successfully");
        setRelationships([data.relationship, ...relationships]);
        resetAddDialog();
      } else {
        toast.error(data.error || "Failed to add relationship");
      }
    } catch {
      toast.error("Error adding relationship");
    } finally {
      setSubmitting(false);
    }
  };

  const resetAddDialog = () => {
    setAddDialogOpen(false);
    setSelectedUser(null);
    setRelationType("");
    setDescription("");
  };

  const handleEditRelationship = async () => {
    if (!selectedRelationship || !relationType)
      return toast.error("Select relationship type");
    setSubmitting(true);
    try {
      const res = await fetch(
        `/api/relationships/${selectedRelationship._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ relationType, description }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success("Relationship updated");
        setRelationships((rels) =>
          rels.map((r) =>
            r._id === selectedRelationship._id ? data.relationship : r
          )
        );
        resetEditDialog();
      } else toast.error(data.error || "Failed");
    } catch {
      toast.error("Error updating relationship");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRelationship = async (id: string) => {
    if (!confirm("Delete this relationship?")) return;
    try {
      const res = await fetch(`/api/relationships/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Relationship deleted");
        setRelationships((r) => r.filter((rel) => rel._id !== id));
      } else toast.error("Failed to delete");
    } catch {
      toast.error("Error deleting relationship");
    }
  };

  const resetEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedRelationship(null);
    setRelationType("");
    setDescription("");
  };

  const openEditDialog = (r: RelationshipData) => {
    setSelectedRelationship(r);
    setRelationType(r.relationType);
    setDescription(r.description || "");
    setEditDialogOpen(true);
  };

  const getOtherPerson = (r: RelationshipData) =>
    r.personId1._id === session?.user.id ? r.personId2 : r.personId1;

  // Get the correct relationship label from current user's perspective
  const getRelationshipLabel = (r: RelationshipData) => {
    // If current user is personId1, the relationType is correct as-is
    if (r.personId1._id === session?.user.id) {
      return r.relationType;
    }

    // If current user is personId2, we need to show the inverse relationship
    const inverseMap: Record<string, string> = {
      Father: "Son/Daughter",
      Mother: "Son/Daughter",
      Son: "Father/Mother",
      Daughter: "Father/Mother",
      Spouse: "Spouse",
      Brother: "Brother/Sister",
      Sister: "Brother/Sister",
      "Older Sibling": "Younger Sibling",
      "Younger Sibling": "Older Sibling",
      "Grand Father": "Grandchild",
      "Grand Mother": "Grandchild",
      Uncle: "Nephew/Niece",
      Aunt: "Nephew/Niece",
      Nephew: "Uncle/Aunt",
      Niece: "Uncle/Aunt",
      Cousin: "Cousin",
      Other: "Other",
    };

    return inverseMap[r.relationType] || r.relationType;
  };

  const handleViewProfile = (userId: string) => {
    setProfileUserId(userId);
    setProfileModalOpen(true);
  };

  if (status === "loading" || loading)
    return <AdminLoader text="Loading your relationships..." />;

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
          <Link href="/dashboard" className="flex items-center space-x-3">
            <div className="w-10 h-10 avs-gradient rounded-full flex items-center justify-center text-white font-bold">
              AVS
            </div>
            <span className="text-xl font-semibold text-gray-900">
              AVS Family Tree
            </span>
          </Link>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Link>
          </Button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center mb-2">
            <Users className="h-7 w-7 text-[#E63946] mr-3" /> My Relationships
          </h1>
          <p className="text-gray-600 text-sm">
            Manage your family connections and relationships
          </p>
        </div>

        {/* Add Relationship */}
        <Card className="border-0 shadow-md">
          <CardHeader className="flex justify-between items-center">
            <div>
              <CardTitle>Add New Relationship</CardTitle>
              <CardDescription>
                Connect with family members to grow your tree
              </CardDescription>
            </div>
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="avs-button-primary">
                  <Plus className="h-4 w-4 mr-2" /> Add Relationship
                </Button>
              </DialogTrigger>
              <DialogContent
                className="max-w-3xl w-full max-h-[90vh] flex flex-col p-0"
                style={{ maxWidth: "800px" }}
              >
                <DialogHeader className="px-6 pt-6 pb-2 shrink-0">
                  <DialogTitle>Add New Relationship</DialogTitle>
                  <DialogDescription>
                    Search for a family member and select your relationship
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-5 overflow-y-auto px-6 py-4">
                  {/* Search Bar */}
                  <div>
                    <Label>Search Member</Label>
                    <div className="mt-2">
                      <SearchBar
                        isAdmin={session.user.role === "admin"}
                        onSelectUser={setSelectedUser}
                        onViewProfile={handleViewProfile}
                      />
                    </div>
                  </div>

                  {/* Selected User */}
                  {selectedUser &&
                    (() => {
                      const isSelf = selectedUser._id === session?.user.id;
                      const relationshipExists = relationships.some((rel) => {
                        const otherId =
                          rel.personId1._id === session?.user.id
                            ? rel.personId2._id
                            : rel.personId1._id;
                        return otherId === selectedUser._id;
                      });
                      const existingRel = relationships.find((rel) => {
                        const otherId =
                          rel.personId1._id === session?.user.id
                            ? rel.personId2._id
                            : rel.personId1._id;
                        return otherId === selectedUser._id;
                      });

                      return (
                        <div
                          className={`p-4 rounded-lg border relative ${
                            isSelf
                              ? "bg-red-50 border-red-200"
                              : relationshipExists
                              ? "bg-yellow-50 border-yellow-200"
                              : "bg-blue-50 border-blue-100"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={selectedUser.profilePicture} />
                              <AvatarFallback className="avs-gradient text-white">
                                {selectedUser.firstName?.[0]}
                                {selectedUser.lastName?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <button
                                onClick={() =>
                                  handleViewProfile(selectedUser._id)
                                }
                                className="font-semibold text-gray-900 hover:text-[#E63946] hover:underline cursor-pointer transition-colors text-left"
                              >
                                {selectedUser.firstName} {selectedUser.lastName}
                              </button>
                              <div className="flex gap-3 text-xs text-gray-600">
                                {selectedUser.gothiram && (
                                  <span>
                                    <User className="inline h-3 w-3 mr-1" />
                                    {selectedUser.gothiram}
                                  </span>
                                )}
                                {selectedUser.nativePlace && (
                                  <span>
                                    <MapPin className="inline h-3 w-3 mr-1" />
                                    {selectedUser.nativePlace}
                                  </span>
                                )}
                              </div>
                              {isSelf && (
                                <p className="text-xs text-red-600 mt-1 font-medium">
                                  ⚠️ You cannot add a relationship with yourself
                                </p>
                              )}
                              {relationshipExists && !isSelf && (
                                <p className="text-xs text-yellow-700 mt-1 font-medium">
                                  ⚠️ Relationship already exists:{" "}
                                  {existingRel?.relationType}
                                </p>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedUser(null)}
                              className="h-8 w-8 p-0 hover:bg-gray-200"
                              title="Remove selected user"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })()}

                  {/* Relationship Type */}
                  <div>
                    <Label>Relationship Type</Label>
                    <Select
                      value={relationType}
                      onValueChange={setRelationType}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select relationship type" />
                      </SelectTrigger>
                      <SelectContent>
                        {RELATIONSHIP_TYPES.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Description */}
                  <div>
                    <Label>Description (Optional)</Label>
                    <Textarea
                      className="mt-2"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Add notes about this relationship..."
                      rows={2}
                      maxLength={500}
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      {description.length}/500 characters
                    </p>
                  </div>
                </div>

                <DialogFooter className="px-6 py-4 border-t shrink-0">
                  <Button variant="outline" onClick={resetAddDialog}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddRelationship}
                    disabled={
                      !selectedUser ||
                      !relationType ||
                      submitting ||
                      selectedUser._id === session?.user.id ||
                      relationships.some((rel) => {
                        const otherId =
                          rel.personId1._id === session?.user.id
                            ? rel.personId2._id
                            : rel.personId1._id;
                        return otherId === selectedUser._id;
                      })
                    }
                    className="avs-button-primary"
                  >
                    {submitting ? "Adding..." : "Add Relationship"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
        </Card>

        {/* Relationships List */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Your Relationships ({relationships.length})</CardTitle>
            <CardDescription>
              View and manage all your connections
            </CardDescription>
          </CardHeader>
          <CardContent>
            {relationships.length === 0 ? (
              <div className="text-center py-16">
                <Users className="h-14 w-14 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  No Relationships Yet
                </h3>
                <p className="text-gray-600 text-sm mb-5">
                  Start building your family tree by adding your first
                  relationship
                </p>
                <Button
                  onClick={() => setAddDialogOpen(true)}
                  className="avs-button-primary"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Relationship
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {relationships.map((rel) => {
                  const person = getOtherPerson(rel);
                  return (
                    <div
                      key={rel._id}
                      className="flex justify-between items-center p-5 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow transition"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={person.profilePicture} />
                          <AvatarFallback className="avs-gradient text-white">
                            {person.firstName?.[0]}
                            {person.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <button
                              onClick={() => handleViewProfile(person._id)}
                              className="font-semibold text-gray-900 hover:text-[#E63946] hover:underline cursor-pointer transition-colors"
                            >
                              {person.firstName} {person.lastName}
                            </button>
                            <Badge
                              variant="outline"
                              className="border-[#E63946] text-[#E63946]"
                            >
                              {getRelationshipLabel(rel)}
                            </Badge>
                            {rel.isApproved ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <Clock className="h-4 w-4 text-yellow-500" />
                            )}
                          </div>
                          <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                            {person.gothiram && (
                              <span>
                                <User className="inline h-3 w-3 mr-1" />
                                {person.gothiram}
                              </span>
                            )}
                            {person.nativePlace && (
                              <span>
                                <MapPin className="inline h-3 w-3 mr-1" />
                                {person.nativePlace}
                              </span>
                            )}
                            {rel.description && (
                              <span className="italic text-gray-500">
                                {rel.description}
                              </span>
                            )}
                          </div>
                          {rel.createdBy && (
                            <p className="text-xs text-gray-400 mt-1">
                              Added by {rel.createdBy.firstName} on{" "}
                              {new Date(rel.createdAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewProfile(person._id)}
                          title="View Profile"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(rel)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-300 text-red-600 hover:bg-red-100 hover:border-red-400 hover:text-red-800"
                          onClick={() => handleDeleteRelationship(rel._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-md w-full max-h-[90vh] flex flex-col p-0">
            <DialogHeader className="px-6 pt-6 pb-2 shrink-0">
              <DialogTitle>Edit Relationship</DialogTitle>
              <DialogDescription>Update relationship details</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 overflow-y-auto px-6 py-4">
              <div>
                <Label>Relationship Type</Label>
                <Select value={relationType} onValueChange={setRelationType}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {RELATIONSHIP_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Description (Optional)</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  maxLength={500}
                  className="mt-2"
                />
                <p className="text-xs text-gray-400 mt-1">
                  {description.length}/500
                </p>
              </div>
            </div>
            <DialogFooter className="px-6 py-4 border-t shrink-0">
              <Button variant="outline" onClick={resetEditDialog}>
                Cancel
              </Button>
              <Button
                onClick={handleEditRelationship}
                disabled={!relationType || submitting}
                className="avs-button-primary"
              >
                {submitting ? "Updating..." : "Update"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* User Profile Modal */}
        <UserProfileModal
          userId={profileUserId}
          open={profileModalOpen}
          onOpenChange={setProfileModalOpen}
        />
      </main>
    </div>
  );
}
