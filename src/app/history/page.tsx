import React from 'react';
import { Calendar, Users, Globe, Award, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Logo from '@/components/Logo';
import Link from 'next/link';

export default function HistoryPage() {
  const EVENT_ENABLED = true;
  
  const timeline = [
    {
      year: '2020',
      title: 'Foundation',
      description: 'AVS EST Chapter USA was established to bring together Arunadu Vellalar families across the United States. The initial group of founding members laid the groundwork for community growth and cultural preservation.',
    },
    {
      year: '2021',
      title: 'Community Expansion',
      description: 'The community grew to over 500 families, with regular meetups and cultural events organized across major US cities. Family tree documentation initiatives began.',
    },
    {
      year: '2022',
      title: 'Digital Platform Launch',
      description: 'The AVS Family Tree platform was launched, enabling families to document their lineage digitally and connect with relatives. Matrimonial services were introduced.',
    },
    {
      year: '2023',
      title: 'Kuladeivam Initiative',
      description: 'Kuladeivam worship programs were established in the USA, allowing families to practice their ancestral traditions. Regular puja ceremonies and spiritual gatherings began.',
    },
    {
      year: '2024',
      title: 'Growth Milestone',
      description: 'Reached 2,500+ active members across North America. Enhanced platform features including advanced family tree visualization and verified member system.',
    },
    {
      year: '2025',
      title: 'Present Day',
      description: 'Continuing to expand our services, strengthen community bonds, and preserve our rich heritage for future generations through innovative technology and dedicated community efforts.',
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
        {/* Back Button */}
        <div className="max-w-5xl mx-auto mb-6">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              AVS History
            </h1>
            <div className="inline-block px-4 py-2 bg-red-100 text-red-600 rounded-full text-sm font-medium mb-4">
              Arunadu Vellalar Sangam - USA
            </div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover the journey of AVS EST Chapter USA from its foundation to becoming a thriving community 
              of over 2,500 members across North America.
            </p>
          </div>

          {/* Origin Story */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl p-8 mb-12 border border-red-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Origins</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The Arunadu Vellalar Sangam (AVS) has deep roots in Tamil Nadu, India, representing the 
              Araviyamman Vellalar community. As families began settling in the United States, there was a 
              growing need to maintain cultural connections, preserve family lineages, and build a supportive 
              community network.
            </p>
            <p className="text-gray-700 leading-relaxed">
              In 2020, a group of dedicated community members came together to establish the AVS EST Chapter USA, 
              creating a platform that would unite families across states, document family trees, facilitate 
              matrimonial connections, and preserve our rich cultural heritage for future generations.
            </p>
          </div>

          {/* Timeline */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Our Journey</h2>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-500 to-orange-500"></div>
              
              {/* Timeline items */}
              <div className="space-y-8">
                {timeline.map((item, index) => (
                  <div key={index} className="relative flex items-start gap-6">
                    <div className="relative z-10 flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                        <Calendar className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-all">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl font-bold text-red-600">{item.year}</span>
                        <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                      </div>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-red-50 to-orange-50 p-6 rounded-2xl text-center border border-red-100">
              <Users className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-gray-900 mb-1">2,500+</div>
              <div className="text-sm text-gray-600">Active Members</div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-orange-50 p-6 rounded-2xl text-center border border-red-100">
              <Award className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-gray-900 mb-1">500+</div>
              <div className="text-sm text-gray-600">Families</div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-orange-50 p-6 rounded-2xl text-center border border-red-100">
              <Globe className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-gray-900 mb-1">50+</div>
              <div className="text-sm text-gray-600">Cities</div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-orange-50 p-6 rounded-2xl text-center border border-red-100">
              <Calendar className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-gray-900 mb-1">100+</div>
              <div className="text-sm text-gray-600">Events</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
