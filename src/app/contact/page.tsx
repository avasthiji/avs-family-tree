import React from 'react';
import { Mail, MapPin, Phone, Clock, Youtube, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Logo from '@/components/Logo';
import Link from 'next/link';

export default function ContactPage() {
  const EVENT_ENABLED = true;
  
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
              Contact Us
            </h1>
            <div className="inline-block px-4 py-2 bg-red-100 text-red-600 rounded-full text-sm font-medium mb-4">
              Arunadu Vellalar Sangam - USA
            </div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Get in touch with us for inquiries, support, or to learn more about joining the AVS community.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Contact Information */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-red-50 to-orange-50 p-6 rounded-2xl border border-red-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <p className="text-sm text-gray-600">Get in touch via email</p>
                  </div>
                </div>
                <a href="mailto:contact@avs.org" className="text-red-600 hover:underline">
                  contact@avs.org
                </a>
                <br />
                <a href="mailto:shivapillairichmond@gmail.com" className="text-red-600 hover:underline">
                  shivapillairichmond@gmail.com
                </a>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-orange-50 p-6 rounded-2xl border border-red-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Location</h3>
                    <p className="text-sm text-gray-600">Serving across USA</p>
                  </div>
                </div>
                <p className="text-gray-700">
                  AVS EST Chapter USA<br />
                  Multiple Chapters Across United States
                </p>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-orange-50 p-6 rounded-2xl border border-red-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <Youtube className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Social Media</h3>
                    <p className="text-sm text-gray-600">Follow us on YouTube</p>
                  </div>
                </div>
                <a 
                  href="https://www.youtube.com/@USAAVS" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-red-600 hover:underline"
                >
                  @USAAVS
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Send us a Message</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="How can we help?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Your message here..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-gray-50 rounded-3xl p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Office Hours & Support</h2>
            <div className="grid md:grid-cols-2 gap-6 text-gray-700">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Response Time</h3>
                <p>We typically respond to inquiries within 24-48 hours during business days.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">General Inquiries</h3>
                <p>For membership, events, or general information, please use the contact form above or email us directly.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
