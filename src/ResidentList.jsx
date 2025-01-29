import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Download,
  Printer,
  Share2,
  MapPin,
  Cake,
  Heart,
  AlertTriangle,
  ArrowUpRight,
  User,
  Mail,
  Phone,
  X,
} from "lucide-react";
import { getResidents } from "../services/api";
import Sidebar from "./SideBar";

const ResidentList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    ageRange: "all",
    gender: "all",
  });

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  };

  const formatLastUpdated = (updatedAt) => {
    const now = new Date();
    const updated = new Date(updatedAt);
    const diffInHours = Math.floor((now - updated) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours === 1) return "1 hour ago";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  const getAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const fetchResidents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getResidents();

      const transformedResidents = response.residents.map((resident) => ({
        id: resident._id,
        basicInfo: {
          name: resident.fullName,
          dateOfBirth: formatDate(resident.dateOfBirth),
          gender: resident.gender,
          contact: resident.contactNumber,
          email: resident.emergencyContact.email,
          joinDate: new Date(resident.createdAt).toISOString().split("T")[0],
          address: resident.address,
        },
        emergencyContact: {
          name: resident.emergencyContact.name,
          phone: resident.emergencyContact.phone,
          email: resident.emergencyContact.email,
          relation: resident.emergencyContact.relation,
        },
        health: {
          status: resident.status === "active" ? "Stable" : "Critical",
          lastUpdated: formatLastUpdated(resident.updatedAt),
        },
      }));

      setResidents(transformedResidents);
    } catch (err) {
      setError(err.message || "Error fetching residents");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResidents();
  }, [fetchResidents]);

  const filterResidents = (residentsToFilter) => {
    return residentsToFilter.filter((resident) => {
      const age = getAge(resident.basicInfo.dateOfBirth);
      const matchesSearch = resident.basicInfo.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesAgeRange =
        filters.ageRange === "all" ||
        (filters.ageRange === "under65" && age < 65) ||
        (filters.ageRange === "65-75" && age >= 65 && age <= 75) ||
        (filters.ageRange === "75-85" && age > 75 && age <= 85) ||
        (filters.ageRange === "above85" && age > 85);

      const matchesGender =
        filters.gender === "all" ||
        resident.basicInfo.gender.toLowerCase() ===
          filters.gender.toLowerCase();

      return matchesSearch && matchesAgeRange && matchesGender;
    });
  };

  const FilterPanel = () => (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="filter-panel"
    >
      <div
        className="fixed inset-0 bg-black bg-opacity-25"
        onClick={() => setShowFilters(false)}
      ></div>
      <div className="relative min-h-screen flex items-start justify-end p-4">
        <div className="relative bg-white rounded-xl shadow-lg p-6 w-80 mt-16 mr-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-900">Filter</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age Range
              </label>
              <select
                value={filters.ageRange}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, ageRange: e.target.value }))
                }
                className="w-full p-2 border border-gray-200 rounded-lg text-sm"
              >
                <option value="all">All Ages</option>
                <option value="under65">Under 65</option>
                <option value="65-75">65-75</option>
                <option value="75-85">75-85</option>
                <option value="above85">Above 85</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                value={filters.gender}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, gender: e.target.value }))
                }
                className="w-full p-2 border border-gray-200 rounded-lg text-sm"
              >
                <option value="all">All</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const filteredResidents = filterResidents(residents);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 font-poppins">
        <Sidebar activePage="residents-list" />
        <div className="ml-72 p-8 flex items-center justify-center">
          <div className="text-gray-600">Loading residents...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 font-poppins">
        <Sidebar activePage="residents-list" />
        <div className="ml-72 p-8 flex items-center justify-center">
          <div className="text-red-600">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 font-poppins">
      <Sidebar activePage="residents-list" />

      <div className="ml-72 p-8">
        <div className="mb-8 bg-white/90 backdrop-blur-xl p-8 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                Residents List
              </h1>
              <p className="text-gray-600 mt-2">
                Manage and monitor resident information
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                <Download className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                <Printer className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
              <div className="h-6 w-px bg-gray-200 mx-2"></div>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search residents..."
                  className="pl-12 pr-4 py-3 w-72 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <button
                onClick={() => setShowFilters(true)}
                className="flex items-center gap-2 px-4 py-3 text-gray-700 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <Filter className="h-5 w-5" />
                <span>Filter</span>
              </button>
            </div>
          </div>
        </div>

        {showFilters && <FilterPanel />}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredResidents.map((resident) => (
            <div
              key={resident.id}
              className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold">
                    {resident.basicInfo.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {resident.basicInfo.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                      <MapPin className="h-4 w-4" />
                      {resident.basicInfo.address}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-3 bg-gray-50/50 rounded-xl">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <Cake className="h-4 w-4" />
                    Date of Birth
                  </div>
                  <p className="font-semibold text-sm">
                    {resident.basicInfo.dateOfBirth}
                  </p>
                </div>
                <div className="p-3 bg-gray-50/50 rounded-xl">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <Heart className="h-4 w-4" />
                    Gender
                  </div>
                  <p className="font-semibold">{resident.basicInfo.gender}</p>
                </div>
              </div>

              <div className="space-y-3 mb-6 p-4 bg-gray-50/50 rounded-xl">
                <h4 className="font-medium text-gray-700">Emergency Contact</h4>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span>
                    {resident.emergencyContact.name} (
                    {resident.emergencyContact.relation})
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{resident.emergencyContact.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{resident.emergencyContact.email}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl hover:from-red-700 hover:to-red-600 transition-colors">
                    <AlertTriangle className="h-5 w-5" />
                    <span className="font-medium">Emergency Alert</span>
                  </button>
                  <button
                    onClick={() => navigate(`/residents/${resident.id}`)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-cyan-500 rounded-xl hover:bg-blue-100 transition-colors"
                  >
                    View Details
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResidentList;
