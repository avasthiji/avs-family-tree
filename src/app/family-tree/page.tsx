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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader } from "@/components/ui/loader";
import AppHeader from "@/components/AppHeader";
import BackButton from "@/components/BackButton";
import Link from "next/link";
import { TreePine, Search, Users, Plus, Network, List } from "lucide-react";
import D3FamilyTree from "@/components/D3FamilyTree";
import UserDetailsModal from "@/components/UserDetailsModal";

interface Relationship {
  _id: string;
  personId1: any;
  personId2: any;
  relationType: string;
  isApproved: boolean;
}

export default function FamilyTreePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/auth/login");
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
    } finally {
      setLoading(false);
    }
  };

  const handleNodeClick = (userId: string) => {
    setSelectedUserId(userId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUserId(null);

    // Clear card highlight when modal closes
    const clickedCards = document.querySelectorAll(".card-clicked");
    clickedCards.forEach((card) => card.classList.remove("card-clicked"));
  };

  useEffect(() => {
    // Listen for node clicks from the modal's family tree tab
    const handleUserProfileNodeClick = (event: CustomEvent) => {
      const { userId } = event.detail;
      setSelectedUserId(userId);
      setIsModalOpen(true);
    };

    window.addEventListener('userProfileNodeClick', handleUserProfileNodeClick as EventListener);
    return () => {
      window.removeEventListener('userProfileNodeClick', handleUserProfileNodeClick as EventListener);
    };
  }, []);

  if (status === "loading" || loading) {
    return <Loader variant="page" text="Loading family tree..." size="lg" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] via-white to-[#F8F9FA]">
      <AppHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <BackButton href="/dashboard" label="Back to Dashboard" />
        
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <TreePine className="h-6 w-6 sm:h-8 sm:w-8 mr-2 sm:mr-3 text-[#E63946]" />
            Family Tree
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Visualize and manage your family relationships
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="avs-card border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 avs-gradient rounded-lg flex items-center justify-center mb-2">
                <Search className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg">Find Relatives</CardTitle>
              <CardDescription>
                Search for family members in the AVS community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/search">
                <Button className="w-full avs-button-primary">
                  Search Members
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="avs-card border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 avs-gradient-secondary rounded-lg flex items-center justify-center mb-2">
                <Plus className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg">Add Relationship</CardTitle>
              <CardDescription>
                Connect with your family members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/relationships">
                <Button className="w-full avs-button-secondary">
                  Add Connection
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Family Tree Visualization */}
        <Card className="avs-card border-0 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Network className="h-5 w-5 mr-2 text-[#E63946]" />
                Interactive Family Tree
              </span>
              <Link href="/relationships">
                <Button size="sm" className="avs-button-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Manage Relationships
                </Button>
              </Link>
            </CardTitle>
            <CardDescription>
              Drag to pan • Scroll to zoom • Click nodes to see details
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="visual" className="w-full">
              <div className="px-6 pt-2">
                {/* <TabsList className="grid w-full max-w-[400px] grid-cols-2">
                  <TabsTrigger value="visual">
                    <Network className="h-4 w-4 mr-2" />
                    Visual Tree
                  </TabsTrigger>
                  <TabsTrigger value="list">
                    <List className="h-4 w-4 mr-2" />
                    List View
                  </TabsTrigger>
                </TabsList> */}
              </div>

              <TabsContent value="visual" className="p-6">
                {session && (
                  <D3FamilyTree
                    relationships={relationships}
                    currentUserId={session.user.id}
                    currentUserName={`${session.user.firstName} ${session.user.lastName}`}
                    onNodeClick={handleNodeClick}
                  />
                )}
              </TabsContent>

              <TabsContent value="list" className="p-6">
                <div className="space-y-4">
                  {relationships.length === 0 ? (
                    <div className="text-center py-12">
                      <TreePine className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No relationships found
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Start building your family tree by searching for
                        relatives and adding connections.
                      </p>
                      <Link href="/relationships">
                        <Button className="avs-button-primary">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Your First Relationship
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    relationships.map((rel) => {
                      const isCurrentUserPerson1 =
                        rel.personId1?._id === session?.user.id;
                      const otherPerson = isCurrentUserPerson1
                        ? rel.personId2
                        : rel.personId1;

                      return (
                        <div
                          key={rel._id}
                          className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 avs-gradient rounded-full flex items-center justify-center">
                              <Users className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {otherPerson?.firstName} {otherPerson?.lastName}
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
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Approved
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Pending
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* User Details Modal */}
      <UserDetailsModal
        userId={selectedUserId}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
