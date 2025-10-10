"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { 
  Crown,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Save,
  List
} from "lucide-react";

interface Gothiram {
  _id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
}

export default function GothiramManagementPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [gothirams, setGothirams] = useState<Gothiram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Add new gothiram state
  const [newGothiram, setNewGothiram] = useState("");
  const [adding, setAdding] = useState(false);
  
  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

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

    fetchGothirams();
  }, [session, status, router]);

  const fetchGothirams = async () => {
    try {
      const response = await fetch("/api/admin/gothiram");
      if (response.ok) {
        const data = await response.json();
        setGothirams(data.gothirams);
      }
    } catch (error) {
      console.error("Error fetching gothirams:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newGothiram.trim()) {
      setError("Please enter a gothiram name");
      return;
    }

    setAdding(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/gothiram", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newGothiram }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to add gothiram");
        return;
      }

      setSuccess("Gothiram added successfully!");
      setNewGothiram("");
      fetchGothirams();
    } catch (error) {
      console.error("Error adding gothiram:", error);
      setError("An error occurred while adding gothiram");
    } finally {
      setAdding(false);
    }
  };

  const handleEdit = (gothiram: Gothiram) => {
    setEditingId(gothiram._id);
    setEditValue(gothiram.name);
  };

  const handleSaveEdit = async (id: string) => {
    if (!editValue.trim()) {
      setError("Gothiram name cannot be empty");
      return;
    }

    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/admin/gothiram/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: editValue }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to update gothiram");
        return;
      }

      setSuccess("Gothiram updated successfully!");
      setEditingId(null);
      fetchGothirams();
    } catch (error) {
      console.error("Error updating gothiram:", error);
      setError("An error occurred while updating gothiram");
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/gothiram/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        fetchGothirams();
      }
    } catch (error) {
      console.error("Error toggling gothiram status:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this gothiram?")) return;

    try {
      const response = await fetch(`/api/admin/gothiram/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setSuccess("Gothiram deleted successfully!");
        fetchGothirams();
      }
    } catch (error) {
      console.error("Error deleting gothiram:", error);
      setError("An error occurred while deleting gothiram");
    }
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
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                <Crown className="w-3 h-3 mr-1" />
                Admin
              </span>
              <Link href="/admin/dashboard">
                <Button variant="outline" size="sm">
                  Back to Admin
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
            <List className="h-8 w-8 mr-3 text-[#E63946]" />
            Gothiram Management
          </h1>
          <p className="text-gray-600">Manage gothiram dropdown values for the community</p>
        </div>

        {/* Alerts */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        {/* Add New Gothiram */}
        <Card className="avs-card border-0 shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="h-5 w-5 mr-2 text-[#E63946]" />
              Add New Gothiram
            </CardTitle>
            <CardDescription>
              Add a new gothiram option to the dropdown
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="newGothiram">Gothiram Name</Label>
                <Input
                  id="newGothiram"
                  value={newGothiram}
                  onChange={(e) => setNewGothiram(e.target.value)}
                  placeholder="Enter gothiram name"
                  className="mt-1"
                  onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={handleAdd}
                  disabled={adding || !newGothiram.trim()}
                  className="avs-button-primary"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Gothiram
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gothirams List */}
        <Card className="avs-card border-0 shadow-lg">
          <CardHeader>
            <CardTitle>All Gothirams ({gothirams.length})</CardTitle>
            <CardDescription>
              Manage existing gothiram values
            </CardDescription>
          </CardHeader>
          <CardContent>
            {gothirams.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <List className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No gothirams added yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {gothirams.map((gothiram) => (
                      <TableRow key={gothiram._id}>
                        <TableCell>
                          {editingId === gothiram._id ? (
                            <Input
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="max-w-xs"
                            />
                          ) : (
                            <span className="font-medium">{gothiram.name}</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {gothiram.isActive ? (
                            <Badge className="bg-green-100 text-green-800">Active</Badge>
                          ) : (
                            <Badge variant="outline" className="text-gray-500">Inactive</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(gothiram.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2 justify-end">
                            {editingId === gothiram._id ? (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleSaveEdit(gothiram._id)}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  <Save className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingId(null)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEdit(gothiram)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleToggleActive(gothiram._id, gothiram.isActive)}
                                  className={gothiram.isActive ? "border-yellow-300 text-yellow-700" : "border-green-300 text-green-700"}
                                >
                                  {gothiram.isActive ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDelete(gothiram._id)}
                                  className="border-red-300 text-red-700 hover:bg-red-50"
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

