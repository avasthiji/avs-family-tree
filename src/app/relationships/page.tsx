"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import SearchBar from "@/components/SearchBar";
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
  AlertCircle
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
  'Father', 'Mother', 'Spouse', 'Son', 'Daughter',
  'Brother', 'Sister', 'Older Sibling', 'Younger Sibling',
  'Grand Father', 'Grand Mother', 'Uncle', 'Aunt', 
  'Cousin', 'Nephew', 'Niece', 'Other'
];

export default function RelationshipsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [relationships, setRelationships] = useState<RelationshipData[]>([]);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SearchResult | null>(null);
  const [selectedRelationship, setSelectedRelationship] = useState<RelationshipData | null>(null);
  const [relationType, setRelationType] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push("/auth/login");
      return;
    }

    if (!session.user.isApprovedByAdmin) {
      router.push("/pending-approval");
      return;
    }

    fetchRelationships();
  }, [session, status, router]);

  const fetchRelationships = async () => {
    try {
      const response = await fetch("/api/relationships");
      if (response.ok) {
        const data = await response.json();
        setRelationships(data.relationships);
      }
    } catch (error) {
      console.error("Error fetching relationships:", error);
      toast.error("Failed to load relationships");
    } finally {
      setLoading(false);
    }
  };

  const handleAddRelationship = async () => {
    if (!selectedUser || !relationType) {
      toast.error("Please select a user and relationship type");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/relationships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personId2: selectedUser._id,
          relationType,
          description
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Relationship added successfully!");
        setRelationships([data.relationship, ...relationships]);
        setAddDialogOpen(false);
        setSelectedUser(null);
        setRelationType("");
        setDescription("");
      } else {
        toast.error(data.error || "Failed to add relationship");
      }
    } catch (error) {
      console.error("Error adding relationship:", error);
      toast.error("Failed to add relationship");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditRelationship = async () => {
    if (!selectedRelationship || !relationType) {
      toast.error("Please select a relationship type");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/relationships/${selectedRelationship._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          relationType,
          description
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Relationship updated successfully!");
        setRelationships(relationships.map(rel => 
          rel._id === selectedRelationship._id ? data.relationship : rel
        ));
        setEditDialogOpen(false);
        setSelectedRelationship(null);
        setRelationType("");
        setDescription("");
      } else {
        toast.error(data.error || "Failed to update relationship");
      }
    } catch (error) {
      console.error("Error updating relationship:", error);
      toast.error("Failed to update relationship");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRelationship = async (relationshipId: string) => {
    if (!confirm("Are you sure you want to delete this relationship?")) {
      return;
    }

    try {
      const response = await fetch(`/api/relationships/${relationshipId}`, {
        method: "DELETE"
      });

      if (response.ok) {
        toast.success("Relationship deleted successfully!");
        setRelationships(relationships.filter(rel => rel._id !== relationshipId));
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to delete relationship");
      }
    } catch (error) {
      console.error("Error deleting relationship:", error);
      toast.error("Failed to delete relationship");
    }
  };

  const openEditDialog = (relationship: RelationshipData) => {
    setSelectedRelationship(relationship);
    setRelationType(relationship.relationType);
    setDescription(relationship.description || "");
    setEditDialogOpen(true);
  };

  const getOtherPerson = (relationship: RelationshipData) => {
    if (relationship.personId1._id === session?.user.id) {
      return relationship.personId2;
    }
    return relationship.personId1;
  };

  if (status === "loading" || loading) {
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <Users className="h-8 w-8 mr-3 text-[#E63946]" />
            My Relationships
          </h1>
          <p className="text-gray-600">Manage your family connections and relationships</p>
        </div>

        {/* Add Relationship Card */}
        <Card className="avs-card border-0 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Add New Relationship</span>
              <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="avs-button-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Relationship
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Relationship</DialogTitle>
                    <DialogDescription>
                      Search for a family member and define your relationship
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-6 py-4">
                    {/* Search Bar */}
                    <div>
                      <Label>Search for Family Member</Label>
                      <div className="mt-2">
                        <SearchBar
                          isAdmin={session.user.role === "admin"}
                          onSelectUser={(user) => setSelectedUser(user)}
                        />
                      </div>
                    </div>

                    {/* Selected User */}
                    {selectedUser && (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <Label className="mb-2 block">Selected Person</Label>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={selectedUser.profilePicture} />
                            <AvatarFallback className="avs-gradient text-white">
                              {selectedUser.firstName?.[0]}{selectedUser.lastName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{selectedUser.firstName} {selectedUser.lastName}</p>
                            <div className="flex gap-3 text-xs text-gray-600">
                              {selectedUser.gothiram && (
                                <span className="flex items-center">
                                  <User className="h-3 w-3 mr-1" />
                                  {selectedUser.gothiram}
                                </span>
                              )}
                              {selectedUser.nativePlace && (
                                <span className="flex items-center">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {selectedUser.nativePlace}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Relationship Type */}
                    <div>
                      <Label>Relationship Type</Label>
                      <Select value={relationType} onValueChange={setRelationType}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select relationship type" />
                        </SelectTrigger>
                        <SelectContent>
                          {RELATIONSHIP_TYPES.map(type => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Description */}
                    <div>
                      <Label>Description (Optional)</Label>
                      <Textarea
                        placeholder="Add any additional notes about this relationship..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        maxLength={500}
                        rows={3}
                        className="mt-2"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {description.length}/500 characters
                      </p>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setAddDialogOpen(false);
                        setSelectedUser(null);
                        setRelationType("");
                        setDescription("");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddRelationship}
                      disabled={!selectedUser || !relationType || submitting}
                      className="avs-button-primary"
                    >
                      {submitting ? "Adding..." : "Add Relationship"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardTitle>
            <CardDescription>
              Connect with family members to build your family tree
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Relationships List */}
        <Card className="avs-card border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Your Relationships ({relationships.length})</CardTitle>
            <CardDescription>
              View and manage all your family connections
            </CardDescription>
          </CardHeader>
          <CardContent>
            {relationships.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Relationships Yet</h3>
                <p className="text-gray-600 mb-4">
                  Start building your family tree by adding your first relationship
                </p>
                <Button 
                  onClick={() => setAddDialogOpen(true)}
                  className="avs-button-primary"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Relationship
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {relationships.map((rel) => {
                  const otherPerson = getOtherPerson(rel);
                  const isCurrentUserPerson1 = rel.personId1._id === session.user.id;
                  
                  return (
                    <div
                      key={rel._id}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={otherPerson.profilePicture} />
                          <AvatarFallback className="avs-gradient text-white">
                            {otherPerson.firstName?.[0]}{otherPerson.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-gray-900">
                              {otherPerson.firstName} {otherPerson.lastName}
                            </p>
                            <Badge variant="outline" className="text-[#E63946] border-[#E63946]">
                              {rel.relationType}
                            </Badge>
                            {rel.isApproved ? (
                              <CheckCircle className="h-4 w-4 text-green-500" aria-label="Approved" />
                            ) : (
                              <Clock className="h-4 w-4 text-yellow-500" aria-label="Pending Approval" />
                            )}
                          </div>

                          <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                            {otherPerson.gothiram && (
                              <span className="flex items-center">
                                <User className="h-3 w-3 mr-1" />
                                {otherPerson.gothiram}
                              </span>
                            )}
                            {otherPerson.nativePlace && (
                              <span className="flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {otherPerson.nativePlace}
                              </span>
                            )}
                            {rel.description && (
                              <span className="text-gray-500 italic">
                                {rel.description}
                              </span>
                            )}
                          </div>

                          {rel.createdBy && (
                            <p className="text-xs text-gray-400 mt-1">
                              Added by {rel.createdBy.firstName} on {new Date(rel.createdAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
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
                          onClick={() => handleDeleteRelationship(rel._id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Relationship</DialogTitle>
              <DialogDescription>
                Update the relationship details
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div>
                <Label>Relationship Type</Label>
                <Select value={relationType} onValueChange={setRelationType}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select relationship type" />
                  </SelectTrigger>
                  <SelectContent>
                    {RELATIONSHIP_TYPES.map(type => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Description (Optional)</Label>
                <Textarea
                  placeholder="Add any additional notes..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={500}
                  rows={3}
                  className="mt-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {description.length}/500 characters
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setEditDialogOpen(false);
                  setSelectedRelationship(null);
                  setRelationType("");
                  setDescription("");
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleEditRelationship}
                disabled={!relationType || submitting}
                className="avs-button-primary"
              >
                {submitting ? "Updating..." : "Update Relationship"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

