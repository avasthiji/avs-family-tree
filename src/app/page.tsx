import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Logo from "@/components/Logo";
import { MATRIMONIAL_ENABLED, EVENT_ENABLED } from "@/lib/features";
import {
  Users,
  Heart,
  TreePine,
  Globe,
  Shield,
  Star,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] via-white to-[#F8F9FA]">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3">
              <Logo size="md" className="rounded-xl" />
              <span className="text-xl font-bold avs-text-gradient">
                AVS Family Tree
              </span>
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              {/* <Link href="/about/history" className="text-gray-600 hover:text-[#E63946] transition-colors">
                AVS History
              </Link>
              <Link href="/about/roles" className="text-gray-600 hover:text-[#E63946] transition-colors">
                Roles
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-[#E63946] transition-colors">
                Contact
              </Link> */}
              {EVENT_ENABLED && (
                <Link
                  href="/events"
                  className="text-gray-600 hover:text-[#E63946] transition-colors"
                >
                  Events
                </Link>
              )}
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

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="mb-8">
              <div className="mx-auto mb-6">
                <Logo
                  size="xl"
                  className="rounded-full mx-auto"
                  showAnimation={true}
                />
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="avs-text-gradient">AVS Family Tree</span>
              </h1>
              <p className="text-xl text-gray-600 mb-4">
                அகில இந்திய வேளாளர் சங்கம்
              </p>
              <p className="text-lg text-gray-500 max-w-3xl mx-auto leading-relaxed">
                Connect with your roots, discover your heritage, and build
                lasting relationships within the AVS community. Preserve your
                family legacy for future generations.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link href="/auth/register">
                <Button
                  size="lg"
                  className="avs-button-primary text-lg px-8 py-4"
                >
                  Join Our Community
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/about/history">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-[#2A9D8F] text-[#2A9D8F] hover:bg-[#2A9D8F] hover:text-white text-lg px-8 py-4"
                >
                  Learn More
                </Button>
              </Link>
            </div>

            {/* Statistics */}
            <div
              className={`grid grid-cols-2 md:grid-cols-${
                EVENT_ENABLED ? "4" : "3"
              } gap-8 max-w-4xl mx-auto`}
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-[#E63946] mb-2">
                  500+
                </div>
                <div className="text-gray-600">Families Connected</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#2A9D8F] mb-2">
                  2,500+
                </div>
                <div className="text-gray-600">Active Members</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#F77F00] mb-2">
                  150+
                </div>
                <div className="text-gray-600">Matches Made</div>
              </div>
              {EVENT_ENABLED && (
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#7209B7] mb-2">
                    50+
                  </div>
                  <div className="text-gray-600">Events Hosted</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the powerful tools that help you connect, explore, and
              preserve your family heritage
            </p>
          </div>

          <div
            className={`grid md:grid-cols-2 lg:grid-cols-${
              EVENT_ENABLED ? "4" : "3"
            } gap-8`}
          >
            <Card className="avs-card border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 avs-gradient rounded-full flex items-center justify-center mx-auto mb-6">
                  <TreePine className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">
                  Family Tree Creation
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Build and visualize your family tree with our intuitive tools.
                  Connect generations and preserve your lineage.
                </p>
              </CardContent>
            </Card>

            {MATRIMONIAL_ENABLED && (
              <Card className="avs-card border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 avs-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                    <Heart className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">
                    Matrimony Services
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Connect with compatible matches within the AVS community.
                    Find your life partner with our trusted platform.
                  </p>
                </CardContent>
              </Card>
            )}

            <Card className="avs-card border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 avs-gradient-purple rounded-full flex items-center justify-center mx-auto mb-6">
                  <Globe className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">
                  Cultural Heritage
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Preserve and celebrate AVS traditions, customs, and cultural
                  heritage for future generations.
                </p>
              </CardContent>
            </Card>

            <Card className="avs-card border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-[#F77F00] to-[#E63946] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">
                  Community Connection
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Join events, connect with relatives, and be part of the
                  vibrant AVS community worldwide.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose AVS Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#F8F9FA] to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose AVS Family Tree?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're more than just a family tree platform - we're your gateway
              to the AVS community
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-[#E63946] to-[#F77F00] rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">
                Trusted & Secure
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Your data is protected with enterprise-grade security.
                Admin-approved members ensure a safe community.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-[#2A9D8F] to-[#4361EE] rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">
                Authentic Heritage
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Connect with verified family members and discover your authentic
                AVS heritage and traditions.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-[#7209B7] to-[#4361EE] rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">
                Verified Matches
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Our matchmaking service connects you with verified, compatible
                matches within the AVS community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#E63946] to-[#F77F00]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Join Our Community?
          </h2>
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            Start your journey today and discover the connections that matter
            most. Your family tree awaits, and so does your future within the
            AVS community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button
                size="lg"
                className="bg-white text-[#E63946] hover:bg-gray-100 text-lg px-8 py-4"
              >
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-[#E63946] hover:bg-white hover:text-[#E63946] text-lg px-8 py-4"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-white/10 p-1 rounded-lg">
                  <Logo size="md" className="rounded-lg" />
                </div>
                <span className="text-lg font-bold">AVS Family Tree</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Connecting AVS families worldwide, preserving heritage, and
                building lasting relationships.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about/history"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    AVS History
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about/roles"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Roles & Responsibilities
                  </Link>
                </li>
                {EVENT_ENABLED && (
                  <li>
                    <Link
                      href="/events"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Upcoming Events
                    </Link>
                  </li>
                )}
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Community</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/auth/register"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Join Us
                  </Link>
                </li>
                {MATRIMONIAL_ENABLED && (
                  <li>
                    <Link
                      href="/matrimony"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Matrimony
                    </Link>
                  </li>
                )}
                <li>
                  <Link
                    href="/search"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Find Relatives
                  </Link>
                </li>
                <li>
                  <Link
                    href="/family-tree"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Family Tree
                  </Link>
                </li>
                {EVENT_ENABLED && (
                  <li>
                    <Link
                      href="/events"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Events
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <p className="text-gray-400 mb-4">Follow us on social media</p>
              <div className="flex space-x-4">
                <a
                  href="https://www.youtube.com/@USAAVS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <span className="sr-only">YouTube</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.017 3.017 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>
              &copy; 2024 AVS Family Tree. All rights reserved. அகில இந்திய
              வேளாளர் சங்கம்
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
