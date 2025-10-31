import React from 'react';
import { Target, Heart, Users, Shield, Globe } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Logo from '@/components/Logo';
import Link from 'next/link';

export default function MissionPage() {
  const EVENT_ENABLED = true;
  
  const missionPoints = [
    {
      icon: Target,
      title: 'Preserve Heritage',
      description: 'Maintain and document our rich cultural traditions, lineage, and ancestral connections for future generations.',
    },
    {
      icon: Heart,
      title: 'Build Relationships',
      description: 'Foster meaningful connections within the AVS community through family tree networks and matrimonial services.',
    },
    {
      icon: Users,
      title: 'Community Growth',
      description: 'Support educational, social, and professional development of AVS families across North America.',
    },
    {
      icon: Shield,
      title: 'Trust & Security',
      description: 'Ensure privacy and security while building verified, authentic family relationships.',
    },
    {
      icon: Globe,
      title: 'Cultural Unity',
      description: 'Promote our Kuladeivam traditions and spiritual practices in the United States.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-200 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Logo size="md" className="rounded-xl" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                AVS Family Tree
              </span>
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              {EVENT_ENABLED && (
                <a href="/events" className="text-gray-600 hover:text-red-500 transition-colors text-sm font-medium">
                  Events
                </a>
              )}
              <a href="/mission" className="text-gray-600 hover:text-red-500 transition-colors text-sm font-medium">
                AVS Mission
              </a>
              <a href="/history" className="text-gray-600 hover:text-red-500 transition-colors text-sm font-medium">
                AVS History
              </a>
              <a href="/roles" className="text-gray-600 hover:text-red-500 transition-colors text-sm font-medium">
                Roles & Responsibility
              </a>
              <a href="/contact" className="text-gray-600 hover:text-red-500 transition-colors text-sm font-medium">
                Contact Us
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button
                  variant="outline"
                  className="border-[#E63946] text-[#E63946] hover:bg-[#E63946] hover:text-white"
                >
                  Login
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="avs-button-primary">Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              AVS Mission
            </h1>
            <div className="inline-block px-4 py-2 bg-red-100 text-red-600 rounded-full text-sm font-medium mb-4">
              Arunadu Vellalar Sangam - USA
            </div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our mission is to unite members of the Arunadu Vellalar community across the United States, 
              preserving our shared heritage while building lasting connections for generations to come.
            </p>
          </div>

          {/* Mission Statement */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl p-8 mb-12 border border-red-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission Statement</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The AVS EST Chapter USA aims to unite members of the Araviyamman Vellalar community across 
              the United States under one collaborative and cultural platform. Our mission is to preserve 
              our shared heritage, promote educational and social growth, and create opportunities for 
              networking, mentoring, and community service among AVS families settled in North America.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Through our family tree platform, matrimonial services, and cultural initiatives, we strive 
              to strengthen the bonds that connect us, ensuring that every member feels a sense of belonging 
              and continuity with their ancestral roots.
            </p>
          </div>

          {/* Mission Pillars */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Our Core Objectives</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {missionPoints.map((point, index) => {
                const Icon = point.icon;
                return (
                  <div key={index} className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-all">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{point.title}</h3>
                    <p className="text-sm text-gray-600">{point.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Vision */}
          <div className="bg-gray-50 rounded-3xl p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
            <p className="text-gray-700 leading-relaxed">
              To create a thriving, connected AVS community in the United States where every family can 
              trace their roots, preserve their heritage, and build meaningful relationships within a secure, 
              trusted platform. We envision a future where generations to come will have access to their complete 
              family history, cultural traditions, and a strong support network that spans across states and borders.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
