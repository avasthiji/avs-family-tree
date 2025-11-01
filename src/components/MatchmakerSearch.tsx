"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, X, User, MapPin } from "lucide-react";
import { toast } from "sonner";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  gothiram?: string;
  nativePlace?: string;
  city?: string;
  state?: string;
  profilePicture?: string;
}

interface MatchmakerSearchProps {
  value?: string;
  onChange: (matchmakerId: string | undefined) => void;
  disabled?: boolean;
}

export default function MatchmakerSearch({
  value,
  onChange,
  disabled = false,
}: MatchmakerSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedMatchmaker, setSelectedMatchmaker] = useState<User | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch selected matchmaker details when value changes
  useEffect(() => {
    if (value && !selectedMatchmaker) {
      fetchMatchmakerDetails(value);
    } else if (!value && selectedMatchmaker) {
      // Clear selected matchmaker if value is cleared
      setSelectedMatchmaker(null);
    }
  }, [value]);

  // Debug logging
  useEffect(() => {
    console.log('MatchmakerSearch state:', {
      showResults,
      searchResults: searchResults.length,
      isSearching,
      searchQuery
    });
  }, [showResults, searchResults.length, isSearching, searchQuery]);

  const fetchMatchmakerDetails = async (matchmakerId: string) => {
    try {
      const response = await fetch(`/api/users/profile?userId=${matchmakerId}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedMatchmaker(data.user);
      }
    } catch (error) {
      console.error("Error fetching matchmaker details:", error);
    }
  };

  const searchUsers = async (query: string) => {
    const trimmedQuery = query.trim();
    if (trimmedQuery.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(trimmedQuery)}&filter=name&limit=10`
      );
      if (response.ok) {
        const data = await response.json();
        console.log('Search results received:', data.users);
        setSearchResults(data.users || []);
        setShowResults(true); // Show results when search completes
      } else {
        toast.error("Failed to search users");
        setShowResults(false);
      }
    } catch (error) {
      console.error("Error searching users:", error);
      toast.error("Error searching users");
      setShowResults(false);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for search
    searchTimeoutRef.current = setTimeout(() => {
      searchUsers(query.trim());
    }, 300);
  };

  const handleUserSelect = (user: User) => {
    setSelectedMatchmaker(user);
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
    onChange(user._id);
  };

  const handleClear = () => {
    setSelectedMatchmaker(null);
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
    onChange(undefined);
  };

  const handleInputFocus = () => {
    if (searchQuery.length >= 2 && searchResults.length > 0) {
      setShowResults(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding results to allow clicking on them
    setTimeout(() => setShowResults(false), 200);
  };

  return (
    <div className="relative">
      {selectedMatchmaker ? (
        <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={selectedMatchmaker.profilePicture} />
              <AvatarFallback className="avs-gradient text-white">
                {selectedMatchmaker.firstName[0]}
                {selectedMatchmaker.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-gray-900">
                {selectedMatchmaker.firstName} {selectedMatchmaker.lastName}
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                {selectedMatchmaker.gothiram && (
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {selectedMatchmaker.gothiram}
                  </span>
                )}
                {(selectedMatchmaker.nativePlace || selectedMatchmaker.city) && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {selectedMatchmaker.nativePlace || selectedMatchmaker.city}
                  </span>
                )}
              </div>
            </div>
          </div>
          {!disabled && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for a matchmaker..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              disabled={disabled}
              className="pl-10"
            />
          </div>

          {/* Search Results */}
          {showResults && (searchResults.length > 0 || isSearching) && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {isSearching ? (
                <div className="p-4 text-center text-gray-500">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-600 mx-auto"></div>
                  <p className="mt-2 text-sm">Searching...</p>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="py-2">
                  {searchResults.map((user) => (
                    <button
                      key={user._id}
                      onClick={() => handleUserSelect(user)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.profilePicture} />
                          <AvatarFallback className="avs-gradient text-white text-xs">
                            {user.firstName[0]}
                            {user.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {user.firstName} {user.lastName}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            {user.gothiram && (
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {user.gothiram}
                              </span>
                            )}
                            {(user.nativePlace || user.city) && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {user.nativePlace || user.city}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : searchQuery.length >= 2 ? (
                <div className="p-4 text-center text-gray-500">
                  <p className="text-sm">No users found</p>
                </div>
              ) : null}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
