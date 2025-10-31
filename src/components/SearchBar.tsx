"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import {
  Search,
  X,
  User,
  Mail,
  MapPin,
  Filter,
  Loader2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Eye,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { env } from "@/lib/env";
import UserDetailsModal from "@/components/UserDetailsModal";

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
  onViewProfile?: (userId: string) => void;
  onSearchChange?: () => void; // New callback for when search changes
}

interface GothiramOption {
  _id: string;
  name: string;
  tamilName: string;
}

export default function SearchBar({
  isAdmin = false,
  onSelectUser,
  onViewProfile,
  onSearchChange,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const status = "approved"; // Always search approved users only
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Advanced Search State - Make Advanced Search default
  const [showAdvanced, setShowAdvanced] = useState(true);
  const [advancedName, setAdvancedName] = useState("");
  const [advancedEmail, setAdvancedEmail] = useState("");
  const [advancedNativePlace, setAdvancedNativePlace] = useState("");
  const [advancedGothiram, setAdvancedGothiram] = useState("");
  const [gothiramOptions, setGothiramOptions] = useState<GothiramOption[]>([]);

  // User Details Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Load Gothiram options
  useEffect(() => {
    const loadGothirams = async () => {
      try {
        const response = await fetch("/api/gothiram");
        if (response.ok) {
          const data = await response.json();
          setGothiramOptions(data.gothirams || []);
        }
      } catch (error) {
        console.error("Failed to load gothirams:", error);
      }
    };
    loadGothirams();
  }, []);

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search for quick search
  useEffect(() => {
    if (!showAdvanced) {
      const delayDebounceFn = setTimeout(() => {
        if (query.trim().length >= 2) {
          performSearch();
        } else {
          setResults([]);
        }
      }, 300);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [query, filter, status, showAdvanced]);

  // Debounced search for advanced search
  useEffect(() => {
    if (showAdvanced) {
      const delayDebounceFn = setTimeout(() => {
        if (
          advancedName.trim().length >= 2 ||
          advancedEmail.trim().length >= 2 ||
          advancedNativePlace.trim().length >= 2 ||
          advancedGothiram
        ) {
          performAdvancedSearch();
        } else {
          setResults([]);
        }
      }, 300);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [
    advancedName,
    advancedEmail,
    advancedNativePlace,
    advancedGothiram,
    status,
    showAdvanced,
  ]);

  const performSearch = async () => {
    // Call the onSearchChange callback to clear selected user
    if (onSearchChange) {
      onSearchChange();
    }

    setLoading(true);
    try {
      const endpoint = isAdmin ? "/api/admin/search" : "/api/search";
      const params = new URLSearchParams({
        q: query,
        filter,
        ...(isAdmin && { status }),
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

  const performAdvancedSearch = async () => {
    // Call the onSearchChange callback to clear selected user
    if (onSearchChange) {
      onSearchChange();
    }

    setLoading(true);
    try {
      const endpoint = isAdmin ? "/api/admin/search" : "/api/search";
      const params = new URLSearchParams({
        ...(advancedName && { name: advancedName }),
        ...(advancedEmail && { email: advancedEmail }),
        ...(advancedNativePlace && { nativePlace: advancedNativePlace }),
        ...(advancedGothiram &&
          advancedGothiram !== "__none__" && { gothiram: advancedGothiram }),
        advanced: "true",
        ...(isAdmin && { status }),
      });

      const response = await fetch(`${endpoint}?${params}`);
      if (response.ok) {
        const data = await response.json();
        setResults(data.users);
        setShowResults(true);
      }
    } catch (error) {
      console.error("Advanced search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setShowResults(false);
  };

  const handleClearAdvanced = () => {
    setAdvancedName("");
    setAdvancedEmail("");
    setAdvancedNativePlace("");
    setAdvancedGothiram("");
    setResults([]);
    setShowResults(false);
  };

  const handleSelectUser = (user: SearchResult) => {
    // Open the modal with selected user
    setSelectedUserId(user._id);
    setIsModalOpen(true);
    setShowResults(false); // Close search results popup

    // Still call the callback if provided
    if (onSelectUser) {
      onSelectUser(user);
    }
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <Card className="avs-card border border-gray-200 shadow-md overflow-hidden bg-white">
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-[#E63946] to-[#F77F00] rounded-lg">
                <Search className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Search Members
              </h3>
            </div>

            {/* Search Mode Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => {
                  setShowAdvanced(false);
                  handleClearAdvanced();
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  !showAdvanced
                    ? "bg-white text-[#E63946] shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <Search className="h-4 w-4 mr-2 inline" />
                Quick
              </button>
              <button
                onClick={() => {
                  setShowAdvanced(true);
                  handleClear();
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  showAdvanced
                    ? "bg-[#E63946] text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <Sparkles className="h-4 w-4 mr-2 inline" />
                Advanced
              </button>
            </div>
          </div>

          {!showAdvanced ? (
            /* Quick Search */
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search by name, gothiram, or place..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length >= 2 && setShowResults(true)}
                    className="pl-10 pr-10 h-11 border-gray-200 focus:border-[#E63946]"
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
                  <SelectTrigger className="w-36 h-11 border-gray-200">
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

                {/* Admin Status Filter - REMOVED: Always search approved users only */}
                {/* {isAdmin && (
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="w-36 h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                    </SelectContent>
                  </Select>
                )} */}
              </div>
            </div>
          ) : (
            /* Advanced Search */
            <div className="space-y-4">
              {/* Search Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Name Field */}
                <div>
                  <Label
                    htmlFor="advancedName"
                    className="text-sm font-medium text-gray-700 mb-2 flex items-center"
                  >
                    <User className="h-4 w-4 mr-2 text-[#E63946]" />
                    Name
                  </Label>
                  <Input
                    id="advancedName"
                    type="text"
                    placeholder="Enter name..."
                    value={advancedName}
                    onChange={(e) => setAdvancedName(e.target.value)}
                    onFocus={() =>
                      (advancedName.length >= 2 ||
                        advancedEmail.length >= 2 ||
                        advancedNativePlace.length >= 2 ||
                        advancedGothiram) &&
                      setShowResults(true)
                    }
                    className="h-11 border-gray-200 focus:border-[#E63946]"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <Label
                    htmlFor="advancedEmail"
                    className="text-sm font-medium text-gray-700 mb-2 flex items-center"
                  >
                    <Mail className="h-4 w-4 mr-2 text-[#E63946]" />
                    Email
                  </Label>
                  <Input
                    id="advancedEmail"
                    type="email"
                    placeholder="Enter email..."
                    value={advancedEmail}
                    onChange={(e) => setAdvancedEmail(e.target.value)}
                    onFocus={() =>
                      (advancedName.length >= 2 ||
                        advancedEmail.length >= 2 ||
                        advancedNativePlace.length >= 2 ||
                        advancedGothiram) &&
                      setShowResults(true)
                    }
                    className="h-11 border-gray-200 focus:border-[#E63946]"
                  />
                </div>

                {/* Native Place Field */}
                <div>
                  <Label
                    htmlFor="advancedNativePlace"
                    className="text-sm font-medium text-gray-700 mb-2 flex items-center"
                  >
                    <MapPin className="h-4 w-4 mr-2 text-[#E63946]" />
                    Native Place
                  </Label>
                  <Input
                    id="advancedNativePlace"
                    type="text"
                    placeholder="Enter native place..."
                    value={advancedNativePlace}
                    onChange={(e) => setAdvancedNativePlace(e.target.value)}
                    onFocus={() =>
                      (advancedName.length >= 2 ||
                        advancedEmail.length >= 2 ||
                        advancedNativePlace.length >= 2 ||
                        advancedGothiram) &&
                      setShowResults(true)
                    }
                    className="h-11 border-gray-200 focus:border-[#E63946]"
                  />
                </div>

                {/* Gothiram Dropdown */}
                <div>
                  <Label
                    htmlFor="advancedGothiram"
                    className="text-sm font-medium text-gray-700 mb-2 flex items-center"
                  >
                    <Filter className="h-4 w-4 mr-2 text-[#E63946]" />
                    Gothiram
                  </Label>
                  <Select
                    value={advancedGothiram}
                    onValueChange={setAdvancedGothiram}
                  >
                    <SelectTrigger
                      id="advancedGothiram"
                      className="h-11 border-gray-200 focus:border-[#E63946]"
                    >
                      <SelectValue placeholder="Select Gothiram" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      <SelectItem value="__none__">All Gothirams</SelectItem>
                      {gothiramOptions.map((gothiram) => (
                        <SelectItem key={gothiram._id} value={gothiram.name}>
                          {gothiram.name}
                          {/* ({gothiram.tamilName}) */}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-3">
                  {/* Admin Status Filter - REMOVED: Always search approved users only */}
                  {/* {isAdmin && (
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger className="w-40 h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="approved">Approved Only</SelectItem>
                      </SelectContent>
                    </Select>
                  )} */}

                  {loading && (
                    <div className="flex items-center space-x-2 text-[#E63946]">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Searching...</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleClearAdvanced}
                    disabled={
                      !advancedName &&
                      !advancedEmail &&
                      !advancedNativePlace &&
                      !advancedGothiram
                    }
                    className="h-11 px-6"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear All
                  </Button>

                  <Button
                    onClick={() => {
                      if (
                        advancedName.length >= 2 ||
                        advancedEmail.length >= 2 ||
                        advancedNativePlace.length >= 2 ||
                        advancedGothiram
                      ) {
                        performAdvancedSearch();
                      }
                    }}
                    disabled={
                      !advancedName &&
                      !advancedEmail &&
                      !advancedNativePlace &&
                      !advancedGothiram
                    }
                    className="h-11 px-8 avs-button-primary"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>

              {/* Simple Tips */}
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-2">
                  <Sparkles className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-blue-900 mb-1 text-sm">
                      Search Tips
                    </div>
                    <p className="text-xs text-blue-700">
                      Use any combination of fields. Leave fields empty to
                      search by other criteria. All filled fields must match.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Search Results Dropdown */}
      {showResults &&
        ((query.length >= 2 && !showAdvanced) ||
          (showAdvanced &&
            (advancedName.length >= 2 ||
              advancedEmail.length >= 2 ||
              advancedNativePlace.length >= 2 ||
              (advancedGothiram && advancedGothiram !== "__none__")))) && (
          <Card className="absolute top-full mt-2 w-full max-h-96 overflow-y-auto z-50 shadow-xl">
            {results.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No users found matching your search criteria</p>
              </div>
            ) : (
              <div className="divide-y">
                {results.map((user) => (
                  <div
                    key={user._id}
                    className="p-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.profilePicture} />
                        <AvatarFallback className="avs-gradient text-white">
                          {user.firstName?.[0]}
                          {user.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>

                      <div
                        className="flex-1 min-w-0 cursor-pointer"
                        onClick={() => handleSelectUser(user)}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-gray-900">
                            {user.firstName} {user.lastName}
                          </p>
                          {isAdmin && user.role === "admin" && (
                            <Badge className="bg-red-100 text-red-800 text-xs">
                              Admin
                            </Badge>
                          )}
                          {isAdmin && !user.isApprovedByAdmin && (
                            <Badge
                              variant="outline"
                              className="text-yellow-700 text-xs"
                            >
                              Pending
                            </Badge>
                          )}
                          {user.enableMarriageFlag &&
                            env.MATRIMONIAL_FEATURE && (
                              <Badge className="bg-pink-100 text-pink-800 text-xs">
                                Matrimony
                              </Badge>
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

                      <div className="flex items-center gap-2">
                        {user.gender && (
                          <Badge variant="outline" className="text-xs">
                            {user.gender}
                          </Badge>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedUserId(user._id);
                            setIsModalOpen(true);
                            setShowResults(false); // Close search results popup
                            if (onViewProfile) {
                              onViewProfile(user._id);
                            }
                          }}
                          className="h-7 px-2"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {results.length > 0 && (
              <div className="p-2 bg-gray-50 text-center text-xs text-gray-500 border-t">
                Found {results.length} user{results.length !== 1 ? "s" : ""}
              </div>
            )}
          </Card>
        )}

      {/* User Details Modal */}
      <UserDetailsModal
        userId={selectedUserId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
