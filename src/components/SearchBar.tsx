"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, X, User, MapPin, Filter, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SearchResult {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  mobile?: string;
  gothiram?: string;
  nativePlace?: string;
  city?: string;
  state?: string;
  workPlace?: string;
  profilePicture?: string;
  gender?: string;
  enableMarriageFlag?: boolean;
  isApprovedByAdmin?: boolean;
  role?: string;
}

interface SearchBarProps {
  isAdmin?: boolean;
  onSelectUser?: (user: SearchResult) => void;
}

export default function SearchBar({ isAdmin = false, onSelectUser }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [status, setStatus] = useState("approved");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim().length >= 2) {
        performSearch();
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, filter, status]);

  const performSearch = async () => {
    setLoading(true);
    try {
      const endpoint = isAdmin ? '/api/admin/search' : '/api/search';
      const params = new URLSearchParams({
        q: query,
        filter,
        ...(isAdmin && { status })
      });

      const response = await fetch(`${endpoint}?${params}`);
      if (response.ok) {
        const data = await response.json();
        setResults(data.users);
        setShowResults(true);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setShowResults(false);
  };

  const handleSelectUser = (user: SearchResult) => {
    if (onSelectUser) {
      onSelectUser(user);
    }
    setShowResults(false);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      {/* Search Input with Filters */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by name, gothiram, or place..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length >= 2 && setShowResults(true)}
            className="pl-10 pr-10"
          />
          {query && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          {loading && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
          )}
        </div>

        {/* Filter Dropdown */}
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-32">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="gothiram">Gothiram</SelectItem>
            <SelectItem value="place">Place</SelectItem>
            {isAdmin && <SelectItem value="email">Email</SelectItem>}
            {isAdmin && <SelectItem value="mobile">Mobile</SelectItem>}
          </SelectContent>
        </Select>

        {/* Admin Status Filter */}
        {isAdmin && (
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && query.length >= 2 && (
        <Card className="absolute top-full mt-2 w-full max-h-96 overflow-y-auto z-50 shadow-xl">
          {results.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No users found for "{query}"</p>
            </div>
          ) : (
            <div className="divide-y">
              {results.map((user) => (
                <div
                  key={user._id}
                  onClick={() => handleSelectUser(user)}
                  className="p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.profilePicture} />
                      <AvatarFallback className="avs-gradient text-white">
                        {user.firstName?.[0]}{user.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-gray-900">
                          {user.firstName} {user.lastName}
                        </p>
                        {isAdmin && user.role === 'admin' && (
                          <Badge className="bg-red-100 text-red-800 text-xs">Admin</Badge>
                        )}
                        {isAdmin && !user.isApprovedByAdmin && (
                          <Badge variant="outline" className="text-yellow-700 text-xs">Pending</Badge>
                        )}
                        {user.enableMarriageFlag && (
                          <Badge className="bg-pink-100 text-pink-800 text-xs">Matrimony</Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-600">
                        {user.gothiram && (
                          <span className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {user.gothiram}
                          </span>
                        )}
                        {(user.nativePlace || user.city) && (
                          <span className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {user.nativePlace || user.city}
                          </span>
                        )}
                        {isAdmin && user.email && (
                          <span className="truncate max-w-xs">
                            📧 {user.email}
                          </span>
                        )}
                      </div>
                    </div>

                    {user.gender && (
                      <Badge variant="outline" className="text-xs">
                        {user.gender}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {results.length > 0 && (
            <div className="p-2 bg-gray-50 text-center text-xs text-gray-500 border-t">
              Found {results.length} user{results.length !== 1 ? 's' : ''}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

