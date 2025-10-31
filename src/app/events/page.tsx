import React from 'react';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import Logo from '@/components/Logo';
import Link from 'next/link';

export default function EventsPage() {
  const upcomingEvents = [
    {
      id: 1,
      title: 'AVS Annual Meet 2025',
      date: 'March 15, 2025',
      location: 'Dallas, TX',
      attendees: '250+',
      description: 'Join us for our annual community gathering featuring cultural programs, networking, and family tree updates.',
    },
    {
      id: 2,
      title: 'Kuladeivam Puja Ceremony',
      date: 'April 20, 2025',
      location: 'Houston, TX',
      attendees: '150+',
      description: 'Participate in our traditional ancestral deity worship ceremony and spiritual gathering.',
    },
    {
      id: 3,
      title: 'AVS Youth Meet',
      date: 'May 10, 2025',
      location: 'Atlanta, GA',
      attendees: '100+',
      description: 'Young members of AVS community come together for networking, mentoring, and cultural activities.',
    },
  ];

  const pastEvents = [
    {
      id: 1,
      title: 'AVS Annual Meet 2024',
      date: 'March 20, 2024',
      location: 'New York, NY',
      attendees: '200+',
    },
    {
      id: 2,
      title: 'Family Tree Workshop',
      date: 'August 15, 2024',
      location: 'Chicago, IL',
      attendees: '75+',
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
            <Link href="/">
              <button className="text-sm text-gray-600 hover:text-red-500">Back to Home</button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              AVS Events
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join our community events, cultural gatherings, and networking opportunities across the United States.
            </p>
          </div>

          {/* Upcoming Events */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Events</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="bg-gradient-to-br from-red-50 to-orange-50 p-6 rounded-2xl border border-red-100 hover:shadow-lg transition-all">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="h-5 w-5 text-red-600" />
                    <span className="text-sm font-semibold text-red-600">{event.date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{event.title}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      {event.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      {event.attendees} Expected
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-4">{event.description}</p>
                  <button className="w-full px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg font-medium hover:shadow-lg transition-all">
                    Register Now
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Past Events */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Past Events</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {pastEvents.map((event) => (
                <div key={event.id} className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {event.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {event.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {event.attendees}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
