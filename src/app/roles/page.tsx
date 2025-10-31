import React from 'react';
import { Users, Shield, Award, Heart, Globe, Settings } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Logo from '@/components/Logo';
import Link from 'next/link';

export default function RolesPage() {
  const EVENT_ENABLED = true;
  
  const roles = [
    {
      icon: Shield,
      title: 'Administrator',
      responsibilities: [
        'Oversee platform operations and member approvals',
        'Manage community guidelines and policies',
        'Coordinate with chapter leadership',
        'Ensure data security and privacy compliance',
      ],
      color: 'from-red-500 to-orange-500',
    },
    {
      icon: Users,
      title: 'Chapter Leaders',
      responsibilities: [
        'Represent AVS EST Chapter USA in their regions',
        'Organize local events and gatherings',
        'Facilitate community networking',
        'Support new member onboarding',
      ],
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Heart,
      title: 'Matrimony Coordinators',
      responsibilities: [
        'Assist families in matrimonial matches',
        'Verify member profiles and backgrounds',
        'Coordinate match discussions',
        'Ensure cultural compatibility',
      ],
      color: 'from-pink-500 to-rose-500',
    },
    {
      icon: Globe,
      title: 'Cultural Coordinators',
      responsibilities: [
        'Organize Kuladeivam worship programs',
        'Plan cultural events and festivals',
        'Preserve and promote traditions',
        'Coordinate spiritual gatherings',
      ],
      color: 'from-purple-500 to-indigo-500',
    },
    {
      icon: Award,
      title: 'Family Tree Archivists',
      responsibilities: [
        'Help families document their lineage',
        'Verify family connections and relationships',
        'Maintain genealogy accuracy',
        'Assist with family tree updates',
      ],
      color: 'from-amber-500 to-yellow-500',
    },
    {
      icon: Settings,
      title: 'Technical Support',
      responsibilities: [
        'Platform maintenance and updates',
        'Technical assistance for members',
        'Data backup and security',
        'Feature development and improvements',
      ],
      color: 'from-gray-600 to-gray-800',
    },
  ];

  const memberResponsibilities = [
    'Maintain accurate profile information',
    'Respect community guidelines and privacy',
    'Actively participate in community activities',
    'Support family tree documentation',
    'Engage respectfully in matrimonial discussions',
    'Contribute to cultural preservation efforts',
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
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Roles & Responsibility
            </h1>
            <div className="inline-block px-4 py-2 bg-red-100 text-red-600 rounded-full text-sm font-medium mb-4">
              Arunadu Vellalar Sangam - USA
            </div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Understanding the roles and responsibilities that keep our AVS community thriving and connected.
            </p>
          </div>

          {/* Roles Grid */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Community Roles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roles.map((role, index) => {
                const Icon = role.icon;
                return (
                  <div key={index} className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-all">
                    <div className={`w-12 h-12 bg-gradient-to-r ${role.color} rounded-xl flex items-center justify-center mb-4`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">{role.title}</h3>
                    <ul className="space-y-2">
                      {role.responsibilities.map((resp, respIndex) => (
                        <li key={respIndex} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-red-500 mt-1">•</span>
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Member Responsibilities */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl p-8 mb-12 border border-red-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Member Responsibilities</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {memberResponsibilities.map((responsibility, index) => (
                <div key={index} className="flex items-start gap-3 bg-white p-4 rounded-xl">
                  <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">{index + 1}</span>
                  </div>
                  <p className="text-gray-700">{responsibility}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Code of Conduct */}
          <div className="bg-gray-50 rounded-3xl p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Community Code of Conduct</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                All members of the AVS community are expected to maintain respect, integrity, and cultural sensitivity 
                in all interactions. We value privacy, authenticity, and mutual support in building lasting relationships 
                within our community.
              </p>
              <p>
                Members are encouraged to actively participate in community events, contribute to family tree documentation, 
                and support each other in preserving our shared heritage. Any concerns or violations of community guidelines 
                should be reported to administrators immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
