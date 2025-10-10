"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Database, Users, Heart, Calendar } from "lucide-react";

export default function SeedPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSeedDatabase = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/admin/seed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          secret: "avs-seed-secret-2024"
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to seed database");
        return;
      }

      setSuccess("Database seeded successfully!");
      
    } catch (error) {
      console.error("Seeding error:", error);
      setError("An error occurred while seeding the database");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] via-white to-[#F8F9FA] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="avs-card border-0 shadow-2xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto avs-gradient rounded-full flex items-center justify-center mb-4">
              <Database className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold avs-text-gradient">Seed Demo Data</CardTitle>
            <CardDescription>
              Initialize the database with demo users, relationships, and events for testing
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert className="border-green-200 bg-green-50">
                <AlertDescription className="text-green-800">{success}</AlertDescription>
              </Alert>
            )}

            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-[#E63946] to-[#F77F00] rounded-lg text-white">
                <Users className="h-8 w-8 mx-auto mb-2" />
                <h3 className="font-semibold">10 Users</h3>
                <p className="text-sm opacity-90">Including admin, matchmaker, and regular users</p>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-[#2A9D8F] to-[#4361EE] rounded-lg text-white">
                <Heart className="h-8 w-8 mx-auto mb-2" />
                <h3 className="font-semibold">3 Relationships</h3>
                <p className="text-sm opacity-90">Family connections and siblings</p>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-[#7209B7] to-[#4361EE] rounded-lg text-white">
                <Calendar className="h-8 w-8 mx-auto mb-2" />
                <h3 className="font-semibold">4 Events</h3>
                <p className="text-sm opacity-90">Community events and gatherings</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-gray-900">Demo Accounts Created:</h4>
              <div className="space-y-1 text-sm">
                <div><strong>Admin:</strong> admin@avs.com / admin123</div>
                <div><strong>Matchmaker:</strong> matchmaker@avs.com / matchmaker123</div>
                <div><strong>User:</strong> suresh.raman@email.com / password123</div>
                <div><strong>Pending:</strong> vijay.mohan@email.com / password123</div>
              </div>
            </div>

            <Button
              onClick={handleSeedDatabase}
              className="w-full avs-button-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Seeding Database...
                </>
              ) : (
                <>
                  <Database className="mr-2 h-4 w-4" />
                  Seed Database
                </>
              )}
            </Button>

            <div className="text-center text-sm text-gray-500">
              <p>⚠️ This will clear all existing data and create fresh demo data.</p>
              <p>Only use this for development/testing purposes.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
