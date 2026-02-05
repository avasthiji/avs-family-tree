import React from 'react';
import { Button } from "@/components/ui/button";
import { Users, Heart, TreePine, Globe, Shield, Star, ArrowRight, CheckCircle, Calendar, Award, TrendingUp, Cloud, Lock } from 'lucide-react';
import Logo from '@/components/Logo';
import Link from 'next/link';

export default function Home() {
  const MATRIMONIAL_ENABLED = true;
  const EVENT_ENABLED = true;

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-200 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                {/* <TreePine className="h-6 w-6 text-white" /> */}
                <Logo size="md" className="rounded-xl" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                AVS Family Tree
              </span>
            </div>
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

      {/* Hero Section - Compact */}
      <section className="pt-20 pb-6 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-red-50 via-orange-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-stretch">
            {/* Left Content */}
            <div>
              <div className="inline-block px-4 py-2 bg-red-100 text-red-600 rounded-full text-sm font-medium mb-4">
                அகில இந்திய வேளாளர் சங்கம்
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3 leading-tight">
                <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                  Connect Your Roots,
                </span>
                <br />
                Build Your Future
              </h1>
              <p className="text-base text-gray-600 mb-4 leading-relaxed">
                Discover your heritage, preserve your family legacy, and build lasting relationships within the AVS community worldwide.
              </p>
              
              
              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <div className="text-2xl font-bold text-red-500">100+</div>
                  <div className="text-xs text-gray-600">Families</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-teal-500">100+</div>
                  <div className="text-xs text-gray-600">Members</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-500">100+</div>
                  <div className="text-xs text-gray-600">Matches</div>
                </div>
                {EVENT_ENABLED && (
                  <div>
                    <div className="text-2xl font-bold text-purple-500">50+</div>
                    <div className="text-xs text-gray-600">Events</div>
                  </div>
                )}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <a href="/mission" className="px-3 py-1.5 text-xs rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50">AVS Mission</a>
                <a href="/history" className="px-3 py-1.5 text-xs rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50">AVS History</a>
                <a href="/roles" className="px-3 py-1.5 text-xs rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50">Roles & Responsibility</a>
                <a href="/contact" className="px-3 py-1.5 text-xs rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50">Contact Us</a>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative">
              <div className="relative w-full h-80 bg-gradient-to-br from-red-500 to-orange-500 rounded-3xl p-8 shadow-2xl">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-3xl"></div>
                <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
                  <Logo size="lg" className="mb-4 animate-pulse" />
                  <h3 className="text-2xl font-bold mb-2">Arunadu Vellalar Sangam - USA</h3>
                  <p className="text-center text-white/90">Start building your family tree today</p>
                </div>
              </div>
              {/* Floating Cards */}
              <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">2,500+</div>
                    <div className="text-xs text-gray-600">Active Members</div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <Heart className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">150+</div>
                    <div className="text-xs text-gray-600">Matches Made</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features - Compact Grid */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6">
            
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Powerful Features for Your Family
            </h2>
            <p className="text-gray-600">Everything you need to connect, discover, and preserve</p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-gradient-to-br from-red-50 to-orange-50 p-6 rounded-2xl hover:shadow-xl transition-all duration-300 border border-red-100">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center mb-4">
                <TreePine className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Digital Family Tree</h3>
              <p className="text-sm text-gray-600">Build and visualize your complete family lineage</p>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-red-50 p-6 rounded-2xl hover:shadow-xl transition-all duration-300 border border-pink-100">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-xl flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">AVS Matrimony</h3>
              <p className="text-sm text-gray-600">Find compatible matches within AVS community</p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-6 rounded-2xl hover:shadow-xl transition-all duration-300 border border-yellow-100">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-xl flex items-center justify-center mb-4">
                <Star className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">AVS Kuladeivam in USA</h3>
              <p className="text-sm text-gray-600">Preserve and practice our ancestral worship in the USA</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-2xl hover:shadow-xl transition-all duration-300 border border-purple-100">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">AWS Technology Stack</h3>
              <p className="text-sm text-gray-600">Modern cloud-native platform for scale and reliability</p>
            </div>

            <div className="bg-gradient-to-br from-slate-50 to-gray-50 p-6 rounded-2xl hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-r from-gray-700 to-gray-900 rounded-xl flex items-center justify-center mb-4">
                <Lock className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Privacy Control</h3>
              <p className="text-sm text-gray-600">Granular visibility and member-only access controls</p>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-green-50 p-6 rounded-2xl hover:shadow-xl transition-all duration-300 border border-teal-100">
              <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-green-500 rounded-xl flex items-center justify-center mb-4">
                <Cloud className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Cloud Enabled Security</h3>
              <p className="text-sm text-gray-600">Secure-by-design infrastructure and encrypted data</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits - Two Column Layout */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-6 items-stretch">
            {/* Left - Benefits List */}
            <div className="h-full">
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-gray-100 h-full">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <Logo size="lg" className="rounded-xl" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 leading-tight">AVS</p>
                    <p className="text-base font-semibold text-gray-800 leading-tight">Arunadu Vellalar Sangam - USA</p>
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Why Choose AVS Family Tree?
                </h2>
                <p className="text-sm text-gray-600 mb-5">
                  Connecting AVS (Arunadu Vellalar Sangam - USA) families worldwide, preserving heritage, and building lasting relationships
                </p>

                <div className="space-y-4">
                <div className="flex items-start gap-4 bg-white p-4 rounded-xl shadow-sm">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Trusted & Secure</h3>
                    <p className="text-sm text-gray-600">Enterprise-grade security with admin-approved members</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-white p-4 rounded-xl shadow-sm">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Star className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Authentic Heritage</h3>
                    <p className="text-sm text-gray-600">Connect with verified family members and traditions</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-white p-4 rounded-xl shadow-sm">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Verified Matches</h3>
                    <p className="text-sm text-gray-600">Quality matrimony connections within AVS community</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-white p-4 rounded-xl shadow-sm">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Growing Community</h3>
                    <p className="text-sm text-gray-600">Join thousands of families already connected</p>
                  </div>
                </div>
                </div>
                {/* Compact tags to balance height */}
                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 text-xs rounded-full bg-gray-50 border border-gray-200 text-gray-700">Privacy-first</span>
                  <span className="px-2.5 py-1 text-xs rounded-full bg-gray-50 border border-gray-200 text-gray-700">Admin Approved</span>
                  <span className="px-2.5 py-1 text-xs rounded-full bg-gray-50 border border-gray-200 text-gray-700">Community-run</span>
                </div>
              </div>
            </div>

            {/* Right - Informational Content */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-gray-100 h-full">
              <div className="space-y-6 text-gray-800">
                <div>
                  <h3 className="text-xl font-bold mb-2">AVS EST Chapter USA</h3>
                  <p className="text-sm text-gray-700">The AVS EST Chapter USA aims to unite members of the Arayiyamman Vellalar community across the United States under one collaborative and cultural platform. Its mission is to preserve our shared heritage, promote educational and social growth, and create opportunities for networking, mentoring, and community service among AVS families settled in North America.</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">AVS Family Tree</h3>
                  <p className="text-sm text-gray-700">The AVS Family Tree initiative is dedicated to preserving our lineage, recording ancestral connections, and strengthening the bond among generations. By building a verified digital genealogy, we ensure that every descendant remains connected to their roots, understanding both the legacy and values of the AVS community that bind us together as one extended family.</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">AVS Matrimony</h3>
                  <p className="text-sm text-gray-700">AVS Matrimony strives to support families in finding compatible life partners within the community by upholding cultural values and mutual respect. Beyond matchmaking, it focuses on nurturing lifelong relationships built on trust, tradition, and shared aspirations, fostering unity among global AVS families.</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Kuladeivam in USA</h3>
                  <p className="text-sm text-gray-700">The Kuladeivam in USA initiative seeks to preserve and promote worship of our ancestral deity and temple traditions in a respectful and organized manner. It provides a sacred space for AVS families abroad to participate in rituals, festivals, and spiritual gatherings, ensuring that our divine heritage continues to guide our community across generations and geographies.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Compact */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-red-500 to-orange-500">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 text-center border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-3">
              Start Your Journey Today
            </h2>
            <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
              Join thousands of families preserving their heritage and building connections
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/auth/register">
                <button className="px-6 py-3 bg-white text-red-500 rounded-lg font-medium hover:shadow-lg transition-all flex items-center">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </Link>
              <Link href="https://www.youtube.com/@USAAVS" target="_blank" rel="noopener noreferrer">
                <button className="px-6 py-3 bg-white text-red-500 rounded-lg font-medium hover:shadow-lg transition-all flex items-center">
                  Watch Demo
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Compact */}
      <footer className="bg-gray-900 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6 mb-6">
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <Logo size="md" className="rounded-xl" />
                </div>
                <span className="font-bold">AVS Family Tree</span>
              </div>
              <p className="text-sm text-gray-400">
                Connecting AVS families worldwide
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-sm">Community</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-gray-400 hover:text-white">Join Us</a></li>
                <li><a href="#" className="text-sm text-gray-400 hover:text-white">Matrimony</a></li>
                <li><a href="#" className="text-sm text-gray-400 hover:text-white">Events</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-sm">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-gray-400 hover:text-white">Family Tree</a></li>
                <li><a href="#" className="text-sm text-gray-400 hover:text-white">Find Relatives</a></li>
                <li><a href="#" className="text-sm text-gray-400 hover:text-white">About</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-sm">Connect</h3>
              <div className="flex space-x-3 mb-3">
                <a href="https://www.youtube.com/@USAAVS" className="text-gray-400 hover:text-white">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.017 3.017 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
              <a href="mailto:contact@avs.org" className="text-sm text-gray-400 hover:text-white">
                contact@avs.org
              </a>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 text-center text-sm text-gray-400">
            <p>&copy; 2025 AVS Family Tree. அகில இந்திய வேளாளர் சங்கம்</p>
          </div>
        </div>
      </footer>
    </div>
  );
}